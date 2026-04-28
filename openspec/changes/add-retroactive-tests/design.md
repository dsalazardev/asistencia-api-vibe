## Context

El proyecto se encuentra en la Fase 3 del taller "Del vibe coding a la ingeniería Agéntica". Anteriormente, la API se construyó únicamente mediante código generado por IA sin la debida revisión, lo que introdujo varios bugs sutiles en la lógica de negocio y las validaciones. Para preparar el sistema para una refactorización guiada y segura (Fase 4), es indispensable contar con una red de seguridad.

## Goals / Non-Goals

**Goals:**
- Configurar un entorno robusto de pruebas de integración usando Jest y Supertest.
- Proveer cobertura ejecutable para las reglas de negocio críticas definidas en el contexto del problema (Estudiantes, Asistencias, Reportes).
- Exponer y documentar los fallos actuales (vibe coding bugs) en la API.

**Non-Goals:**
- No es objetivo solucionar o arreglar los bugs encontrados (esto corresponde a la Fase 4).
- No se diseñarán pruebas unitarias o de carga; el enfoque es puramente pruebas de integración (HTTP/REST) para validar contratos.

## Decisions

- **Framework de Pruebas**: Se seleccionan Jest y Supertest. Son el estándar de la industria para pruebas en APIs de Node.js/Express, siendo fáciles de configurar y rápidos.
- **Estructura de Directorios**: Las pruebas se alojarán en `/tests/integration`. Esta separación ayuda a diferenciar pruebas de integración de futuras pruebas unitarias.
- **Flujo de Ejecución**: Ejecutar las pruebas provocará fallos intencionados (`FAIL`). El objetivo es visualizar este estado en rojo para posteriormente usarlo en la fase de refactorización agéntica.

## Risks / Trade-offs

- **Risk**: Riesgo de ensuciar el estado global (`MemoryStorage`) en pruebas sucesivas.
  - **Mitigation**: Las pruebas deben limpiar el estado de `MemoryStorage` antes y después de cada bloque de test (por ejemplo, usando funciones pre-test y post-test en `jest`), o bien garantizar que no interfieran en estado compartido, de acuerdo con las configuraciones que se establezcan.
