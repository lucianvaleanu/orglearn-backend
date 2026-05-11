const { Sequelize } = require('sequelize');

const sslEnabled = process.env.DB_SSL === 'true';

console.log("Checking DB Host:", process.env.DB_HOST ? "Defined" : "UNDEFINED");
console.log("Checking DB User:", process.env.DB_USER ? "Defined" : "UNDEFINED");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    dialect: 'mysql',
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
    dialectOptions: sslEnabled
      ? {
          ssl: {
            rejectUnauthorized: false
          }
        }
      : undefined
  }
);

module.exports = sequelize;