module.exports = {
  modulePaths: ['<rootDir>'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/mocks/file-mock.js',
    '\\.(css|less)$': '<rootDir>/src/mocks/style-mock.js',
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  testPathIgnorePatterns: ['node_modules', '.cache'],
  globals: {
    __PATH_PREFIX__: ``,
  },
  setupFiles: ['jest-canvas-mock'],
  setupFilesAfterEnv: ['<rootDir>/setup-test-env.js'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.styles.{ts,tsx}',
    '!src/**/_app.page.tsx',
    '!src/**/_document.page.tsx',
    '!coverage',
    '!src/globals/**/*.{ts,tsx}',
    '!src/components/_example/*',
    '!src/pages/api/*.*',
    '!src/lib/*.*',
  ],
};
