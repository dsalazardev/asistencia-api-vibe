const express = require('express');
const router = express.Router();
const asistenciasController = require('../controllers/AsistenciasController');
const { validarCrearAsistencia, validarIdAsistencia } = require('../middleware/validators');

// POST /api/asistencias - Registrar una nueva asistencia
router.post('/', 
  validarCrearAsistencia,
  asistenciasController.registrarAsistencia
);

// GET /api/asistencias/estudiante/:id - Listar asistencias de un estudiante
router.get('/estudiante/:id', 
  validarIdAsistencia,
  asistenciasController.listarAsistenciasPorEstudiante
);

// GET /api/asistencias/stats - Obtener estadísticas de asistencias
router.get('/stats/general', 
  asistenciasController.obtenerEstadisticas
);

module.exports = router;