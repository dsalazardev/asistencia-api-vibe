// Modelo de datos para Estudiante
class Estudiante {
  constructor(codigo, nombre) {
    this.id = require('uuid').v4();
    this.codigo = codigo;
    this.nombre = nombre;
    this.fechaCreacion = new Date();
  }

  // Validación de formato de código EST\d{5}
  static validarCodigoFormato(codigo) {
    const patron = /^EST\d{5}$/;
    return patron.test(codigo);
  }

  // Convertir a objeto plano para respuestas JSON
  toJSON() {
    return {
      id: this.id,
      codigo: this.codigo,
      nombre: this.nombre,
      fechaCreacion: this.fechaCreacion
    };
  }

  // Convertir a objeto simplificado para listados
  toSimpleJSON() {
    return {
      id: this.id,
      codigo: this.codigo,
      nombre: this.nombre
    };
  }
}

module.exports = Estudiante;