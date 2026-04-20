const Asistencia = require('../models/Asistencia');
const storage = require('../storage/MemoryStorage');

class AsistenciasService {

  // Registrar una nueva asistencia
  async registrarAsistencia(estudianteId, fecha, estado) {
    // Validar que el estudiante existe
    if (!storage.existeEstudiantePorId(estudianteId)) {
      const error = new Error('No se encontró un estudiante con el ID especificado');
      error.code = 'STUDENT_NOT_FOUND';
      error.statusCode = 404;
      error.details = {
        field: 'estudianteId',
        value: estudianteId
      };
      throw error;
    }

    // Validar formato y valor de la fecha
    if (!Asistencia.validarFecha(fecha)) {
      const error = new Error('La fecha debe ser válida, en formato YYYY-MM-DD y no puede ser futura');
      error.code = 'INVALID_DATE';
      error.statusCode = 400;
      error.details = {
        field: 'fecha',
        value: fecha,
        expected: 'YYYY-MM-DD (no futura)'
      };
      throw error;
    }

    // Validar estado de asistencia
    if (!Asistencia.validarEstado(estado)) {
      const error = new Error('El estado de asistencia debe ser: presente, ausente o justificada');
      error.code = 'INVALID_ATTENDANCE_STATE';
      error.statusCode = 400;
      error.details = {
        field: 'estado',
        value: estado,
        allowed: Asistencia.ESTADOS_VALIDOS
      };
      throw error;
    }

    // Verificar que no exista una asistencia duplicada
    if (storage.existeAsistencia(estudianteId, fecha)) {
      const error = new Error('Ya existe un registro de asistencia para este estudiante en la fecha especificada');
      error.code = 'DUPLICATE_ATTENDANCE';
      error.statusCode = 409;
      error.details = {
        estudianteId: estudianteId,
        fecha: fecha
      };
      throw error;
    }

    // Crear y guardar la asistencia
    const asistencia = new Asistencia(estudianteId, fecha, estado);
    storage.guardarAsistencia(asistencia);

    return asistencia.toJSON();
  }

  // Listar asistencias de un estudiante específico
  async listarPorEstudiante(estudianteId) {
    // Validar que el estudiante existe
    if (!storage.existeEstudiantePorId(estudianteId)) {
      const error = new Error('No se encontró un estudiante con el ID especificado');
      error.code = 'STUDENT_NOT_FOUND';
      error.statusCode = 404;
      error.details = {
        field: 'estudianteId',
        value: estudianteId
      };
      throw error;
    }

    const asistencias = storage.obtenerAsistenciasPorEstudiante(estudianteId);
    
    if (asistencias.length === 0) {
      const error = new Error('No hay registros de asistencia para este estudiante');
      error.code = 'NO_ATTENDANCE_RECORDS';
      error.statusCode = 404;
      error.details = {
        estudianteId: estudianteId
      };
      throw error;
    }

    // Ordenar por fecha (más reciente primero)
    return asistencias
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .map(asistencia => asistencia.toJSON());
  }

  // Verificar si existe una asistencia específica
  async existeAsistencia(estudianteId, fecha) {
    return storage.existeAsistencia(estudianteId, fecha);
  }

  // Obtener todas las asistencias (para reportes)
  async obtenerTodasLasAsistencias() {
    return storage.obtenerTodasLasAsistencias();
  }

  // Validar formato de fecha
  validarFecha(fecha) {
    return Asistencia.validarFecha(fecha);
  }

  // Validar estado de asistencia
  validarEstado(estado) {
    return Asistencia.validarEstado(estado);
  }

  // Obtener estadísticas de asistencias
  async obtenerEstadisticas() {
    const todasLasAsistencias = storage.obtenerTodasLasAsistencias();
    const estadisticas = {
      totalAsistencias: todasLasAsistencias.length,
      porEstado: {
        presente: 0,
        ausente: 0,
        justificada: 0
      }
    };

    todasLasAsistencias.forEach(asistencia => {
      estadisticas.porEstado[asistencia.estado]++;
    });

    return estadisticas;
  }
}

module.exports = new AsistenciasService();