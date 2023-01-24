
const ci = !!process.env.CI;

/** @type {import('jest').Config} */
module.exports = {
  roots: ['<rootDir>/test'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'node',
  coverageProvider: 'v8',
  coverageReporters: ci
  ? ['html', 'json', 'text']
  : ['html', 'text'],
};
