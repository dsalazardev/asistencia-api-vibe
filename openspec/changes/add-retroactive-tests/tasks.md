## 1. Configuración del Entorno de Pruebas

- [x] 1.1 Instalar dependencias de desarrollo: `jest` y `supertest` usando `--save-dev`.
- [x] 1.2 Configurar el script de ejecución en `package.json`: `"test": "jest --verbose"`.
- [x] 1.3 Crear la estructura base del directorio de pruebas creando la carpeta `/tests/integration`.

## 2. Implementación de Pruebas: Estudiantes y Asistencias

- [x] 2.1 Crear archivo `tests/integration/estudiantes.test.js` e implementar pruebas de creación exitosa, códigos inválidos y duplicados.
- [x] 2.2 Crear archivo `tests/integration/asistencias.test.js` e implementar pruebas de registro exitoso, estados no permitidos, fechas futuras y duplicados (mismo estudiante y fecha).

## 3. Implementación de Pruebas: Reportes y Casos de Borde

- [x] 3.1 Crear archivo `tests/integration/reportes.test.js` e implementar pruebas para el listado general de estudiantes/asistencias.
- [x] 3.2 Implementar pruebas de manejo de estudiantes inexistentes (validar código HTTP 404).
- [x] 3.3 Implementar pruebas para los endpoints de reportes de ausentismo con 0, 1 y múltiples registros.
- [x] 3.4 Validar la respuesta de la API frente a payloads malformados (JSON inválido) y ausencia de campos obligatorios en los diferentes endpoints.

## 4. Ejecución y Auditoría

- [x] 4.1 Ejecutar la suite completa (`npm test`) y recolectar los resultados de los tests fallidos.
- [x] 4.2 Documentar detalladamente los tests fallidos en `AUDITORIA.md` bajo la nueva sección "Bugs confirmados por pruebas", detallando la vulnerabilidad.
- [x] 4.3 Actualizar el archivo `PROMPTS.md` documentando las acciones tomadas en este paso para la trazabilidad del proyecto.

## 5. Pruebas Adicionales de Robustez (Refuerzo)

- [x] 5.1 Estudiantes: Añadir prueba para rechazar la creación con tipos de datos incorrectos (ej. números en lugar de strings).
- [x] 5.2 Asistencias: Añadir prueba para el intento de registro con un ID de estudiante nulo o vacío.
- [x] 5.3 Reportes: Añadir pruebas para búsquedas con fechas de inicio mayores a las fechas de fin y parámetros maliciosos.
