const jwt = require('jsonwebtoken');

const DEFAULT_SECRET = 'test-secret';

const createToken = (userId, overrides = {}) =>
  jwt.sign({ userId, ...overrides }, process.env.JWT_SECRET || DEFAULT_SECRET, {
    expiresIn: '24h'
  });

module.exports = {
  createToken
};
