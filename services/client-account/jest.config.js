module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/unitTests/**/*.test.*'],
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '!src/**/index.ts',
        '!src/constants/config.ts',
        '!src/domain/**',
        '!src/db/**',
    ],
    modulePaths: ['<rootDir>'],
    coverageDirectory: './coverage',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    coverageReporters: ['json', 'lcov', 'text', 'cobertura'],
    coverageThreshold: {
        global: {
            branches: 60,
            functions: 60,
            lines: 60,
            statements: 60,
        },
    },
};
