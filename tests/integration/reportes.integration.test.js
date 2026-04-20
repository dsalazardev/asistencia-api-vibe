const request = require('supertest');
const app = require('../../src/app');

describe('Endpoints de Reportes - Tests de Integración', () => {
  let estudiantes = [];

  // Crear estudiantes y asistencias de prueba
  beforeEach(async () => {
    // Crear 3 estudiantes
    for (let i = 1; i <= 3; i++) {
      const response = await request(app)
        .post('/api/estudiantes')
        .send({
          codigo: `EST0000${i}`,
          nombre: `Estudiante ${i}`
        });
      estudiantes.push(response.body.data);
    }

    // Crear asistencias para generar datos de ausentismo
    // Estudiante 1: 3 ausencias
    await request(app).post('/api/asistencias').send({
      estudianteId: estudiantes[0].id,
      fecha: '2024-01-15',
      estado: 'ausente'
    });
    await request(app).post('/api/asistencias').send({
      estudianteId: estudiantes[0].id,
      fecha: '2024-01-16',
      estado: 'ausente'
    });
    await request(app).post('/api/asistencias').send({
      estudianteId: estudiantes[0].id,
      fecha: '2024-01-17',
      estado: 'ausente'
    });

    // Estudiante 2: 1 ausencia
    await request(app).post('/api/asistencias').send({
      estudianteId: estudiantes[1].id,
      fecha: '2024-01-15',
      estado: 'ausente'
    });
    await request(app).post('/api/asistencias').send({
      estudianteId: estudiantes[1].id,
      fecha: '2024-01-16',
      estado: 'presente'
    });

    // Estudiante 3: 0 ausencias (solo presentes)
    await request(app).post('/api/asistencias').send({
      estudianteId: estudiantes[2].id,
      fecha: '2024-01-15',
      estado: 'presente'
    });
  });

  describe('GET /api/reportes/ausentismo', () => {
    
    test('debe retornar top 5 estudiantes con más ausencias ordenados correctamente', async () => {
      const response = await request(app)
        .get('/api/reportes/ausentismo')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      
      // Verificar que está ordenado por ausencias (descendente)
      const reporte = response.body.data;
      expect(reporte[0].codigo).toBe('EST00001');
      expect(reporte[0].ausencias).toBe(3);
      expect(reporte[1].codigo).toBe('EST00002');
      expect(reporte[1].ausencias).toBe(1);
      expect(reporte[2].codigo).toBe('EST00003');
      expect(reporte[2].ausencias).toBe(0);

      // Verificar estructura de cada entrada
      reporte.forEach(entrada => {
        expect(entrada).toHaveProperty('codigo');
        expect(entrada).toHaveProperty('nombre');
        expect(entrada).toHaveProperty('ausencias');
        expect(typeof entrada.ausencias).toBe('number');
      });
    });

    test('debe retornar máximo 5 estudiantes cuando hay más de 5', async () => {
      // Crear 3 estudiantes adicionales para tener 6 en total
      for (let i = 4; i <= 6; i++) {
        const response = await request(app)
          .post('/api/estudiantes')
          .send({
            codigo: `EST0000${i}`,
            nombre: `Estudiante ${i}`
          });

        // Agregar algunas ausencias
        await request(app).post('/api/asistencias').send({
          estudianteId: response.body.data.id,
          fecha: '2024-01-15',
          estado: 'ausente'
        });
      }

      const response = await request(app)
        .get('/api/reportes/ausentismo')
        .expect(200);

      expect(response.body.data).toHaveLength(5); // Máximo 5
    });

    test('debe retornar array vacío cuando no hay estudiantes', async () => {
      // Limpiar todos los datos
      const storage = require('../../src/storage/MemoryStorage');
      storage.limpiar();

      const response = await request(app)
        .get('/api/reportes/ausentismo')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    test('debe incluir estudiantes sin asistencias con 0 ausencias', async () => {
      // Crear un estudiante sin asistencias
      const response = await request(app)
        .post('/api/estudiantes')
        .send({
          codigo: 'EST00999',
          nombre: 'Estudiante Sin Asistencias'
        });

      const reporteResponse = await request(app)
        .get('/api/reportes/ausentismo')
        .expect(200);

      const estudianteSinAsistencias = reporteResponse.body.data.find(
        e => e.codigo === 'EST00999'
      );

      expect(estudianteSinAsistencias).toBeDefined();
      expect(estudianteSinAsistencias.ausencias).toBe(0);
    });
  });

  describe('GET /api/reportes/asistencias', () => {
    
    test('debe retornar reporte completo de asistencias por estudiante', async () => {
      const response = await request(app)
        .get('/api/reportes/asistencias')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data).toHaveLength(3);

      // Verificar estructura de cada entrada
      response.body.data.forEach(entrada => {
        expect(entrada).toHaveProperty('codigo');
        expect(entrada).toHaveProperty('nombre');
        expect(entrada).toHaveProperty('presente');
        expect(entrada).toHaveProperty('ausente');
        expect(entrada).toHaveProperty('justificada');
        expect(entrada).toHaveProperty('total');
        expect(typeof entrada.presente).toBe('number');
        expect(typeof entrada.ausente).toBe('number');
        expect(typeof entrada.justificada).toBe('number');
        expect(typeof entrada.total).toBe('number');
      });
    });

    test('debe calcular correctamente las estadísticas por estudiante', async () => {
      const response = await request(app)
        .get('/api/reportes/asistencias')
        .expect(200);

      const estudiante1 = response.body.data.find(e => e.codigo === 'EST00001');
      expect(estudiante1.ausente).toBe(3);
      expect(estudiante1.presente).toBe(0);
      expect(estudiante1.total).toBe(3);

      const estudiante2 = response.body.data.find(e => e.codigo === 'EST00002');
      expect(estudiante2.ausente).toBe(1);
      expect(estudiante2.presente).toBe(1);
      expect(estudiante2.total).toBe(2);
    });
  });

  describe('GET /api/reportes/estadisticas', () => {
    
    test('debe retornar estadísticas generales del sistema', async () => {
      const response = await request(app)
        .get('/api/reportes/estadisticas')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalEstudiantes');
      expect(response.body.data).toHaveProperty('totalAsistencias');
      expect(response.body.data).toHaveProperty('porEstado');
      expect(response.body.data).toHaveProperty('promedioAsistenciasPorEstudiante');

      expect(response.body.data.totalEstudiantes).toBe(3);
      expect(response.body.data.totalAsistencias).toBe(6);
      expect(response.body.data.porEstado.presente).toBe(2);
      expect(response.body.data.porEstado.ausente).toBe(4);
      expect(response.body.data.porEstado.justificada).toBe(0);
    });

    test('debe calcular correctamente el promedio de asistencias por estudiante', async () => {
      const response = await request(app)
        .get('/api/reportes/estadisticas')
        .expect(200);

      // 6 asistencias / 3 estudiantes = 2
      expect(response.body.data.promedioAsistenciasPorEstudiante).toBe(2);
    });
  });

  describe('GET /api/reportes/sin-asistencias', () => {
    
    test('debe retornar estudiantes sin registros de asistencia', async () => {
      // Crear un estudiante sin asistencias
      await request(app)
        .post('/api/estudiantes')
        .send({
          codigo: 'EST00999',
          nombre: 'Estudiante Sin Asistencias'
        });

      const response = await request(app)
        .get('/api/reportes/sin-asistencias')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.total).toBe(1);
      
      const estudianteSinAsistencias = response.body.data[0];
      expect(estudianteSinAsistencias.codigo).toBe('EST00999');
      expect(estudianteSinAsistencias.nombre).toBe('Estudiante Sin Asistencias');
    });

    test('debe retornar array vacío cuando todos los estudiantes tienen asistencias', async () => {
      const response = await request(app)
        .get('/api/reportes/sin-asistencias')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.total).toBe(0);
    });
  });

  describe('Casos límite en reportes', () => {
    
    test('debe manejar correctamente sistema sin datos', async () => {
      // Limpiar todos los datos
      const storage = require('../../src/storage/MemoryStorage');
      storage.limpiar();

      const ausentismoResponse = await request(app)
        .get('/api/reportes/ausentismo')
        .expect(200);
      expect(ausentismoResponse.body.data).toEqual([]);

      const estadisticasResponse = await request(app)
        .get('/api/reportes/estadisticas')
        .expect(200);
      expect(estadisticasResponse.body.data.totalEstudiantes).toBe(0);
      expect(estadisticasResponse.body.data.totalAsistencias).toBe(0);
      expect(estadisticasResponse.body.data.promedioAsistenciasPorEstudiante).toBe(0);
    });

    test('debe incluir asistencias justificadas en el reporte completo', async () => {
      // Agregar una asistencia justificada
      await request(app).post('/api/asistencias').send({
        estudianteId: estudiantes[0].id,
        fecha: '2024-01-18',
        estado: 'justificada'
      });

      const response = await request(app)
        .get('/api/reportes/asistencias')
        .expect(200);

      const estudiante1 = response.body.data.find(e => e.codigo === 'EST00001');
      expect(estudiante1.justificada).toBe(1);
      expect(estudiante1.total).toBe(4); // 3 ausentes + 1 justificada
    });
  });
});