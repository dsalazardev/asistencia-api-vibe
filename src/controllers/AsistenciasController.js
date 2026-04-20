const { validationResult } = require('express-validator');
const asistenciasService = require('../services/AsistenciasService');

class AsistenciasController {

  // Registrar una nueva asistencia
  async registrarAsistencia(req, res, next) {
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

      const { estudianteId, fecha, estado } = req.body;

      // Registrar asistencia usando el servicio
      const asistencia = await asistenciasService.registrarAsistencia(estudianteId, fecha, estado);

      // Respuesta exitosa
      res.status(201).json({
        success: true,
        data: asistencia
      });

    } catch (error) {
      next(error);
    }
  }

  // Listar asistencias de un estudiante específico
  async listarAsistenciasPorEstudiante(req, res, next) {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error('ID de estudiante inválido');
        error.code = 'VALIDATION_ERROR';
        error.statusCode = 400;
        error.details = {
          errors: errors.array()
        };
        return next(error);
      }

      const { id } = req.params;

      // Obtener asistencias usando el servicio
      const asistencias = await asistenciasService.listarPorEstudiante(id);

      res.status(200).json({
        success: true,
        data: asistencias,
        total: asistencias.length
      });

    } catch (error) {
      next(error);
    }
  }

  // Obtener estadísticas de asistencias
  async obtenerEstadisticas(req, res, next) {
    try {
      const estadisticas = await asistenciasService.obtenerEstadisticas();

      res.status(200).json({
        success: true,
        data: estadisticas
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AsistenciasController();