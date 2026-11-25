/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  transform: { '^.+\\.tsx?$': ['ts-jest', {}] },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/legado/**',
    '!src/libs/**',
    '!src/index.ts',
    '!src/**/*.test.ts',
  ],
  coverageThreshold: {
    global: { branches: 80 },
    './src/pricing/': { branches: 80 },
    './src/facade/': { branches: 80 },
  },
};
