// Configuración global para tests
const storage = require('../src/storage/MemoryStorage');

// Limpiar storage antes de cada test
beforeEach(() => {
  storage.limpiar();
});

// Configurar timeout para tests
jest.setTimeout(10000);

// Suprimir logs durante tests
if (process.env.NODE_ENV !== 'test') {
  console.log = jest.fn();
  console.error = jest.fn();
}