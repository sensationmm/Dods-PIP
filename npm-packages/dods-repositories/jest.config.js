
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/unitTests/**/*.test.*'],
    collectCoverageFrom: [
        '<rootDir>/src/**/index.ts',
        '!src/**/domain.ts',
    ],
    modulePaths: ['<rootDir>'],
    coverageDirectory: './coverage',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    coverageReporters: ['json', 'lcov', 'text', 'cobertura'],
    coverageThreshold: {
        global: {
            branches: 40,
            functions: 40,
            lines: 40,
            statements: 40,
        },
    },
    setupFiles: ["<rootDir>/setEnvVarsForTest.js"]
};
