const { validationResult } = require('express-validator');
const reportesService = require('../services/ReportesService');

class ReportesController {

  // Obtener reporte de top 5 estudiantes con más ausencias
  async obtenerReporteAusentismo(req, res, next) {
    try {
      const reporte = await reportesService.obtenerTop5Ausentismo();

      res.status(200).json({
        success: true,
        data: reporte
      });

    } catch (error) {
      next(error);
    }
  }

  // Obtener reporte completo de asistencias por estudiante
  async obtenerReporteCompletoAsistencias(req, res, next) {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error('Parámetros de búsqueda inválidos');
        error.code = 'VALIDATION_ERROR';
        error.statusCode = 400;
        error.details = {
          errors: errors.array()
        };
        return next(error);
      }

      const reporte = await reportesService.obtenerReporteCompletoAsistencias();

      res.status(200).json({
        success: true,
        data: reporte
      });

    } catch (error) {
      next(error);
    }
  }

  // Obtener estadísticas generales del sistema
  async obtenerEstadisticasGenerales(req, res, next) {
    try {
      const estadisticas = await reportesService.obtenerEstadisticasGenerales();

      res.status(200).json({
        success: true,
        data: estadisticas
      });

    } catch (error) {
      next(error);
    }
  }

  // Obtener estudiantes sin registros de asistencia
  async obtenerEstudiantesSinAsistencias(req, res, next) {
    try {
      const estudiantes = await reportesService.obtenerEstudiantesSinAsistencias();

      res.status(200).json({
        success: true,
        data: estudiantes,
        total: estudiantes.length
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReportesController();