module.exports = {
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', '<rootDir>'],
  setupFiles: ['<rootDir>/__tests__/env.js'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  globalTeardown: '<rootDir>/__tests__/globalTeardown.js',
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  testPathIgnorePatterns: [
    '<rootDir>/__tests__/env.js',
    '<rootDir>/__tests__/setup.js'
  ]
};
