'use strict';

/**
 * Test script for error handling and logging functionality
 * Run this script to verify that error handling and logging work correctly
 */

const { logger } = require('./logger.js');
const { 
  ApplicationError, 
  ValidationError, 
  NotFoundError, 
  DatabaseError 
} = require('./error-types.js');

async function testLogging() {
  console.log('\n=== Testing Logging Functionality ===\n');

  // Test different log levels
  logger.debug('This is a debug message', { component: 'test', data: { test: true } });
  logger.info('This is an info message', { component: 'test', action: 'testing' });
  logger.warn('This is a warning message', { component: 'test', issue: 'minor' });
  logger.error('This is an error message', { component: 'test', error: 'test error' });

  // Test API logging functions
  logger.logApiRequest('GET', '/api/products', 'user123');
  logger.logApiError('POST', '/api/products', new Error('Test API error'), 'user123');

  // Test database logging functions
  logger.logDatabaseOperation('CREATE', 'api::product.product', { name: 'Test Product' });
  logger.logDatabaseError('UPDATE', 'api::product.product', new Error('Test DB error'));

  // Test startup logging
  logger.logStartup('Test startup message', { version: '1.0.0' });
  logger.logStartupError('Test startup error', new Error('Test startup failure'));

  console.log('\n✅ Logging tests completed. Check the logs/ directory for output files.\n');
}

async function testErrorTypes() {
  console.log('=== Testing Custom Error Types ===\n');

  try {
    throw new ValidationError('Invalid input data', { field: 'name', value: '' });
  } catch (error) {
    console.log(`✅ ValidationError: ${error.name} - ${error.message} (Status: ${error.status})`);
  }

  try {
    throw new NotFoundError('Product not found', { id: 123 });
  } catch (error) {
    console.log(`✅ NotFoundError: ${error.name} - ${error.message} (Status: ${error.status})`);
  }

  try {
    throw new DatabaseError('Connection failed', { host: 'localhost', port: 3306 });
  } catch (error) {
    console.log(`✅ DatabaseError: ${error.name} - ${error.message} (Status: ${error.status})`);
  }

  console.log('\n✅ Error type tests completed.\n');
}

async function testDatabaseService() {
  console.log('=== Testing Database Service Error Handling ===\n');

  // Mock Strapi object for testing
  const mockStrapi = {
    entityService: {
      findOne: async (uid, id) => {
        if (id === 'not-found') {
          return null;
        }
        if (id === 'error') {
          const error = new Error('Database connection failed');
          error.code = 'ECONNREFUSED';
          throw error;
        }
        return { id, name: 'Test Product' };
      },
      findMany: async (uid, params) => {
        if (params.error) {
          const error = new Error('Duplicate entry');
          error.code = 'ER_DUP_ENTRY';
          throw error;
        }
        return [{ id: 1, name: 'Product 1' }, { id: 2, name: 'Product 2' }];
      }
    }
  };

  const DatabaseService = require('../services/database-service.js');
  const dbService = new DatabaseService(mockStrapi);

  // Test successful operation
  try {
    const result = await dbService.findOne('api::product.product', '1');
    console.log('✅ Successful database operation:', result.name);
  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }

  // Test not found error
  try {
    await dbService.findOne('api::product.product', 'not-found');
    console.log('❌ Should have thrown NotFoundError');
  } catch (error) {
    console.log(`✅ NotFoundError handled: ${error.name} - ${error.message}`);
  }

  // Test database connection error
  try {
    await dbService.findOne('api::product.product', 'error');
    console.log('❌ Should have thrown DatabaseError');
  } catch (error) {
    console.log(`✅ Database connection error handled: ${error.name} - ${error.message}`);
  }

  // Test duplicate entry error
  try {
    await dbService.findMany('api::product.product', { error: true });
    console.log('❌ Should have thrown ValidationError');
  } catch (error) {
    console.log(`✅ Duplicate entry error handled: ${error.name} - ${error.message}`);
  }

  console.log('\n✅ Database service tests completed.\n');
}

async function runAllTests() {
  console.log('🚀 Starting Error Handling and Logging Tests\n');
  
  try {
    await testLogging();
    await testErrorTypes();
    await testDatabaseService();
    
    console.log('🎉 All tests completed successfully!');
    console.log('📁 Check the logs/ directory for log files.');
    console.log('📊 Review console output for error handling verification.');
    
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    logger.error('Test execution failed', { error: error.message, stack: error.stack });
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testLogging,
  testErrorTypes,
  testDatabaseService,
  runAllTests
};
