// Middleware de manejo centralizado de errores
const errorHandler = (err, req, res, next) => {
  // Log del error para debugging
  console.error('Error capturado:', {
    message: err.message,
    code: err.code,
    statusCode: err.statusCode,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Estructura base de respuesta de error
  const response = {
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Error interno del servidor',
      details: err.details || {}
    }
  };

  // Determinar código de estado HTTP
  let statusCode = err.statusCode || 500;

  // Manejo específico de tipos de error
  switch (err.code) {
    case 'INVALID_STUDENT_CODE':
    case 'INVALID_DATE':
    case 'INVALID_ATTENDANCE_STATE':
    case 'MISSING_REQUIRED_FIELDS':
    case 'INVALID_UUID':
    case 'VALIDATION_ERROR':
      statusCode = 400;
      break;
    
    case 'DUPLICATE_STUDENT_CODE':
    case 'DUPLICATE_ATTENDANCE':
      statusCode = 409;
      break;
    
    case 'STUDENT_NOT_FOUND':
    case 'NO_ATTENDANCE_RECORDS':
      statusCode = 404;
      break;
    
    case 'INTERNAL_ERROR':
    default:
      statusCode = 500;
      // En producción, no exponer detalles internos
      if (process.env.NODE_ENV === 'production') {
        response.error.message = 'Error interno del servidor';
        response.error.details = {};
      }
      break;
  }

  // Enviar respuesta de error
  res.status(statusCode).json(response);
};

// Middleware para manejar rutas no encontradas
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Ruta ${req.method} ${req.path} no encontrada`,
      details: {
        method: req.method,
        path: req.path
      }
    }
  });
};

// Middleware para logging de requests (opcional)
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log de request entrante
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - IP: ${req.ip}`);
  
  // Interceptar el final de la respuesta para logging
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    originalSend.call(this, data);
  };
  
  next();
};

// Función para crear errores personalizados
const createError = (message, code, statusCode = 500, details = {}) => {
  const error = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  error.details = details;
  return error;
};

module.exports = {
  errorHandler,
  notFoundHandler,
  requestLogger,
  createError
};