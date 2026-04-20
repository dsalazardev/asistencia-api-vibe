const { validationResult } = require('express-validator');
const estudiantesService = require('../services/EstudiantesService');

class EstudiantesController {

  // Crear un nuevo estudiante
  async crearEstudiante(req, res, next) {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error('Datos de entrada inválidos');
        error.code = 'VALIDATION_ERROR';
        error.statusCode = 400;
        error.details = {
          errors: errors.array()
        };
        return next(error);
      }

      const { codigo, nombre } = req.body;

      // Crear estudiante usando el servicio
      const estudiante = await estudiantesService.crearEstudiante(codigo, nombre);

      // Respuesta exitosa
      res.status(201).json({
        success: true,
        data: estudiante.toJSON()
      });

    } catch (error) {
      next(error);
    }
  }

  // Listar todos los estudiantes
  async listarEstudiantes(req, res, next) {
    try {
      const estudiantes = await estudiantesService.listarTodos();

      res.status(200).json({
        success: true,
        data: estudiantes,
        total: estudiantes.length
      });

    } catch (error) {
      next(error);
    }
  }

  // Obtener un estudiante por ID
  async obtenerEstudiantePorId(req, res, next) {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error('ID inválido');
        error.code = 'VALIDATION_ERROR';
        error.statusCode = 400;
        error.details = {
          errors: errors.array()
        };
        return next(error);
      }

      const { id } = req.params;

      // Obtener estudiante usando el servicio
      const estudiante = await estudiantesService.obtenerPorId(id);

      res.status(200).json({
        success: true,
        data: estudiante
      });

    } catch (error) {
      next(error);
    }
  }

  // Obtener estadísticas de estudiantes
  async obtenerEstadisticas(req, res, next) {
    try {
      const estadisticas = await estudiantesService.obtenerEstadisticas();

      res.status(200).json({
        success: true,
        data: estadisticas
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EstudiantesController();