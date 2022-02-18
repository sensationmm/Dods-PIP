const { setEnvironmentVariablesForTest } = require('./setEnvironmentVariablesForTest');

setEnvironmentVariablesForTest();

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/unitTests/**/*.test.*'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!src/**/index.ts', '!src/constants/config.ts', '!src/lambdaMiddleware/**', '!src/domain/**'],
  modulePaths: ['<rootDir>'],
  coverageDirectory: './coverage',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coverageReporters: ["json", "lcov", "text", "cobertura"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};