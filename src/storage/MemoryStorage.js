// Sistema de almacenamiento en memoria
class MemoryStorage {
  constructor() {
    // Almacenamiento principal
    this.estudiantes = new Map(); // Map<id, Estudiante>
    this.asistencias = new Map(); // Map<id, Asistencia>
    
    // Índices para búsquedas rápidas
    this.indiceCodigos = new Map(); // Map<codigo, id> para búsqueda por código
    this.indiceAsistencias = new Map(); // Map<estudianteId, Array<Asistencia>>
  }

  // Métodos para estudiantes
  guardarEstudiante(estudiante) {
    this.estudiantes.set(estudiante.id, estudiante);
    this.indiceCodigos.set(estudiante.codigo, estudiante.id);
  }

  obtenerEstudiantePorId(id) {
    return this.estudiantes.get(id);
  }

  obtenerEstudiantePorCodigo(codigo) {
    const id = this.indiceCodigos.get(codigo);
    return id ? this.estudiantes.get(id) : null;
  }

  obtenerTodosLosEstudiantes() {
    return Array.from(this.estudiantes.values());
  }

  existeEstudiantePorCodigo(codigo) {
    return this.indiceCodigos.has(codigo);
  }

  existeEstudiantePorId(id) {
    return this.estudiantes.has(id);
  }

  // Métodos para asistencias
  guardarAsistencia(asistencia) {
    this.asistencias.set(asistencia.id, asistencia);
    
    // Actualizar índice por estudiante
    if (!this.indiceAsistencias.has(asistencia.estudianteId)) {
      this.indiceAsistencias.set(asistencia.estudianteId, []);
    }
    this.indiceAsistencias.get(asistencia.estudianteId).push(asistencia);
  }

  obtenerAsistenciasPorEstudiante(estudianteId) {
    return this.indiceAsistencias.get(estudianteId) || [];
  }

  existeAsistencia(estudianteId, fecha) {
    const asistencias = this.indiceAsistencias.get(estudianteId) || [];
    return asistencias.some(asistencia => asistencia.fecha === fecha);
  }

  obtenerTodasLasAsistencias() {
    return Array.from(this.asistencias.values());
  }

  // Método para limpiar datos (útil para tests)
  limpiar() {
    this.estudiantes.clear();
    this.asistencias.clear();
    this.indiceCodigos.clear();
    this.indiceAsistencias.clear();
  }

  // Método para obtener estadísticas
  obtenerEstadisticas() {
    return {
      totalEstudiantes: this.estudiantes.size,
      totalAsistencias: this.asistencias.size
    };
  }
}

// Instancia singleton para uso global
const storage = new MemoryStorage();

module.exports = storage;