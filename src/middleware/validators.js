const { body, param, query } = require('express-validator');

// Validadores para estudiantes
const validarCrearEstudiante = [
  body('codigo')
    .notEmpty()
    .withMessage('El código del estudiante es requerido')
    .matches(/^EST\d{5}$/)
    .withMessage('El código debe seguir el formato EST seguido de 5 dígitos (ej: EST00123)'),
  
  body('nombre')
    .notEmpty()
    .withMessage('El nombre del estudiante es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .trim()
];

const validarIdEstudiante = [
  param('id')
    .isUUID(4)
    .withMessage('El ID debe ser un UUID válido')
];

// Validadores para asistencias
const validarCrearAsistencia = [
  body('estudianteId')
    .notEmpty()
    .withMessage('El ID del estudiante es requerido')
    .isUUID(4)
    .withMessage('El ID del estudiante debe ser un UUID válido'),
  
  body('fecha')
    .notEmpty()
    .withMessage('La fecha es requerida')
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('La fecha debe estar en formato YYYY-MM-DD')
    .custom((value) => {
      const fecha = new Date(value + 'T00:00:00.000Z');
      if (isNaN(fecha.getTime())) {
        throw new Error('La fecha proporcionada no es válida');
      }
      
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fecha > hoy) {
        throw new Error('La fecha no puede ser futura');
      }
      
      return true;
    }),
  
  body('estado')
    .notEmpty()
    .withMessage('El estado de asistencia es requerido')
    .isIn(['presente', 'ausente', 'justificada'])
    .withMessage('El estado debe ser: presente, ausente o justificada')
];

const validarIdAsistencia = [
  param('id')
    .isUUID(4)
    .withMessage('El ID del estudiante debe ser un UUID válido')
];

// Validadores para reportes
const validarFechasReporte = [
  query('fechaInicio')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('La fecha de inicio debe estar en formato YYYY-MM-DD')
    .isLength({ max: 10 })
    .withMessage('El parámetro fechaInicio es demasiado largo'),
    
  query('fechaFin')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('La fecha de fin debe estar en formato YYYY-MM-DD')
    .isLength({ max: 10 })
    .withMessage('El parámetro fechaFin es demasiado largo')
    .custom((value, { req }) => {
      if (req.query.fechaInicio && value) {
        const inicio = new Date(req.query.fechaInicio);
        const fin = new Date(value);
        if (inicio > fin) {
          throw new Error('La fecha de inicio no puede ser mayor a la fecha de fin');
        }
      }
      return true;
    })
];

// Validadores personalizados adicionales
const validarCodigoEstudiante = (codigo) => {
  const patron = /^EST\d{5}$/;
  return patron.test(codigo);
};

const validarFechaNoFutura = (fecha) => {
  const fechaObj = new Date(fecha + 'T00:00:00.000Z');
  if (isNaN(fechaObj.getTime())) {
    return false;
  }
  
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  return fechaObj <= hoy;
};

const validarEstadoAsistencia = (estado) => {
  const estadosValidos = ['presente', 'ausente', 'justificada'];
  return estadosValidos.includes(estado);
};

const validarUUID = (uuid) => {
  const patronUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return patronUUID.test(uuid);
};

module.exports = {
  // Validadores de estudiantes
  validarCrearEstudiante,
  validarIdEstudiante,
  
  // Validadores de asistencias
  validarCrearAsistencia,
  validarIdAsistencia,

  // Validadores de reportes
  validarFechasReporte,
  
  // Funciones de validación personalizadas
  validarCodigoEstudiante,
  validarFechaNoFutura,
  validarEstadoAsistencia,
  validarUUID
};