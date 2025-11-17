module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/app.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  verbose: true,
  testTimeout: 10000,
  detectOpenHandles: false,
  forceExit: true,
  
  // Enhanced reporting
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'TaskForce API Test Report',
        outputPath: 'test-report.html',
        includeFailureMsg: true,
        includeConsoleLog: true,
        theme: 'defaultTheme',
        sort: 'status',
        executionTimeWarningThreshold: 5,
      },
    ],
  ],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 15,
      functions: 20,
      lines: 40,
      statements: 40,
    },
  },
};
