# Especificación de Requisitos - API de Gestión de Asistencia Estudiantil

## 1. Descripción General

Sistema API REST para gestionar la asistencia de estudiantes en un programa académico, permitiendo el registro de estudiantes, control de asistencias por fecha y generación de reportes de ausentismo.

## 2. Requisitos Funcionales

### RF-001: Gestión de Estudiantes
- **RF-001.1**: El sistema debe permitir crear un nuevo estudiante con código único y nombre
- **RF-001.2**: El sistema debe permitir listar todos los estudiantes registrados
- **RF-001.3**: El sistema debe permitir consultar un estudiante específico por su ID

### RF-002: Gestión de Asistencias
- **RF-002.1**: El sistema debe permitir registrar una asistencia para un estudiante en una fecha específica
- **RF-002.2**: El sistema debe permitir consultar todas las asistencias de un estudiante específico
- **RF-002.3**: El sistema debe validar que no se registren asistencias duplicadas (mismo estudiante, misma fecha)

### RF-003: Reportes de Ausentismo
- **RF-003.1**: El sistema debe generar un reporte con los 5 estudiantes con más ausencias
- **RF-003.2**: El reporte debe mostrar el código del estudiante, nombre y cantidad de ausencias

## 3. Reglas de Negocio

### RN-001: Formato de Código de Estudiante
- El código del estudiante debe seguir el patrón: `EST` seguido de exactamente 5 dígitos
- Ejemplos válidos: `EST00123`, `EST99999`
- Ejemplos inválidos: `EST123`, `EST1234567`, `ABC00123`

### RN-002: Estados de Asistencia Válidos
- Los únicos estados permitidos son:
  - `presente`: El estudiante asistió a clase
  - `ausente`: El estudiante no asistió a clase
  - `justificada`: El estudiante no asistió pero presentó justificación

### RN-003: Validación de Fechas
- Las fechas de asistencia deben ser válidas (formato ISO 8601: YYYY-MM-DD)
- No se permiten fechas futuras para el registro de asistencias
- La fecha debe corresponder a un día válido del calendario

### RN-004: Unicidad de Registros
- No se puede registrar más de una asistencia para el mismo estudiante en la misma fecha
- El código del estudiante debe ser único en el sistema

### RN-005: Integridad Referencial
- Solo se pueden registrar asistencias para estudiantes que existan en el sistema
- Las consultas de asistencias por estudiante deben validar que el estudiante exista

## 4. Requisitos No Funcionales

### RNF-001: Rendimiento
- Los endpoints deben responder en menos de 500ms para operaciones normales
- El sistema debe soportar hasta 100 estudiantes y 1000 registros de asistencia

### RNF-002: Disponibilidad
- El sistema debe estar disponible 99% del tiempo durante horarios académicos
- Debe manejar errores de forma elegante sin crashear

### RNF-003: Seguridad
- Validación estricta de todos los datos de entrada
- Manejo seguro de errores sin exponer información sensible del sistema
- Configuración de CORS apropiada

### RNF-004: Mantenibilidad
- Código organizado en capas (rutas, controladores, servicios)
- Separación clara de responsabilidades
- Documentación completa de la API

## 5. Casos de Uso Principales

### CU-001: Registrar Nuevo Estudiante
**Actor**: Sistema académico
**Precondiciones**: Ninguna
**Flujo Principal**:
1. El sistema recibe una solicitud POST con código y nombre del estudiante
2. El sistema valida el formato del código (EST + 5 dígitos)
3. El sistema verifica que el código no exista previamente
4. El sistema almacena el estudiante
5. El sistema retorna confirmación con los datos del estudiante creado

**Flujos Alternativos**:
- 2a. Código con formato inválido → Retorna error 400
- 3a. Código duplicado → Retorna error 409

### CU-002: Registrar Asistencia
**Actor**: Sistema académico
**Precondiciones**: El estudiante debe existir en el sistema
**Flujo Principal**:
1. El sistema recibe una solicitud POST con ID del estudiante, fecha y estado
2. El sistema valida que el estudiante exista
3. El sistema valida el formato de la fecha y que no sea futura
4. El sistema valida que el estado sea uno de los permitidos
5. El sistema verifica que no exista una asistencia previa para esa fecha
6. El sistema almacena la asistencia
7. El sistema retorna confirmación

**Flujos Alternativos**:
- 2a. Estudiante no existe → Retorna error 404
- 3a. Fecha inválida o futura → Retorna error 400
- 4a. Estado inválido → Retorna error 400
- 5a. Asistencia duplicada → Retorna error 409

### CU-003: Generar Reporte de Ausentismo
**Actor**: Sistema académico
**Precondiciones**: Deben existir registros de asistencia
**Flujo Principal**:
1. El sistema recibe una solicitud GET para el reporte
2. El sistema calcula las ausencias por estudiante
3. El sistema ordena por cantidad de ausencias (descendente)
4. El sistema retorna los top 5 estudiantes con más ausencias

## 6. Propiedades de Correctitud (Property-Based Testing)

### Propiedad 1: Invariante de Código Único
```
∀ estudiante1, estudiante2 ∈ Sistema:
  estudiante1.codigo = estudiante2.codigo ⟹ estudiante1 = estudiante2
```

### Propiedad 2: Formato de Código Válido
```
∀ estudiante ∈ Sistema:
  estudiante.codigo ∈ /^EST\d{5}$/
```

### Propiedad 3: Estados de Asistencia Válidos
```
∀ asistencia ∈ Sistema:
  asistencia.estado ∈ {"presente", "ausente", "justificada"}
```

### Propiedad 4: Unicidad de Asistencia por Fecha
```
∀ asistencia1, asistencia2 ∈ Sistema:
  (asistencia1.estudianteId = asistencia2.estudianteId ∧ 
   asistencia1.fecha = asistencia2.fecha) ⟹ 
  asistencia1 = asistencia2
```

### Propiedad 5: Fechas No Futuras
```
∀ asistencia ∈ Sistema:
  asistencia.fecha ≤ fechaActual()
```

### Propiedad 6: Integridad Referencial
```
∀ asistencia ∈ Sistema:
  ∃ estudiante ∈ Sistema: estudiante.id = asistencia.estudianteId
```

## 7. Criterios de Aceptación

### Endpoints Requeridos
- ✅ POST `/api/estudiantes` - Crear estudiante
- ✅ GET `/api/estudiantes` - Listar estudiantes
- ✅ GET `/api/estudiantes/:id` - Obtener estudiante por ID
- ✅ POST `/api/asistencias` - Registrar asistencia
- ✅ GET `/api/asistencias/estudiante/:id` - Listar asistencias de estudiante
- ✅ GET `/api/reportes/ausentismo` - Top 5 estudiantes con más ausencias

### Validaciones Críticas
- ✅ Validación de formato de código EST\d{5}
- ✅ Validación de estados de asistencia
- ✅ Validación de fechas no futuras
- ✅ Prevención de duplicados
- ✅ Manejo de errores HTTP apropiados (400, 404, 409, 500)

### Calidad del Código
- ✅ Arquitectura en capas (rutas/controladores/servicios)
- ✅ Manejo centralizado de errores
- ✅ Validaciones con express-validator
- ✅ Cobertura de pruebas del 100%
- ✅ Documentación completa