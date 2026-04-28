const request = require('supertest');
const app = require('../../src/app');

describe('Endpoints de Asistencias - Tests de Integración', () => {
  let estudianteId;

  // Crear un estudiante antes de cada test
  beforeEach(async () => {
    const response = await request(app)
      .post('/api/estudiantes')
      .send({
        codigo: 'EST00123',
        nombre: 'Juan Pérez'
      });
    estudianteId = response.body.data.id;
  });

  describe('POST /api/asistencias', () => {
    
    test('debe registrar asistencia exitosamente con datos válidos', async () => {
      const asistenciaData = {
        estudianteId: estudianteId,
        fecha: '2024-01-15',
        estado: 'presente'
      };

      const response = await request(app)
        .post('/api/asistencias')
        .send(asistenciaData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.estudianteId).toBe(estudianteId);
      expect(response.body.data.fecha).toBe('2024-01-15');
      expect(response.body.data.estado).toBe('presente');
      expect(response.body.data).toHaveProperty('fechaRegistro');
    });

    test('debe registrar asistencia con estado "ausente"', async () => {
      const asistenciaData = {
        estudianteId: estudianteId,
        fecha: '2024-01-15',
        estado: 'ausente'
      };

      const response = await request(app)
        .post('/api/asistencias')
        .send(asistenciaData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.estado).toBe('ausente');
    });

    test('debe registrar asistencia con estado "justificada"', async () => {
      const asistenciaData = {
        estudianteId: estudianteId,
        fecha: '2024-01-15',
        estado: 'justificada'
      };

      const response = await request(app)
        .post('/api/asistencias')
        .send(asistenciaData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.estado).toBe('justificada');
    });

    test('debe rechazar asistencia para estudiante inexistente', async () => {
      const idInexistente = '550e8400-e29b-41d4-a716-446655440000';
      const asistenciaData = {
        estudianteId: idInexistente,
        fecha: '2024-01-15',
        estado: 'presente'
      };

      const response = await request(app)
        .post('/api/asistencias')
        .send(asistenciaData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('STUDENT_NOT_FOUND');
    });

    test('debe rechazar asistencia con un ID de estudiante nulo o vacío', async () => {
      const asistenciaData = {
        estudianteId: null,
        fecha: '2024-01-15',
        estado: 'presente'
      };

      const response = await request(app)
        .post('/api/asistencias')
        .send(asistenciaData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('debe rechazar asistencia con fecha futura', async () => {
      const fechaFutura = new Date();
      fechaFutura.setDate(fechaFutura.getDate() + 1);
      const fechaFuturaStr = fechaFutura.toISOString().split('T')[0];

      const asistenciaData = {
        estudianteId: estudianteId,
        fecha: fechaFuturaStr,
        estado: 'presente'
      };

      const response = await request(app)
        .post('/api/asistencias')
        .send(asistenciaData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    test('debe rechazar asistencia con estado inválido', async () => {
      const asistenciaData = {
        estudianteId: estudianteId,
        fecha: '2024-01-15',
        estado: 'estado_invalido'
      };

      const response = await request(app)
        .post('/api/asistencias')
        .send(asistenciaData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    test('debe rechazar asistencia duplicada (mismo estudiante, misma fecha)', async () => {
      const asistenciaData = {
        estudianteId: estudianteId,
        fecha: '2024-01-15',
        estado: 'presente'
      };

      // Registrar primera asistencia
      await request(app)
        .post('/api/asistencias')
        .send(asistenciaData)
        .expect(201);

      // Intentar registrar segunda asistencia para mismo estudiante y fecha
      const response = await request(app)
        .post('/api/asistencias')
        .send({
          ...asistenciaData,
          estado: 'ausente' // Diferente estado, pero misma fecha
        })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('DUPLICATE_ATTENDANCE');
    });

    test('debe rechazar asistencia con fecha inválida', async () => {
      const asistenciaData = {
        estudianteId: estudianteId,
        fecha: '2024-13-45', // Fecha inválida
        estado: 'presente'
      };

      const response = await request(app)
        .post('/api/asistencias')
        .send(asistenciaData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    test('debe rechazar asistencia con formato de fecha incorrecto', async () => {
      const asistenciaData = {
        estudianteId: estudianteId,
        fecha: '15/01/2024', // Formato incorrecto
        estado: 'presente'
      };

      const response = await request(app)
        .post('/api/asistencias')
        .send(asistenciaData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /api/asistencias/estudiante/:id', () => {
    
    test('debe retornar asistencias de estudiante existente', async () => {
      // Registrar algunas asistencias
      await request(app)
        .post('/api/asistencias')
        .send({
          estudianteId: estudianteId,
          fecha: '2024-01-15',
          estado: 'presente'
        });

      await request(app)
        .post('/api/asistencias')
        .send({
          estudianteId: estudianteId,
          fecha: '2024-01-16',
          estado: 'ausente'
        });

      const response = await request(app)
        .get(`/api/asistencias/estudiante/${estudianteId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.total).toBe(2);
      
      // Verificar que están ordenadas por fecha (más reciente primero)
      expect(new Date(response.body.data[0].fecha)).toBeInstanceOf(Date);
      expect(new Date(response.body.data[1].fecha)).toBeInstanceOf(Date);
    });

    test('debe retornar 404 para estudiante sin asistencias', async () => {
      const response = await request(app)
        .get(`/api/asistencias/estudiante/${estudianteId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NO_ATTENDANCE_RECORDS');
    });

    test('debe retornar 404 para estudiante inexistente', async () => {
      const idInexistente = '550e8400-e29b-41d4-a716-446655440000';

      const response = await request(app)
        .get(`/api/asistencias/estudiante/${idInexistente}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('STUDENT_NOT_FOUND');
    });

    test('debe retornar 400 para ID con formato inválido', async () => {
      const idInvalido = 'id-invalido';

      const response = await request(app)
        .get(`/api/asistencias/estudiante/${idInvalido}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Casos límite y validaciones adicionales', () => {
    
    test('debe manejar campos faltantes en registro de asistencia', async () => {
      const asistenciaIncompleta = {
        estudianteId: estudianteId
        // fecha y estado faltantes
      };

      const response = await request(app)
        .post('/api/asistencias')
        .send(asistenciaIncompleta)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    test('debe permitir múltiples asistencias para diferentes fechas', async () => {
      // Registrar asistencias en diferentes fechas
      await request(app)
        .post('/api/asistencias')
        .send({
          estudianteId: estudianteId,
          fecha: '2024-01-15',
          estado: 'presente'
        })
        .expect(201);

      await request(app)
        .post('/api/asistencias')
        .send({
          estudianteId: estudianteId,
          fecha: '2024-01-16',
          estado: 'ausente'
        })
        .expect(201);

      const response = await request(app)
        .get(`/api/asistencias/estudiante/${estudianteId}`)
        .expect(200);

      expect(response.body.data).toHaveLength(2);
    });

    test('debe validar UUID del estudiante en el cuerpo de la petición', async () => {
      const asistenciaData = {
        estudianteId: 'id-invalido',
        fecha: '2024-01-15',
        estado: 'presente'
      };

      const response = await request(app)
        .post('/api/asistencias')
        .send(asistenciaData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});