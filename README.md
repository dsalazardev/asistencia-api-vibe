# API de Gestión de Asistencia Estudiantil

Una API REST desarrollada con Node.js y Express para gestionar estudiantes y sus registros de asistencia en un programa académico.

## Características

- ✅ **Arquitectura Limpia**: Separación en 3 capas (rutas/controladores/servicios)
- ✅ **Validaciones Robustas**: Validación de códigos de estudiante, fechas y estados
- ✅ **Manejo de Errores**: Sistema centralizado de manejo de errores con códigos HTTP apropiados
- ✅ **Persistencia en Memoria**: Almacenamiento eficiente sin dependencias externas
- ✅ **Suite de Tests**: Tests de integración completos con Jest y Supertest
- ✅ **Documentación Completa**: API documentada con ejemplos de uso

## Endpoints Disponibles

### Estudiantes
- `POST /api/estudiantes` - Crear un nuevo estudiante
- `GET /api/estudiantes` - Listar todos los estudiantes
- `GET /api/estudiantes/:id` - Obtener un estudiante por ID

### Asistencias
- `POST /api/asistencias` - Registrar una asistencia
- `GET /api/asistencias/estudiante/:id` - Listar asistencias de un estudiante

### Reportes
- `GET /api/reportes/ausentismo` - Top 5 estudiantes con más ausencias
- `GET /api/reportes/asistencias` - Reporte completo de asistencias por estudiante
- `GET /api/reportes/estadisticas` - Estadísticas generales del sistema

## Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd asistencia-api
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno** (opcional)
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

## Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

### Tests
```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

## Ejemplos de Uso

### Crear un Estudiante
```bash
curl -X POST http://localhost:3000/api/estudiantes \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "EST00123",
    "nombre": "Juan Pérez"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-generado",
    "codigo": "EST00123",
    "nombre": "Juan Pérez",
    "fechaCreacion": "2024-01-15T10:30:00.000Z"
  }
}
```

### Registrar Asistencia
```bash
curl -X POST http://localhost:3000/api/asistencias \
  -H "Content-Type: application/json" \
  -d '{
    "estudianteId": "uuid-del-estudiante",
    "fecha": "2024-01-15",
    "estado": "presente"
  }'
```

### Obtener Reporte de Ausentismo
```bash
curl http://localhost:3000/api/reportes/ausentismo
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "codigo": "EST00123",
      "nombre": "Juan Pérez",
      "ausencias": 5
    }
  ]
}
```

## Reglas de Negocio

### Códigos de Estudiante
- Formato requerido: `EST` seguido de exactamente 5 dígitos
- Ejemplos válidos: `EST00123`, `EST99999`
- Debe ser único en el sistema

### Estados de Asistencia
- `presente`: El estudiante asistió a clase
- `ausente`: El estudiante no asistió a clase
- `justificada`: El estudiante no asistió pero presentó justificación

### Validaciones de Fecha
- Formato ISO 8601: `YYYY-MM-DD`
- No se permiten fechas futuras
- No se pueden registrar asistencias duplicadas (mismo estudiante, misma fecha)

## Códigos de Error

| Código HTTP | Código de Error | Descripción |
|-------------|-----------------|-------------|
| 400 | `INVALID_STUDENT_CODE` | Código de estudiante con formato inválido |
| 400 | `INVALID_DATE` | Fecha inválida o futura |
| 400 | `INVALID_ATTENDANCE_STATE` | Estado de asistencia no permitido |
| 400 | `MISSING_REQUIRED_FIELDS` | Campos requeridos faltantes |
| 400 | `INVALID_UUID` | ID con formato UUID inválido |
| 404 | `STUDENT_NOT_FOUND` | Estudiante no encontrado |
| 404 | `NO_ATTENDANCE_RECORDS` | No hay registros de asistencia |
| 409 | `DUPLICATE_STUDENT_CODE` | Código de estudiante ya existe |
| 409 | `DUPLICATE_ATTENDANCE` | Asistencia duplicada |
| 500 | `INTERNAL_ERROR` | Error interno del servidor |

## Estructura del Proyecto

```
src/
├── routes/           # Definición de rutas y middleware
│   ├── estudiantes.js
│   ├── asistencias.js
│   └── reportes.js
├── controllers/      # Controladores de presentación
│   ├── EstudiantesController.js
│   ├── AsistenciasController.js
│   └── ReportesController.js
├── services/         # Lógica de negocio
│   ├── EstudiantesService.js
│   ├── AsistenciasService.js
│   └── ReportesService.js
├── middleware/       # Middleware personalizado
│   ├── errorHandler.js
│   └── validators.js
├── models/          # Definiciones de modelos
│   ├── Estudiante.js
│   └── Asistencia.js
├── storage/         # Almacenamiento en memoria
│   └── MemoryStorage.js
└── app.js           # Configuración principal de Express

tests/
├── integration/     # Tests de integración
├── setup.js        # Configuración de tests
└── simple.test.js  # Test de ejemplo
```

## Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **express-validator** - Validación de datos
- **UUID** - Generación de identificadores únicos
- **Helmet** - Seguridad HTTP
- **CORS** - Cross-Origin Resource Sharing
- **Jest** - Framework de testing
- **Supertest** - Testing de APIs HTTP

## Desarrollo

### Arquitectura de 3 Capas

1. **Capa de Rutas**: Define endpoints y aplica middleware de validación
2. **Capa de Controladores**: Maneja la lógica de presentación y formateo de respuestas
3. **Capa de Servicios**: Contiene la lógica de negocio y validaciones

### Principios de Diseño

- **Separación de Responsabilidades**: Cada capa tiene una función específica
- **Inversión de Dependencias**: Las capas superiores dependen de abstracciones
- **Single Responsibility**: Cada módulo tiene una única razón para cambiar
- **Manejo Centralizado de Errores**: Todos los errores se procesan de forma consistente

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## Licencia

Este proyecto está bajo la Licencia ISC.

## Health Check

Para verificar que la API está funcionando:

```bash
curl http://localhost:3000/health
```

**Respuesta:**
```json
{
  "success": true,
  "message": "API de Gestión de Asistencia Estudiantil funcionando correctamente",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```