# PROM 1

Detén la ejecución anterior. Borra cualquier código o carpeta (como `taller-ai-first`) que hayas generado. Vamos a aplicar Spec-Driven Development estricto desde el inicio.

Paso 1: Lee el archivo `agents.md` para entender el dominio.

Paso 2: Crea INMEDIATAMENTE la carpeta `.kiro/specs/`.

Paso 3: Redacta y guarda TÚ MISMO los siguientes tres archivos:

- `.kiro/specs/requirements.md`: Reglas de negocio (regex EST\d{5}, fechas, duplicados, estados válidos).

- `.kiro/specs/design.md`: Arquitectura limpia de 3 capas (`/routes`, `/controllers`, `/services`) usando Express, validaciones con `express-validator` y manejo de errores centralizado. Persistencia en memoria.

- `.kiro/specs/tasks.md`: Un checklist secuencial paso a paso para construir la app (1. Setup, 2. Capa de Servicios, 3. Controladores, 4. Rutas, 5. Suite de 15 Tests con Jest/Supertest, 6. Documentación).

Paso 4: En cuanto termines de escribir los Specs, asume el rol de Agente Ejecutor. Lee tu propio `tasks.md` y comienza a programar TODO desde cero, tarea por tarea, sin detenerte. 

Paso 5: Asegúrate de que los 15 tests pasen en verde. Al terminar todo, ejecuta en la terminal: `git add .` y `git commit -m "feat: implementacion agentica completa desde specs"`.

Ejecuta todo esto de manera autónoma ahora mismo.


# PROMP 2

Actúa como un Arquitecto de QA (Quality Assurance) y Orquestador AI-First. Tu tarea exclusiva es ejecutar la "Fase 2 — Auditoría crítica del código generado" de mi taller. No debes modificar el código fuente de la aplicación en este paso, solo auditarlo.

Sigue estrictamente estos pasos de manera autónoma:

1. Lee el archivo `agents.md` en la raíz para interiorizar el contexto del negocio (API de asistencia estudiantil, formato EST\d{5}, estados válidos, etc.).
2. Analiza minuciosamente el código fuente actual de la API (ej. index.js, package.json).
3. Corre el comando `npm audit` en la terminal para evaluar el punto 6 de la checklist.
4. Evalúa el código basándote en la lista de verificación de 10 puntos de la Fase 2 (Validación de entrada, Manejo de errores, Seguridad, Estructura, Dependencias, Configuración, Idempotencia, Pruebas y Documentación).
5. Abre y sobrescribe el archivo `AUDITORIA.md` que está en la raíz. Debes documentar un MÍNIMO DE 8 HALLAZGOS técnicos reales encontrados en el código, utilizando EXACTAMENTE este formato Markdown para cada uno:

## Hallazgo [Número] — [Título de la vulnerabilidad o fallo]
- **Severidad:** [alta/media/baja]
- **Archivo/línea:** [Ruta del archivo], línea [X]
- **Descripción:** [Explicación del fallo según las reglas del negocio o buenas prácticas]
- **Evidencia:** [Prueba de escritorio o análisis visual del código, ej. "No hay bloque try/catch", "Permite strings vacíos"]
- **Impacto:** [Consecuencia en un entorno de producción real]

6. Una vez que el archivo `AUDITORIA.md` esté guardado con los 8+ hallazgos, ejecuta en la terminal los comandos: `git add AUDITORIA.md` y `git commit -m "docs: auditoria del codigo generado"`.


# PROM 3

opsx-explore
Explora en su totalidad el proyecto y lee el agents.md


# PROM 4


opsx-propose
 add-retroactive-tests

Por favor, actúa como un ingeniero de QA y ayúdame a implementar la Fase 3 del proyecto. El objetivo es crear una suite de pruebas de integración para detectar bugs introducidos durante las fases anteriores.

Requisitos para la especificación (Delta Spec):

Configuración del entorno: Instalar jest y supertest como dependencias de desarrollo (--save-dev). Configurar el script en package.json como "test": "jest --verbose".

Estructura: Crear una carpeta /tests.

Cobertura de Pruebas (Implementar estrictamente al menos 15 casos):

Estudiantes: Creación exitosa, códigos inválidos y validación de duplicados.

Asistencia: Registro exitoso, manejo de estados no permitidos, rechazo de fechas futuras y validación de duplicados (mismo estudiante/fecha).

Consultas y Reportes: Listado general, manejo de estudiantes inexistentes (404), y reportes de ausentismo (con 0, 1 y múltiples registros).

Robustez: Rechazo de payload malformado (JSON inválido) y validación de campos obligatorios.

Auditoría y Documentación: Después de escribir y ejecutar las pruebas, analizar los tests fallidos (en rojo) y documentarlos en AUDITORIA.md bajo una nueva sección titulada "Bugs confirmados por pruebas", explicando la vulnerabilidad de cada uno.

Trazabilidad: Actualizar el archivo PROMPTS.md documentando este paso.

Por favor, genera la propuesta (proposal.md), la especificación de los nuevos requisitos (specs/) y la lista de tareas a seguir (tasks.md).


# PROM 5

/opsx:apply
Por favor, procede a ejecutar las tareas listadas en el archivo tasks.md paso a paso. Asegúrate de instalar las dependencias, escribir los al menos 15 casos de prueba para Jest y Supertest, y luego ejecutar npm test. Al finalizar la ejecución, recopila los tests que fallaron (en rojo) y actualiza el archivo AUDITORIA.md explicando la vulnerabilidad. Finalmente, actualiza el archivo PROMPTS.md tal como se indica en la tarea 4.3.

# PROMP 6

Espera, revisando las instrucciones de la docente, ella exige estrictamente "al menos 15 casos de prueba" (es decir, un mínimo de 15 bloques it() o test() independientes en Jest).

Por favor, realiza lo siguiente en el change actual (add-retroactive-tests):

Analiza los archivos en la carpeta /tests/integration/ y cuenta exactamente cuántos bloques it() o test() has creado.

Escribe los tests adicionales necesarios para llegar a un mínimo de 15 casos en total. Para completarlos, desglosa mejor las pruebas existentes o añade casos de borde más específicos de robustez, por ejemplo:

Estudiantes: Creación con tipos de datos incorrectos (ej. números en lugar de strings o emails sin formato válido).

Asistencias: Intento de registro de asistencia con un ID de estudiante que no existe en el sistema.

Reportes: Búsquedas con fechas de inicio mayores a las fechas de fin, o parámetros de búsqueda maliciosos.

Actualiza el archivo tasks.md añadiendo las tareas correspondientes a estos tests adicionales y márcalas como completadas cuando los escribas.

Vuelve a ejecutar npm test para validar la nueva suite completa de 15+ tests. Si los nuevos tests revelan más fallos en la API, documéntalos en la sección "Bugs confirmados por pruebas" de AUDITORIA.md.

Actualiza PROMPTS.md con esta instrucción para mantener el historial de indicaciones intacto.

# PROMP 7

Next Steps:
1. Refactor ReportesService and ReportesController to fix the statistics and filtering logic.
2. Implement robust input validation for all GET query parameters using express-validator to prevent the crashes triggered by the new robustness tests.
3. Verify the fix by running npm test until all 46 tests pass.
4. Update the documentation (tasks.md and PTROMPS.md) to maintain project traceability.

# PROMP 8

/opsx:archive
Por favor, procede a archivar este cambio.
