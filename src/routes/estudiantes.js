const express = require('express');
const router = express.Router();
const estudiantesController = require('../controllers/EstudiantesController');
const { validarCrearEstudiante, validarIdEstudiante } = require('../middleware/validators');

// POST /api/estudiantes - Crear un nuevo estudiante
router.post('/', 
  validarCrearEstudiante,
  estudiantesController.crearEstudiante
);

// GET /api/estudiantes - Listar todos los estudiantes
router.get('/', 
  estudiantesController.listarEstudiantes
);

// GET /api/estudiantes/:id - Obtener un estudiante por ID
router.get('/:id', 
  validarIdEstudiante,
  estudiantesController.obtenerEstudiantePorId
);

// GET /api/estudiantes/stats - Obtener estadísticas de estudiantes
router.get('/stats/general', 
  estudiantesController.obtenerEstadisticas
);

module.exports = router;