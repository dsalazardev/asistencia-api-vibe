const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Importar middleware personalizado
const { errorHandler, notFoundHandler, requestLogger } = require('./middleware/errorHandler');

// Importar rutas
const estudiantesRoutes = require('./routes/estudiantes');
const asistenciasRoutes = require('./routes/asistencias');
const reportesRoutes = require('./routes/reportes');

// Crear aplicación Express
const app = express();

// Configuración de middleware de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// Configuración de CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging (solo en desarrollo)
if (process.env.NODE_ENV !== 'production') {
  app.use(requestLogger);
}

// Ruta de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API de Gestión de Asistencia Estudiantil funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Ruta de información de la API
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API de Gestión de Asistencia Estudiantil',
    version: '1.0.0',
    endpoints: {
      estudiantes: {
        'POST /api/estudiantes': 'Crear un nuevo estudiante',
        'GET /api/estudiantes': 'Listar todos los estudiantes',
        'GET /api/estudiantes/:id': 'Obtener un estudiante por ID'
      },
      asistencias: {
        'POST /api/asistencias': 'Registrar una asistencia',
        'GET /api/asistencias/estudiante/:id': 'Listar asistencias de un estudiante'
      },
      reportes: {
        'GET /api/reportes/ausentismo': 'Top 5 estudiantes con más ausencias',
        'GET /api/reportes/asistencias': 'Reporte completo de asistencias',
        'GET /api/reportes/estadisticas': 'Estadísticas generales del sistema'
      }
    }
  });
});

// Montar rutas de la API
app.use('/api/estudiantes', estudiantesRoutes);
app.use('/api/asistencias', asistenciasRoutes);
app.use('/api/reportes', reportesRoutes);

// Middleware para rutas no encontradas
app.use(notFoundHandler);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Configuración del puerto
const PORT = process.env.PORT || 3000;

// Función para iniciar el servidor
const startServer = () => {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
    console.log(`📚 API de Gestión de Asistencia Estudiantil v1.0.0`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    console.log(`📖 Documentación: http://localhost:${PORT}/api`);
    console.log(`⚡ Entorno: ${process.env.NODE_ENV || 'development'}`);
  });

  // Manejo elegante de cierre del servidor
  process.on('SIGTERM', () => {
    console.log('🛑 Recibida señal SIGTERM, cerrando servidor...');
    server.close(() => {
      console.log('✅ Servidor cerrado correctamente');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('🛑 Recibida señal SIGINT, cerrando servidor...');
    server.close(() => {
      console.log('✅ Servidor cerrado correctamente');
      process.exit(0);
    });
  });

  return server;
};

// Iniciar servidor solo si este archivo se ejecuta directamente
if (require.main === module) {
  startServer();
}

// Exportar la aplicación para tests
module.exports = app;