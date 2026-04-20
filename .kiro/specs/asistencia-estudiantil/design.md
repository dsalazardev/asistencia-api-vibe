# Documento de Diseño Técnico - API de Gestión de Asistencia Estudiantil

## Overview

La API de Gestión de Asistencia Estudiantil es un sistema REST desarrollado en Node.js con Express que permite gestionar estudiantes y sus registros de asistencia. El sistema implementa una arquitectura limpia de 3 capas con validaciones robustas y manejo centralizado de errores.

### Objetivos del Sistema
- Proporcionar endpoints REST para la gestión completa de estudiantes y asistencias
- Garantizar la integridad de datos mediante validaciones estrictas
- Implementar reglas de negocio específicas para códigos de estudiante y estados de asistencia
- Generar reportes de ausentismo para análisis académico
- Mantener alta disponibilidad y rendimiento para entornos educativos

### Alcance Técnico
- API REST con 6 endpoints principales
- Persistencia en memoria (sin base de datos externa)
- Validaciones con express-validator
- Manejo centralizado de errores HTTP
- Arquitectura modular y mantenible

## Architecture

### Patrón Arquitectónico
El sistema implementa una **Arquitectura Limpia de 3 Capas** que separa claramente las responsabilidades:

```
┌─────────────────┐
│   Routes Layer  │  ← Definición de endpoints y middleware
├─────────────────┤
│ Controllers     │  ← Lógica de presentación y validación
├─────────────────┤
│   Services      │  ← Lógica de negocio y persistencia
└─────────────────┘
```

### Principios de Diseño
- **Separación de Responsabilidades**: Cada capa tiene una función específica
- **Inversión de Dependencias**: Las capas superiores dependen de abstracciones
- **Single Responsibility**: Cada módulo tiene una única razón para cambiar
- **Open/Closed**: Extensible sin modificar código existente

### Estructura de Directorios
```
src/
├── routes/           # Definición de rutas y middleware
│   ├── estudiantes.js
│   ├── asistencias.js
│   └── reportes.js
├── controllers/      # Controladores de presentación
│   ├── estudiantesController.js
│   ├── asistenciasController.js
│   └── reportesController.js
├── services/         # Lógica de negocio
│   ├── estudiantesService.js
│   ├── asistenciasService.js
│   └── reportesService.js
├── middleware/       # Middleware personalizado
│   ├── errorHandler.js
│   └── validators.js
├── models/          # Definiciones de modelos
│   ├── Estudiante.js
│   └── Asistencia.js
└── app.js           # Configuración principal de Express
```

## Components and Interfaces

### 1. Routes Layer (Capa de Rutas)

#### Estudiantes Routes (`/routes/estudiantes.js`)
```javascript
// POST /api/estudiantes - Crear estudiante
// GET /api/estudiantes - Listar todos los estudiantes  
// GET /api/estudiantes/:id - Obtener estudiante por ID
```

#### Asistencias Routes (`/routes/asistencias.js`)
```javascript
// POST /api/asistencias - Registrar asistencia
// GET /api/asistencias/estudiante/:id - Listar asistencias de estudiante
```

#### Reportes Routes (`/routes/reportes.js`)
```javascript
// GET /api/reportes/ausentismo - Top 5 estudiantes con más ausencias
```

### 2. Controllers Layer (Capa de Controladores)

#### EstudiantesController
**Responsabilidades:**
- Validar datos de entrada usando express-validator
- Coordinar llamadas a servicios
- Formatear respuestas HTTP
- Manejar códigos de estado apropiados

**Métodos principales:**
- `crearEstudiante(req, res, next)`
- `listarEstudiantes(req, res, next)`
- `obtenerEstudiantePorId(req, res, next)`

#### AsistenciasController
**Responsabilidades:**
- Validar datos de asistencia
- Coordinar registro y consulta de asistencias
- Manejar errores de duplicación

**Métodos principales:**
- `registrarAsistencia(req, res, next)`
- `listarAsistenciasPorEstudiante(req, res, next)`

#### ReportesController
**Responsabilidades:**
- Generar reportes de ausentismo
- Formatear datos para presentación

**Métodos principales:**
- `obtenerReporteAusentismo(req, res, next)`

### 3. Services Layer (Capa de Servicios)

#### EstudiantesService
**Responsabilidades:**
- Implementar lógica de negocio para estudiantes
- Validar reglas de formato de código
- Gestionar persistencia en memoria
- Garantizar unicidad de códigos

**Interface:**
```javascript
class EstudiantesService {
  crearEstudiante(codigo, nombre)
  listarTodos()
  obtenerPorId(id)
  existeEstudiante(id)
  validarCodigoFormato(codigo)
}
```

#### AsistenciasService
**Responsabilidades:**
- Implementar lógica de negocio para asistencias
- Validar reglas de fechas y estados
- Prevenir duplicados
- Gestionar persistencia de asistencias

**Interface:**
```javascript
class AsistenciasService {
  registrarAsistencia(estudianteId, fecha, estado)
  listarPorEstudiante(estudianteId)
  existeAsistencia(estudianteId, fecha)
  validarFecha(fecha)
  validarEstado(estado)
}
```

#### ReportesService
**Responsabilidades:**
- Calcular estadísticas de ausentismo
- Generar rankings de ausencias
- Procesar datos para reportes

**Interface:**
```javascript
class ReportesService {
  obtenerTop5Ausentismo()
  calcularAusenciasPorEstudiante()
}
```

### 4. Middleware Components

#### Error Handler
**Responsabilidades:**
- Manejo centralizado de errores
- Formateo consistente de respuestas de error
- Logging de errores para debugging

#### Validators
**Responsabilidades:**
- Validaciones de entrada con express-validator
- Validaciones personalizadas para reglas de negocio
- Sanitización de datos

## Data Models

### Modelo Estudiante
```javascript
{
  id: String,           // UUID generado automáticamente
  codigo: String,       // Formato: EST\d{5} (único)
  nombre: String,       // Nombre completo del estudiante
  fechaCreacion: Date   // Timestamp de creación
}
```

**Validaciones:**
- `codigo`: Debe seguir el patrón `/^EST\d{5}$/`
- `codigo`: Debe ser único en el sistema
- `nombre`: Requerido, string no vacío
- `id`: UUID v4 generado automáticamente

### Modelo Asistencia
```javascript
{
  id: String,           // UUID generado automáticamente
  estudianteId: String, // Referencia al ID del estudiante
  fecha: String,        // Formato ISO 8601 (YYYY-MM-DD)
  estado: String,       // "presente" | "ausente" | "justificada"
  fechaRegistro: Date   // Timestamp de registro
}
```

**Validaciones:**
- `estudianteId`: Debe existir en el sistema
- `fecha`: Formato ISO 8601, no puede ser futura
- `estado`: Debe ser uno de los valores permitidos
- Combinación `(estudianteId, fecha)` debe ser única

### Estructura de Persistencia en Memoria
```javascript
// Almacenamiento global en memoria
const storage = {
  estudiantes: new Map(),     // Map<id, Estudiante>
  asistencias: new Map(),     // Map<id, Asistencia>
  indiceCodigos: new Map(),   // Map<codigo, id> para búsqueda rápida
  indiceAsistencias: new Map() // Map<estudianteId, Array<Asistencia>>
};
```

### Respuestas de API

#### Respuesta Exitosa - Estudiante
```javascript
{
  "success": true,
  "data": {
    "id": "uuid-v4",
    "codigo": "EST00123",
    "nombre": "Juan Pérez",
    "fechaCreacion": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Respuesta Exitosa - Lista de Estudiantes
```javascript
{
  "success": true,
  "data": [
    {
      "id": "uuid-v4-1",
      "codigo": "EST00123",
      "nombre": "Juan Pérez"
    },
    {
      "id": "uuid-v4-2", 
      "codigo": "EST00124",
      "nombre": "María García"
    }
  ],
  "total": 2
}
```

#### Respuesta Exitosa - Asistencia
```javascript
{
  "success": true,
  "data": {
    "id": "uuid-v4",
    "estudianteId": "uuid-v4-estudiante",
    "fecha": "2024-01-15",
    "estado": "presente",
    "fechaRegistro": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Respuesta Exitosa - Reporte de Ausentismo
```javascript
{
  "success": true,
  "data": [
    {
      "codigo": "EST00123",
      "nombre": "Juan Pérez",
      "ausencias": 5
    },
    {
      "codigo": "EST00124",
      "nombre": "María García", 
      "ausencias": 3
    }
  ]
}
```

#### Respuesta de Error
```javascript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El código del estudiante debe seguir el formato EST seguido de 5 dígitos",
    "details": {
      "field": "codigo",
      "value": "EST123",
      "expected": "EST\\d{5}"
    }
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Basándome en el análisis de prework de los criterios de aceptación, he identificado las siguientes propiedades universales que el sistema debe cumplir:

### Property 1: Unicidad de códigos de estudiante

*For any* conjunto de estudiantes en el sistema, todos los códigos deben ser únicos, y cualquier intento de crear un estudiante con un código existente debe ser rechazado.

**Validates: Requirements RF-001.1**

### Property 2: Búsqueda de estudiante por ID es consistente

*For any* estudiante válido creado en el sistema, buscarlo por su ID debe devolver exactamente el mismo estudiante con todos sus datos originales.

**Validates: Requirements RF-001.3**

### Property 3: Registro de asistencia preserva datos

*For any* combinación válida de estudiante existente, fecha válida no futura y estado válido, registrar la asistencia debe almacenar correctamente todos los datos proporcionados.

**Validates: Requirements RF-002.1**

### Property 4: Consulta de asistencias por estudiante es completa

*For any* estudiante con asistencias registradas, consultar sus asistencias debe devolver exactamente todas las asistencias que se han registrado para ese estudiante, sin omisiones ni duplicados.

**Validates: Requirements RF-002.2**

### Property 5: Prevención de asistencias duplicadas

*For any* asistencia ya registrada en el sistema, intentar registrar otra asistencia para el mismo estudiante en la misma fecha debe ser rechazado, independientemente del estado de asistencia.

**Validates: Requirements RF-002.3, RN-004**

### Property 6: Reporte de ausentismo es correcto

*For any* conjunto de estudiantes y asistencias en el sistema, el reporte de ausentismo debe devolver exactamente los estudiantes con más ausencias en orden descendente, limitado a los top 5.

**Validates: Requirements RF-003.1**

### Property 7: Formato de reporte de ausentismo es completo

*For any* entrada en el reporte de ausentismo, debe contener código del estudiante, nombre completo y cantidad exacta de ausencias.

**Validates: Requirements RF-003.2**

### Property 8: Validación de formato de código

*For any* código de estudiante proporcionado, debe ser aceptado si y solo si sigue exactamente el patrón EST seguido de 5 dígitos.

**Validates: Requirements RN-001**

### Property 9: Validación de estados de asistencia

*For any* estado de asistencia proporcionado, debe ser aceptado si y solo si es exactamente uno de: "presente", "ausente", o "justificada".

**Validates: Requirements RN-002**

### Property 10: Validación de fechas de asistencia

*For any* fecha proporcionada para asistencia, debe ser aceptada si y solo si es una fecha válida en formato ISO 8601 y no es posterior a la fecha actual.

**Validates: Requirements RN-003**

### Property 11: Integridad referencial de asistencias

*For any* intento de registrar una asistencia, debe ser aceptado si y solo si el estudiante referenciado existe en el sistema.

**Validates: Requirements RN-005**

## Error Handling

### Estrategia de Manejo de Errores

El sistema implementa un manejo centralizado de errores que garantiza respuestas consistentes y informativas para todos los casos de error posibles.

#### Middleware de Error Centralizado
```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  const response = {
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'Error interno del servidor',
      details: err.details || {}
    }
  };
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json(response);
};
```

### Tipos de Errores y Códigos HTTP

#### 1. Errores de Validación (400 Bad Request)
- **INVALID_STUDENT_CODE**: Código de estudiante con formato inválido
- **INVALID_DATE**: Fecha inválida o futura
- **INVALID_ATTENDANCE_STATE**: Estado de asistencia no permitido
- **MISSING_REQUIRED_FIELDS**: Campos requeridos faltantes
- **INVALID_UUID**: ID con formato UUID inválido

#### 2. Errores de Conflicto (409 Conflict)
- **DUPLICATE_STUDENT_CODE**: Código de estudiante ya existe
- **DUPLICATE_ATTENDANCE**: Asistencia duplicada para mismo estudiante y fecha

#### 3. Errores de Recurso No Encontrado (404 Not Found)
- **STUDENT_NOT_FOUND**: Estudiante no existe
- **NO_ATTENDANCE_RECORDS**: No hay registros de asistencia para el estudiante

#### 4. Errores Internos (500 Internal Server Error)
- **DATABASE_ERROR**: Error en operaciones de persistencia
- **INTERNAL_ERROR**: Error interno no categorizado

### Ejemplos de Respuestas de Error

#### Error de Validación
```javascript
{
  "success": false,
  "error": {
    "code": "INVALID_STUDENT_CODE",
    "message": "El código del estudiante debe seguir el formato EST seguido de 5 dígitos",
    "details": {
      "field": "codigo",
      "value": "EST123",
      "expected": "EST\\d{5}"
    }
  }
}
```

#### Error de Conflicto
```javascript
{
  "success": false,
  "error": {
    "code": "DUPLICATE_STUDENT_CODE",
    "message": "Ya existe un estudiante con el código EST00123",
    "details": {
      "field": "codigo",
      "value": "EST00123"
    }
  }
}
```

#### Error de Recurso No Encontrado
```javascript
{
  "success": false,
  "error": {
    "code": "STUDENT_NOT_FOUND",
    "message": "No se encontró un estudiante con el ID especificado",
    "details": {
      "field": "id",
      "value": "uuid-inexistente"
    }
  }
}
```

### Logging de Errores

Todos los errores se registran con diferentes niveles de severidad:
- **ERROR**: Errores 500 (internos del servidor)
- **WARN**: Errores 400-499 (errores del cliente)
- **INFO**: Operaciones exitosas importantes

## Testing Strategy

### Enfoque Dual de Testing

El sistema implementa una estrategia de testing dual que combina:

1. **Unit Tests**: Para casos específicos, ejemplos concretos y casos límite
2. **Property-Based Tests**: Para verificar propiedades universales a través de múltiples inputs generados

### Property-Based Testing

**Librería seleccionada**: `fast-check` para Node.js

**Configuración**:
- Mínimo 100 iteraciones por test de propiedad
- Cada test referencia su propiedad de diseño correspondiente
- Generadores personalizados para códigos de estudiante, fechas y estados

#### Generadores Personalizados

```javascript
// Generador de códigos válidos de estudiante
const validStudentCode = fc.integer({ min: 0, max: 99999 })
  .map(num => `EST${num.toString().padStart(5, '0')}`);

// Generador de fechas válidas no futuras
const validPastDate = fc.date({ max: new Date() })
  .map(date => date.toISOString().split('T')[0]);

// Generador de estados de asistencia válidos
const validAttendanceState = fc.constantFrom('presente', 'ausente', 'justificada');
```

#### Ejemplos de Property Tests

```javascript
// Property 1: Unicidad de códigos
test('Feature: asistencia-estudiantil, Property 1: Unicidad de códigos de estudiante', () => {
  fc.assert(fc.property(
    fc.array(validStudentCode, { minLength: 2, maxLength: 10 }),
    (codes) => {
      // Test implementation
    }
  ), { numRuns: 100 });
});

// Property 8: Validación de formato de código
test('Feature: asistencia-estudiantil, Property 8: Validación de formato de código', () => {
  fc.assert(fc.property(
    fc.string(),
    (code) => {
      const isValid = /^EST\d{5}$/.test(code);
      // Verify system accepts valid codes and rejects invalid ones
    }
  ), { numRuns: 100 });
});
```

### Unit Testing

**Framework**: Jest
**Cobertura objetivo**: 100% de líneas de código

#### Categorías de Unit Tests

1. **Tests de Ejemplo**: Casos concretos que demuestran funcionalidad correcta
2. **Tests de Casos Límite**: Valores extremos y condiciones especiales
3. **Tests de Integración**: Interacción entre capas del sistema
4. **Tests de Error**: Manejo correcto de condiciones de error

#### Estructura de Tests

```
tests/
├── unit/
│   ├── services/
│   │   ├── estudiantesService.test.js
│   │   ├── asistenciasService.test.js
│   │   └── reportesService.test.js
│   ├── controllers/
│   │   ├── estudiantesController.test.js
│   │   ├── asistenciasController.test.js
│   │   └── reportesController.test.js
│   └── middleware/
│       ├── errorHandler.test.js
│       └── validators.test.js
├── integration/
│   ├── estudiantes.integration.test.js
│   ├── asistencias.integration.test.js
│   └── reportes.integration.test.js
└── properties/
    ├── estudiantes.properties.test.js
    ├── asistencias.properties.test.js
    └── reportes.properties.test.js
```

### Criterios de Calidad

- **Cobertura de código**: 100%
- **Cobertura de propiedades**: Todas las 11 propiedades implementadas
- **Performance**: Todos los endpoints < 500ms
- **Reliability**: 0 errores no manejados en tests