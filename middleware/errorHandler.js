const { UniqueConstraintError, ValidationError } = require('sequelize');
const logger = require('../config/logger');

module.exports = (error, req, res, next) => {
  let status = error.statusCode || 500;
  let message = status === 500 ? 'Internal server error' : error.message;
  let details;

  if (error instanceof UniqueConstraintError) {
    status = 409;
    message = 'Resource already exists.';
    details = error.errors.map((err) => ({
      field: err.path,
      message: err.message
    }));
  } else if (error instanceof ValidationError) {
    status = 400;
    message = 'Validation failed.';
    details = error.errors.map((err) => ({
      field: err.path,
      message: err.message
    }));
  }

  if (status === 500) {
    logger.error('Unhandled error', {
      message: error.message,
      stack: error.stack
    });
  }

  res.status(status).json({
    message,
    details
  });
};
