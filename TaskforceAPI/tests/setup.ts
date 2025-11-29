// Test environment is loaded by globalSetup.ts
// This file runs after globalSetup and before each test file

// Extend Jest timeout for database operations
jest.setTimeout(30000);