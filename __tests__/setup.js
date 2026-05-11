const { sequelize } = require('../models');

sequelize.options.logging = false;

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});
