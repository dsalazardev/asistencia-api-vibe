const Estudiante = require('../models/Estudiante');
const storage = require('../storage/MemoryStorage');

class EstudiantesService {
  
  // Crear un nuevo estudiante
  async crearEstudiante(codigo, nombre) {
    // Validar formato del código
    if (!Estudiante.validarCodigoFormato(codigo)) {
      const error = new Error('El código del estudiante debe seguir el formato EST seguido de 5 dígitos');
      error.code = 'INVALID_STUDENT_CODE';
      error.statusCode = 400;
      error.details = {
        field: 'codigo',
        value: codigo,
        expected: 'EST\\d{5}'
      };
      throw error;
    }

    // Validar que el nombre no esté vacío
    if (!nombre || nombre.trim().length === 0) {
      const error = new Error('El nombre del estudiante es requerido');
      error.code = 'MISSING_REQUIRED_FIELDS';
      error.statusCode = 400;
      error.details = {
        field: 'nombre',
        message: 'El nombre no puede estar vacío'
      };
      throw error;
    }

    // Verificar unicidad del código
    if (storage.existeEstudiantePorCodigo(codigo)) {
      const error = new Error(`Ya existe un estudiante con el código ${codigo}`);
      error.code = 'DUPLICATE_STUDENT_CODE';
      error.statusCode = 409;
      error.details = {
        field: 'codigo',
        value: codigo
      };
      throw error;
    }

    // Crear y guardar el estudiante
    const estudiante = new Estudiante(codigo, nombre.trim());
    storage.guardarEstudiante(estudiante);

    return estudiante;
  }

  // Listar todos los estudiantes
  async listarTodos() {
    const estudiantes = storage.obtenerTodosLosEstudiantes();
    return estudiantes.map(estudiante => estudiante.toSimpleJSON());
  }

  // Obtener un estudiante por ID
  async obtenerPorId(id) {
    // Validar formato UUID
    if (!this.validarUUID(id)) {
      const error = new Error('El ID proporcionado no tiene un formato válido');
      error.code = 'INVALID_UUID';
      error.statusCode = 400;
      error.details = {
        field: 'id',
        value: id
      };
      throw error;
    }

    const estudiante = storage.obtenerEstudiantePorId(id);
    
    if (!estudiante) {
      const error = new Error('No se encontró un estudiante con el ID especificado');
      error.code = 'STUDENT_NOT_FOUND';
      error.statusCode = 404;
      error.details = {
        field: 'id',
        value: id
      };
      throw error;
    }

    return estudiante.toJSON();
  }

  // Verificar si existe un estudiante por ID
  async existeEstudiante(id) {
    return storage.existeEstudiantePorId(id);
  }

  // Validar formato UUID v4
  validarUUID(uuid) {
    const patronUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return patronUUID.test(uuid);
  }

  // Obtener estadísticas de estudiantes
  async obtenerEstadisticas() {
    return {
      totalEstudiantes: storage.obtenerTodosLosEstudiantes().length
    };
  }
}

module.exports = new EstudiantesService();