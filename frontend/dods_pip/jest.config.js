module.exports = {
   testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
   setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
   moduleNameMapper: {
      '\\.(css|less|scss|sass)$': '<rootDir>/src/tests/style-mock.js'
   },
   transform: {
     "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
   }
 };