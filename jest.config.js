module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/__tests__/env.js'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  testPathIgnorePatterns: [
    '<rootDir>/__tests__/env.js',
    '<rootDir>/__tests__/setup.js'
  ]
};
