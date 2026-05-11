const path = require('path');
const winston = require('winston');

const logDir = process.env.HOME || process.cwd();
const errorLogPath = path.join(logDir, 'error.log');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: errorLogPath,
      level: 'error'
    })
  ]
});

module.exports = logger;
