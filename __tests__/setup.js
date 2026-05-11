const originalWarn = console.warn;

console.warn = (message, ...args) => {
  if (typeof message === 'string' && message.includes('SQLite does not support')) {
    return;
  }
  originalWarn(message, ...args);
};

const { sequelize } = require('../models');

sequelize.options.logging = false;

beforeAll(async () => {
  if (!global.__sequelizeReady) {
    await sequelize.authenticate();
    global.__sequelizeReady = true;
  }
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  console.warn = originalWarn;
});
