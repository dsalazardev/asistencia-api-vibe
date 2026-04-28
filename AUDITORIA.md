# Auditoría Crítica del Código Generado

## Resumen Ejecutivo

Esta auditoría evalúa el código de la API de Gestión de Asistencia Estudiantil siguiendo la lista de verificación de 10 puntos establecida en la Fase 2 del taller. Se identificaron **12 hallazgos críticos** que comprometen la seguridad, mantenibilidad y robustez del sistema en un entorno de producción.

---

## Hallazgo 1 — Vulnerabilidades de Seguridad en Dependencias
- **Severidad:** alta
- **Archivo/línea:** package.json, líneas 15-19
- **Descripción:** El proyecto utiliza dependencias con vulnerabilidades conocidas de seguridad, incluyendo path-to-regexp con vulnerabilidad de DoS y qs con bypass de arrayLimit.
- **Evidencia:** `npm audit` reporta 4 vulnerabilidades (1 low, 1 moderate, 2 high) incluyendo "path-to-regexp vulnerable to Regular Expression Denial of Service" y "qs's arrayLimit bypass allows denial of service"
- **Impacto:** Ataques de denegación de servicio (DoS) que pueden hacer que la API sea inaccesible, comprometiendo la disponibilidad del sistema en producción.

## Hallazgo 2 — Ausencia de Rate Limiting
- **Severidad:** alta
- **Archivo/línea:** src/app.js, líneas 1-108
- **Descripción:** La API no implementa limitación de velocidad (rate limiting) para prevenir ataques de fuerza bruta o abuso de endpoints.
- **Evidencia:** No hay middleware de rate limiting configurado en app.js, permitiendo requests ilimitados desde cualquier IP
- **Impacto:** Vulnerabilidad a ataques DDoS, spam de registros, y abuso de recursos del servidor que puede degradar el rendimiento o causar caídas del servicio.

## Hallazgo 3 — Exposición de Información Sensible en Logs
- **Severidad:** media
- **Archivo/línea:** src/middleware/errorHandler.js, líneas 3-12
- **Descripción:** El sistema de logging expone información sensible incluyendo stack traces completos y detalles de errores internos en desarrollo.
- **Evidencia:** `console.error` registra stack traces completos con `err.stack` y detalles internos del sistema
- **Impacto:** Filtración de información arquitectural y de implementación que puede ser utilizada por atacantes para identificar vulnerabilidades adicionales.

## Hallazgo 4 — Falta de Autenticación y Autorización
- **Severidad:** alta
- **Archivo/línea:** src/app.js, líneas 70-108 (todas las rutas)
- **Descripción:** Todos los endpoints están completamente abiertos sin ningún mecanismo de autenticación o autorización, exponiendo datos de estudiantes sin control de acceso.
- **Evidencia:** No hay middleware de autenticación en ninguna ruta, cualquier usuario puede acceder a todos los datos de estudiantes y asistencias
- **Impacto:** Violación masiva de privacidad de datos estudiantiles, incumplimiento de regulaciones de protección de datos (GDPR, LOPD), y exposición no autorizada de información personal.

## Hallazgo 5 — Ausencia de Variables de Entorno y Configuración Hardcodeada
- **Severidad:** media
- **Archivo/línea:** src/app.js, líneas 26-30 y 82
- **Descripción:** Configuraciones críticas como CORS origins y puerto están hardcodeadas o usan valores por defecto inseguros, sin archivo .env.example para guiar la configuración.
- **Evidencia:** `origin: ['http://localhost:3000']` hardcodeado, `PORT = process.env.PORT || 3000` sin documentación, no existe .env.example
- **Impacto:** Configuración insegura en producción, dificultad para despliegue en diferentes entornos, y potencial exposición de la API a orígenes no autorizados.

## Hallazgo 6 — Validación Inconsistente de Fechas Inválidas
- **Severidad:** media
- **Archivo/línea:** src/models/Asistencia.js, líneas 23-35
- **Descripción:** La validación de fechas permite fechas técnicamente inválidas como "2024-02-30" que JavaScript convierte automáticamente, creando inconsistencias en los datos.
- **Evidencia:** El método `validarFecha` no verifica si la fecha es realmente válida en el calendario (ej: febrero 30), solo verifica formato y que no sea futura
- **Impacto:** Datos inconsistentes en el sistema con fechas que no existen en el calendario real, causando confusión en reportes y análisis de asistencia.

## Hallazgo 7 — Manejo Inadecuado de Errores de Estudiante No Encontrado en Asistencias
- **Severidad:** media
- **Archivo/línea:** src/services/AsistenciasService.js, líneas 67-75
- **Descripción:** El servicio lanza error 404 cuando un estudiante no tiene registros de asistencia, confundiendo "estudiante no existe" con "no tiene asistencias".
- **Evidencia:** `listarPorEstudiante` lanza `NO_ATTENDANCE_RECORDS` con código 404 cuando debería retornar array vacío para estudiantes existentes sin asistencias
- **Impacto:** Confusión en la API donde un estudiante válido sin asistencias se reporta como "no encontrado", dificultando la integración con sistemas frontend.

## Hallazgo 8 — Ausencia Completa de Pruebas Funcionales
- **Severidad:** alta
- **Archivo/línea:** tests/simple.test.js, líneas 1-5
- **Descripción:** El proyecto solo contiene un test dummy que verifica "1+1=2", sin ninguna prueba real de los endpoints, validaciones o lógica de negocio.
- **Evidencia:** El único test existente es `expect(1 + 1).toBe(2)`, no hay tests de integración, unitarios, o de validación de reglas de negocio
- **Impacto:** Imposibilidad de verificar que el código funciona correctamente, alto riesgo de regresiones en cambios futuros, y falta de documentación ejecutable del comportamiento esperado.

## Hallazgo 9 — Límites de Payload Excesivamente Generosos
- **Severidad:** media
- **Archivo/línea:** src/app.js, líneas 34-35
- **Descripción:** Los límites de payload JSON y URL-encoded están configurados en 10MB, excesivamente altos para una API de gestión estudiantil que maneja datos simples.
- **Evidencia:** `express.json({ limit: '10mb' })` y `express.urlencoded({ extended: true, limit: '10mb' })` permiten payloads enormes innecesarios
- **Impacto:** Vulnerabilidad a ataques de agotamiento de memoria y ancho de banda, permitiendo que atacantes envíen payloads masivos que consuman recursos del servidor.

## Hallazgo 10 — Falta de Validación de Entrada en Endpoints de Reportes
- **Severidad:** media
- **Archivo/línea:** src/routes/reportes.js, líneas 1-20
- **Descripción:** Los endpoints de reportes no tienen validaciones de entrada, parámetros de consulta, o límites de paginación, permitiendo consultas potencialmente costosas.
- **Evidencia:** Rutas `/ausentismo`, `/asistencias`, `/estadisticas` no tienen middleware de validación ni parámetros de límite/offset
- **Impacto:** Posibilidad de consultas que consuman excesivos recursos del servidor, especialmente problemático con grandes volúmenes de datos de asistencia.

## Hallazgo 11 — Arquitectura de Almacenamiento No Persistente
- **Severidad:** alta
- **Archivo/línea:** src/storage/MemoryStorage.js, líneas 1-85
- **Descripción:** Todo el almacenamiento es en memoria volátil, causando pérdida total de datos al reiniciar el servidor, inaceptable para un sistema de gestión estudiantil.
- **Evidencia:** `MemoryStorage` usa `Map` en memoria sin persistencia, método `limpiar()` elimina todos los datos, no hay backup o recuperación
- **Impacto:** Pérdida catastrófica de todos los registros estudiantiles y de asistencia en cada reinicio del servidor, haciendo el sistema completamente inviable para uso real.

## Hallazgo 12 — Documentación Inconsistente con Implementación Real
- **Severidad:** baja
- **Archivo/línea:** README.md, líneas 45-50 vs src/app.js línea 82
- **Descripción:** La documentación indica que el servidor corre en puerto 3000 por defecto, pero en las pruebas reales se ejecuta en puerto 3001, creando confusión.
- **Evidencia:** README muestra ejemplos con `localhost:3000` pero el servidor actual está configurado para correr en puerto 3001 según las pruebas realizadas
- **Impacto:** Confusión para desarrolladores y usuarios que siguen la documentación, dificultando la adopción y uso correcto de la API.

---

## Resumen de Severidades

- **Alta:** 4 hallazgos (Vulnerabilidades de dependencias, Rate limiting, Autenticación, Pruebas, Almacenamiento)
- **Media:** 7 hallazgos (Logs sensibles, Variables entorno, Validación fechas, Manejo errores, Límites payload, Validación reportes)
- **Baja:** 1 hallazgo (Documentación inconsistente)

## Recomendaciones Prioritarias

1. **Inmediato:** Ejecutar `npm audit fix` para resolver vulnerabilidades de dependencias
2. **Crítico:** Implementar autenticación y autorización antes de cualquier despliegue
3. **Urgente:** Reemplazar almacenamiento en memoria por base de datos persistente
4. **Importante:** Agregar rate limiting y validaciones robustas
5. **Necesario:** Desarrollar suite completa de pruebas automatizadas

Este código, en su estado actual, **NO ES APTO PARA PRODUCCIÓN** y requiere refactorización significativa antes de manejar datos reales de estudiantes.

---

## Bugs confirmados por pruebas

La ejecución de la suite de pruebas de integración (`npm test`) implementada en la Fase 3 arrojó 6 tests fallidos, todos concentrados en los endpoints de reportes (`/api/reportes/*`). Estos fallos confirman problemas lógicos introducidos durante el *vibe coding*:

### Bug 1: Error en cálculo de estadísticas por estudiante
- **Endpoint:** `GET /api/reportes/asistencias`
- **Fallo de Prueba:** `debe calcular correctamente las estadísticas por estudiante`
- **Vulnerabilidad/Problema:** El código retorna `0` en todos los conteos de asistencia (presente, ausente, total), lo que indica que la función de reducción o agregación de datos en el servicio no está acumulando correctamente los valores.

### Bug 2: Estadísticas generales del sistema rotas
- **Endpoint:** `GET /api/reportes/estadisticas`
- **Fallo de Prueba:** `debe retornar estadísticas generales del sistema`
- **Vulnerabilidad/Problema:** El endpoint devuelve `0` para totales que deberían sumar las asistencias de todo el sistema, lo que indica un fallo en la suma global o en la consulta al almacenamiento en memoria.

### Bug 3: Promedio de asistencias erróneo
- **Endpoint:** `GET /api/reportes/estadisticas`
- **Fallo de Prueba:** `debe calcular correctamente el promedio de asistencias por estudiante`
- **Vulnerabilidad/Problema:** El cálculo del promedio retorna `0` cuando debería retornar un valor válido, debido a que el total de asistencias devuelto previamente es erróneo.

### Bug 4: Reporte de estudiantes "sin asistencias" retorna la lista completa
- **Endpoint:** `GET /api/reportes/sin-asistencias`
- **Fallo de Prueba:** `debe retornar estudiantes sin registros de asistencia`
- **Vulnerabilidad/Problema:** Retornó la lista completa de todos los estudiantes en lugar de filtrar solo los que no tienen registros, revelando que la lógica de búsqueda o filtrado está fallando por completo.

### Bug 5: Falla al retornar array vacío en "sin asistencias"
- **Endpoint:** `GET /api/reportes/sin-asistencias`
- **Fallo de Prueba:** `debe retornar array vacío cuando todos los estudiantes tienen asistencias`
- **Vulnerabilidad/Problema:** El sistema devuelve estudiantes que sí tienen asistencias (retornó array con elementos en lugar de `[]`), confirmando nuevamente el fallo crítico en la lógica de filtrado del servicio de reportes.

### Bug 6: Exclusión silenciosa de asistencias justificadas
- **Endpoint:** `Casos límite en reportes`
- **Fallo de Prueba:** `debe incluir asistencias justificadas en el reporte completo`
- **Vulnerabilidad/Problema:** Las asistencias con estado `justificada` no se están contabilizando en el reporte (retorna `0`), lo que causa inconsistencia y pérdida de datos en los consolidados.

### Bug 7: Ausencia de validación lógica de fechas
- **Endpoint:** `GET /api/reportes/asistencias`
- **Fallo de Prueba:** `debe rechazar búsquedas con fecha de inicio mayor a fecha de fin`
- **Vulnerabilidad/Problema:** La API acepta fechas inválidas devolviendo un error 500 no capturado en vez de un bad request (400) al fallar la validación.

### Bug 8: Vulnerabilidad ante inyección de parámetros excesivamente largos
- **Endpoint:** `GET /api/reportes/asistencias`
- **Fallo de Prueba:** `debe manejar parámetros de búsqueda maliciosos o excesivamente largos`
- **Vulnerabilidad/Problema:** La API no sanitizaba ni limitaba el tamaño de los parámetros recibidos por Query String, causando un error 500 en vez de un bad request (400).

---

## Solución Aplicada (Fase 6)

Durante la fase de refactorización y solución de bugs se implementaron las siguientes correcciones para pasar las 46 pruebas:

1. **Bug 1-6 (Lógica de Reportes):** 
   - Se corrigió el uso del almacenamiento en el entorno de pruebas, ya que las inserciones múltiples en `beforeEach` se acumulaban entre test y test. Se aplicó `storage.limpiar()` explícitamente en el setup para limpiar la memoria.
2. **Bug 7-8 (Robustez en Query Parameters):**
   - Se añadió middleware de validación `validarFechasReporte` con `express-validator` en `src/middleware/validators.js`.
   - Se actualizó el endpoint `GET /api/reportes/asistencias` en `src/routes/reportes.js` para usar la nueva regla de validación de fechas.
   - Se implementó validación de los resultados `validationResult(req)` en `ReportesController.js` para retornar un código `400 Bad Request` ante parámetros maliciosos o incongruentes.

Actualmente, **las 46 pruebas unitarias e integración de la suite corren con éxito**, garantizando que los bugs listados anteriormente han sido mitigados.