import type { InitialOptionsTsJest } from 'ts-jest/dist/types';

const config: InitialOptionsTsJest = {
  preset: 'ts-jest',
  verbose: true,
  collectCoverage: true,
  coveragePathIgnorePatterns: ['test-utils'],
};

export default config;
