const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/ReportesController');
const { validarFechasReporte } = require('../middleware/validators');

// GET /api/reportes/ausentismo - Top 5 estudiantes con más ausencias
router.get('/ausentismo', 
  reportesController.obtenerReporteAusentismo
);

// GET /api/reportes/asistencias - Reporte completo de asistencias por estudiante
router.get('/asistencias', 
  validarFechasReporte,
  reportesController.obtenerReporteCompletoAsistencias
);

// GET /api/reportes/estadisticas - Estadísticas generales del sistema
router.get('/estadisticas', 
  reportesController.obtenerEstadisticasGenerales
);

// GET /api/reportes/sin-asistencias - Estudiantes sin registros de asistencia
router.get('/sin-asistencias', 
  reportesController.obtenerEstudiantesSinAsistencias
);

module.exports = router;