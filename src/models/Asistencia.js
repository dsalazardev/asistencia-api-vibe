// Modelo de datos para Asistencia
class Asistencia {
  constructor(estudianteId, fecha, estado) {
    this.id = require('uuid').v4();
    this.estudianteId = estudianteId;
    this.fecha = fecha;
    this.estado = estado;
    this.fechaRegistro = new Date();
  }

  // Estados válidos de asistencia
  static get ESTADOS_VALIDOS() {
    return ['presente', 'ausente', 'justificada'];
  }

  // Validación de estado de asistencia
  static validarEstado(estado) {
    return Asistencia.ESTADOS_VALIDOS.includes(estado);
  }

  // Validación de fecha (formato ISO 8601 y no futura)
  static validarFecha(fecha) {
    // Verificar formato ISO 8601 (YYYY-MM-DD)
    const patronFecha = /^\d{4}-\d{2}-\d{2}$/;
    if (!patronFecha.test(fecha)) {
      return false;
    }

    // Verificar que sea una fecha válida
    const fechaObj = new Date(fecha + 'T00:00:00.000Z');
    if (isNaN(fechaObj.getTime())) {
      return false;
    }

    // Verificar que no sea futura
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fechaObj <= hoy;
  }

  // Convertir a objeto plano para respuestas JSON
  toJSON() {
    return {
      id: this.id,
      estudianteId: this.estudianteId,
      fecha: this.fecha,
      estado: this.estado,
      fechaRegistro: this.fechaRegistro
    };
  }
}

module.exports = Asistencia;