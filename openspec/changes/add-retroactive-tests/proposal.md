## Why

Implementar la Fase 3 del proyecto según la guía de `agents.md`, actuando como un ingeniero de QA para crear una suite robusta de pruebas de integración. Estas pruebas "retroactivas" tienen como objetivo principal detectar y exponer los bugs introducidos durante la fase previa de "vibe coding", asegurando que queden documentados antes de la refactorización.

## What Changes

- Configuración del entorno de pruebas: instalación de `jest` y `supertest` y configuración del script `test` en `package.json`.
- Creación de la estructura base para las pruebas en una nueva carpeta `/tests`.
- Implementación de una suite de al menos 15 casos de pruebas de integración para los endpoints de estudiantes, asistencias, y reportes, abarcando escenarios felices, validación de datos inválidos, estados no permitidos y payloads malformados.
- Ejecución de la suite y documentación de las pruebas fallidas en una nueva sección de `AUDITORIA.md` titulada "Bugs confirmados por pruebas", detallando la vulnerabilidad descubierta por cada fallo.
- Actualización del archivo `PROMPTS.md` para mantener la trazabilidad de esta fase de ingeniería.

## Capabilities

### New Capabilities
- `retroactive-tests`: Especificación de la configuración, estructura y cobertura de casos para las pruebas de integración retroactivas con Jest y Supertest.

### Modified Capabilities

## Impact

- **Código:** Modificaciones en `package.json` para scripts de test y devDependencies.
- **Estructura:** Nueva carpeta `tests` y archivos de pruebas `.test.js` en el repositorio.
- **Documentación:** Actualizaciones a `AUDITORIA.md` y `PROMPTS.md`.
- **Comportamiento:** No se alteran los endpoints ni la lógica de la API, el impacto es puramente a nivel de pruebas (testing) y auditoría.
