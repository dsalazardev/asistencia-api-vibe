## ADDED Requirements

### Requirement: Entorno de Pruebas Configurado
El repositorio MUST incluir `jest` y `supertest` instalados como dependencias de desarrollo y el script de prueba debe estar correctamente configurado.

#### Scenario: Instalación exitosa
- **WHEN** se ejecuta el script `npm test`
- **THEN** se invocará jest y supertest para evaluar las rutas de la API

### Requirement: Pruebas de Estudiantes
El sistema MUST poseer pruebas de integración que cubran las operaciones de estudiantes: creación exitosa, rechazo por código inválido, validación de duplicados.

#### Scenario: Validación de duplicados y código inválido
- **WHEN** se envían payloads con códigos inválidos (no siguen `EST\d{5}`) o estudiantes duplicados
- **THEN** las pruebas deben reportar el comportamiento de la API (esperando errores 400 o 409)

### Requirement: Pruebas de Asistencia
El sistema MUST poseer pruebas de integración que cubran la creación de asistencias, incluyendo rechazos por estados inválidos o fechas futuras.

#### Scenario: Estados y fechas no permitidos
- **WHEN** se intenta registrar asistencia con un estado diferente a 'presente', 'ausente' o 'justificada', o con una fecha futura
- **THEN** las pruebas deben fallar, evidenciando que el código actual permite esto si no fue bien implementado

### Requirement: Pruebas de Reportes y Consultas
El sistema MUST poseer pruebas de integración para listados generales, reportes de ausentismo para diferentes poblaciones (0, 1 o múltiples estudiantes), y validación de entidades no encontradas (404).

#### Scenario: Estudiantes inexistentes y reportes de ausentismo
- **WHEN** se consultan reportes de ausentismo o se busca un estudiante que no existe
- **THEN** las pruebas deben verificar si el endpoint retorna una respuesta adecuada o si arroja resultados inconsistentes

### Requirement: Documentación de Fallos (Auditoría)
El sistema MUST tener documentado en `AUDITORIA.md` bajo "Bugs confirmados por pruebas" los fallos descubiertos durante la ejecución de las pruebas.

#### Scenario: Fallos descubiertos
- **WHEN** `npm test` arroja tests fallidos (en rojo)
- **THEN** los detalles de los fallos deben documentarse manualmente en `AUDITORIA.md`
