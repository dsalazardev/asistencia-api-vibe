const request = require('supertest');
const app = require('../../src/app');

describe('Endpoints de Estudiantes - Tests de Integración', () => {

  describe('POST /api/estudiantes', () => {
    
    test('debe crear un estudiante exitosamente con datos válidos', async () => {
      const estudianteData = {
        codigo: 'EST00123',
        nombre: 'Juan Pérez'
      };

      const response = await request(app)
        .post('/api/estudiantes')
        .send(estudianteData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.codigo).toBe('EST00123');
      expect(response.body.data.nombre).toBe('Juan Pérez');
      expect(response.body.data).toHaveProperty('fechaCreacion');
    });

    test('debe rechazar estudiante con código inválido (formato incorrecto)', async () => {
      const estudianteData = {
        codigo: 'EST123', // Formato inválido
        nombre: 'Juan Pérez'
      };

      const response = await request(app)
        .post('/api/estudiantes')
        .send(estudianteData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    test('debe rechazar estudiante con código duplicado', async () => {
      const estudianteData = {
        codigo: 'EST00123',
        nombre: 'Juan Pérez'
      };

      // Crear primer estudiante
      await request(app)
        .post('/api/estudiantes')
        .send(estudianteData)
        .expect(201);

      // Intentar crear segundo estudiante con mismo código
      const response = await request(app)
        .post('/api/estudiantes')
        .send({
          codigo: 'EST00123',
          nombre: 'María García'
        })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('DUPLICATE_STUDENT_CODE');
    });

    test('debe rechazar estudiante sin nombre', async () => {
      const estudianteData = {
        codigo: 'EST00123'
        // nombre faltante
      };

      const response = await request(app)
        .post('/api/estudiantes')
        .send(estudianteData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    test('debe rechazar estudiante con nombre vacío', async () => {
      const estudianteData = {
        codigo: 'EST00123',
        nombre: '   ' // Solo espacios
      };

      const response = await request(app)
        .post('/api/estudiantes')
        .send(estudianteData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/estudiantes', () => {
    
    test('debe retornar lista vacía cuando no hay estudiantes', async () => {
      const response = await request(app)
        .get('/api/estudiantes')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.total).toBe(0);
    });

    test('debe retornar lista de estudiantes cuando existen', async () => {
      // Crear algunos estudiantes
      await request(app)
        .post('/api/estudiantes')
        .send({ codigo: 'EST00001', nombre: 'Juan Pérez' });
      
      await request(app)
        .post('/api/estudiantes')
        .send({ codigo: 'EST00002', nombre: 'María García' });

      const response = await request(app)
        .get('/api/estudiantes')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.total).toBe(2);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('codigo');
      expect(response.body.data[0]).toHaveProperty('nombre');
    });
  });

  describe('GET /api/estudiantes/:id', () => {
    
    test('debe retornar estudiante existente por ID', async () => {
      // Crear estudiante
      const createResponse = await request(app)
        .post('/api/estudiantes')
        .send({ codigo: 'EST00123', nombre: 'Juan Pérez' });

      const estudianteId = createResponse.body.data.id;

      // Obtener estudiante por ID
      const response = await request(app)
        .get(`/api/estudiantes/${estudianteId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(estudianteId);
      expect(response.body.data.codigo).toBe('EST00123');
      expect(response.body.data.nombre).toBe('Juan Pérez');
    });

    test('debe retornar 404 para estudiante inexistente', async () => {
      const idInexistente = '550e8400-e29b-41d4-a716-446655440000';

      const response = await request(app)
        .get(`/api/estudiantes/${idInexistente}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('STUDENT_NOT_FOUND');
    });

    test('debe retornar 400 para ID con formato inválido', async () => {
      const idInvalido = 'id-invalido';

      const response = await request(app)
        .get(`/api/estudiantes/${idInvalido}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('Casos límite y validaciones adicionales', () => {
    
    test('debe manejar payload JSON malformado', async () => {
      const response = await request(app)
        .post('/api/estudiantes')
        .set('Content-Type', 'application/json')
        .send('{"codigo": "EST00123", "nombre":}') // JSON inválido
        .expect(500); // Express maneja JSON malformado como error interno

      expect(response.body.success).toBe(false);
    });

    test('debe validar longitud máxima del nombre', async () => {
      const nombreMuyLargo = 'a'.repeat(101); // Más de 100 caracteres

      const response = await request(app)
        .post('/api/estudiantes')
        .send({
          codigo: 'EST00123',
          nombre: nombreMuyLargo
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    test('debe trimear espacios en el nombre', async () => {
      const response = await request(app)
        .post('/api/estudiantes')
        .send({
          codigo: 'EST00123',
          nombre: '  Juan Pérez  ' // Con espacios al inicio y final
        })
        .expect(201);

      expect(response.body.data.nombre).toBe('Juan Pérez');
    });
  });
});