# Error Handling and Logging System

This document describes the comprehensive error handling and logging system implemented for the Strapi B2B project.

## 🚀 Features

### Logging System
- **Multi-level logging**: ERROR, WARN, INFO, DEBUG
- **File output**: Automatic log file creation in `logs/` directory
- **Colored console output**: Different colors for different log levels
- **Structured logging**: JSON context support for detailed information
- **Request/Response logging**: Automatic API request and response tracking

### Error Handling
- **Global error middleware**: Catches and processes all unhandled errors
- **Custom error types**: Standardized error classes for different scenarios
- **Database error handling**: Specific handling for database-related errors
- **Startup error handling**: Comprehensive application bootstrap error management

### Database Service
- **Wrapper service**: Enhanced database operations with built-in error handling
- **Automatic logging**: All database operations are logged with context
- **Error transformation**: Database errors are transformed into user-friendly messages
- **Validation support**: Built-in validation error handling

## 📁 File Structure

```
src/
├── utils/
│   ├── logger.js              # Main logging utility
│   ├── error-types.js         # Custom error classes
│   └── test-error-handling.js # Test script for verification
├── middlewares/
│   ├── error-handler.js       # Global error handling middleware
│   └── request-logger.js      # Request logging middleware
├── services/
│   └── database-service.js    # Database service with error handling
└── index.js                   # Updated with startup error handling
```

## 🔧 Configuration

### Environment Variables

Add these to your `.env` file:

```bash
# Logging Configuration
LOG_LEVEL=INFO  # Available: ERROR, WARN, INFO, DEBUG

# Request Timing Logs
LOG_REQUEST_TIMING=true

# Database Query Logging
LOG_DATABASE_QUERIES=false
```

### Middleware Configuration

The middlewares are automatically configured in `config/middlewares.js`:

```javascript
module.exports = [
  {
    name: 'global::request-logger',
    config: {},
  },
  {
    name: 'global::error-handler',
    config: {},
  },
  // ... other middlewares
];
```

## 📊 Usage Examples

### Using the Logger

```javascript
const { logger } = require('./utils/logger.js');

// Basic logging
logger.info('User logged in', { userId: 123, email: 'user@example.com' });
logger.error('Database connection failed', { error: error.message });

// API logging
logger.logApiRequest('GET', '/api/products', 'user123');
logger.logApiError('POST', '/api/products', error, 'user123');

// Database logging
logger.logDatabaseOperation('CREATE', 'api::product.product', { name: 'New Product' });
logger.logDatabaseError('UPDATE', 'api::product.product', error);
```

### Using Custom Error Types

```javascript
const { ValidationError, NotFoundError } = require('./utils/error-types.js');

// Throw custom errors
throw new ValidationError('Invalid email format', { field: 'email' });
throw new NotFoundError('Product not found', { id: productId });
```

### Using Database Service

```javascript
const DatabaseService = require('./services/database-service.js');

module.exports = createCoreController('api::product.product', ({ strapi }) => {
  const dbService = new DatabaseService(strapi);
  
  return {
    async findOne(ctx) {
      try {
        const { id } = ctx.params;
        const product = await dbService.findOne('api::product.product', id, {
          populate: { category: true, supplier: true }
        });
        return this.transformResponse(product);
      } catch (error) {
        // Error is automatically logged by the database service
        throw error; // Will be handled by global error middleware
      }
    }
  };
});
```

## 🔍 Log Files

Logs are automatically created in the `logs/` directory:

- `error-YYYY-MM-DD.log` - Error level logs
- `warn-YYYY-MM-DD.log` - Warning level logs

## 🧪 Testing

Run the test script to verify error handling and logging:

```bash
node src/utils/test-error-handling.js
```

This will test:
- ✅ All logging levels and functions
- ✅ Custom error types
- ✅ Database service error handling
- ✅ File output creation

## 🚨 Error Response Format

All API errors return a standardized format:

```json
{
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Product not found",
    "details": "Product with id 123 does not exist"
  },
  "data": null
}
```

## 🔧 Error Types

| Error Type | Status Code | Description |
|------------|-------------|-------------|
| `ValidationError` | 400 | Invalid input data |
| `NotFoundError` | 404 | Resource not found |
| `UnauthorizedError` | 401 | Authentication required |
| `ForbiddenError` | 403 | Insufficient permissions |
| `DatabaseError` | 500 | Database operation failed |
| `ExternalServiceError` | 502 | External service unavailable |

## 📈 Benefits

1. **Improved Debugging**: Detailed logs with context information
2. **Better User Experience**: User-friendly error messages
3. **Monitoring**: Automatic error tracking and logging
4. **Maintenance**: Easier troubleshooting and issue resolution
5. **Scalability**: Structured logging for production environments

## 🔄 Integration with Existing Code

The error handling system is designed to work seamlessly with existing Strapi controllers and services. Simply:

1. Import the logger and database service
2. Replace direct `strapi.entityService` calls with `dbService` calls
3. Add try-catch blocks for additional error context
4. Let the global middleware handle error responses

The system maintains backward compatibility while adding comprehensive error handling and logging capabilities.
