import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',          // Node environment for backend
  testMatch: ["**/unit_tests/**/*.test.ts"], // Test file pattern
  verbose: true,                    // Show detailed test results
};

export default config;