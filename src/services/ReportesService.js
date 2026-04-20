const storage = require('../storage/MemoryStorage');

class ReportesService {

  // Obtener top 5 estudiantes con más ausencias
  async obtenerTop5Ausentismo() {
    const estudiantes = storage.obtenerTodosLosEstudiantes();
    const asistencias = storage.obtenerTodasLasAsistencias();

    // Calcular ausencias por estudiante
    const ausenciasPorEstudiante = this.calcularAusenciasPorEstudiante(estudiantes, asistencias);

    // Ordenar por cantidad de ausencias (descendente) y tomar top 5
    const top5 = ausenciasPorEstudiante
      .sort((a, b) => b.ausencias - a.ausencias)
      .slice(0, 5);

    return top5;
  }

  // Calcular ausencias por estudiante
  calcularAusenciasPorEstudiante(estudiantes = null, asistencias = null) {
    // Si no se proporcionan, obtener de storage
    if (!estudiantes) {
      estudiantes = storage.obtenerTodosLosEstudiantes();
    }
    if (!asistencias) {
      asistencias = storage.obtenerTodasLasAsistencias();
    }

    // Crear mapa de estudiantes para acceso rápido
    const mapaEstudiantes = new Map();
    estudiantes.forEach(estudiante => {
      mapaEstudiantes.set(estudiante.id, {
        codigo: estudiante.codigo,
        nombre: estudiante.nombre,
        ausencias: 0
      });
    });

    // Contar ausencias por estudiante
    asistencias.forEach(asistencia => {
      if (asistencia.estado === 'ausente') {
        const estudiante = mapaEstudiantes.get(asistencia.estudianteId);
        if (estudiante) {
          estudiante.ausencias++;
        }
      }
    });

    // Convertir a array y filtrar solo estudiantes con datos
    return Array.from(mapaEstudiantes.values());
  }

  // Obtener reporte completo de asistencias por estudiante
  async obtenerReporteCompletoAsistencias() {
    const estudiantes = storage.obtenerTodosLosEstudiantes();
    const asistencias = storage.obtenerTodasLasAsistencias();

    // Crear mapa de estadísticas por estudiante
    const estadisticasPorEstudiante = new Map();
    
    estudiantes.forEach(estudiante => {
      estadisticasPorEstudiante.set(estudiante.id, {
        codigo: estudiante.codigo,
        nombre: estudiante.nombre,
        presente: 0,
        ausente: 0,
        justificada: 0,
        total: 0
      });
    });

    // Contar asistencias por tipo
    asistencias.forEach(asistencia => {
      const estadisticas = estadisticasPorEstudiante.get(asistencia.estudianteId);
      if (estadisticas) {
        estadisticas[asistencia.estado]++;
        estadisticas.total++;
      }
    });

    return Array.from(estadisticasPorEstudiante.values());
  }

  // Obtener estadísticas generales del sistema
  async obtenerEstadisticasGenerales() {
    const estudiantes = storage.obtenerTodosLosEstudiantes();
    const asistencias = storage.obtenerTodasLasAsistencias();

    const estadisticas = {
      totalEstudiantes: estudiantes.length,
      totalAsistencias: asistencias.length,
      porEstado: {
        presente: 0,
        ausente: 0,
        justificada: 0
      },
      promedioAsistenciasPorEstudiante: 0
    };

    // Contar por estado
    asistencias.forEach(asistencia => {
      estadisticas.porEstado[asistencia.estado]++;
    });

    // Calcular promedio
    if (estudiantes.length > 0) {
      estadisticas.promedioAsistenciasPorEstudiante = 
        Math.round((asistencias.length / estudiantes.length) * 100) / 100;
    }

    return estadisticas;
  }

  // Obtener estudiantes sin registros de asistencia
  async obtenerEstudiantesSinAsistencias() {
    const estudiantes = storage.obtenerTodosLosEstudiantes();
    const estudiantesConAsistencias = new Set();

    // Identificar estudiantes con asistencias
    storage.obtenerTodasLasAsistencias().forEach(asistencia => {
      estudiantesConAsistencias.add(asistencia.estudianteId);
    });

    // Filtrar estudiantes sin asistencias
    return estudiantes
      .filter(estudiante => !estudiantesConAsistencias.has(estudiante.id))
      .map(estudiante => estudiante.toSimpleJSON());
  }
}

module.exports = new ReportesService();