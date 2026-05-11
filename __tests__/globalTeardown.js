const { sequelize } = require('../models');

module.exports = async () => {
  if (!global.__sequelizeClosed && sequelize.connectionManager.pool) {
    await sequelize.close();
    global.__sequelizeClosed = true;
  }
};
