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