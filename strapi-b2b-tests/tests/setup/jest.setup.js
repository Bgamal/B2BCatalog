// Jest setup file for Strapi B2B tests
const path = require('path');

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_CLIENT = 'sqlite';
process.env.DATABASE_FILENAME = path.join(__dirname, '../../../strapi-b2b/database/test.db');
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.ADMIN_JWT_SECRET = 'test-admin-jwt-secret-key-for-testing-only';
process.env.APP_KEYS = 'test-app-key-1,test-app-key-2';
process.env.API_TOKEN_SALT = 'test-api-token-salt';
process.env.TRANSFER_TOKEN_SALT = 'test-transfer-token-salt';
process.env.HOST = '0.0.0.0';
process.env.PORT = 1338;

// Global test timeout
jest.setTimeout(30000);

// Global test setup
beforeAll(async () => {
  console.log('Starting Strapi B2B test suite...');
});

afterAll(async () => {
  console.log('Strapi B2B test suite completed.');
});

// Clean up after each test
afterEach(async () => {
  // Clear any test data if needed
});
