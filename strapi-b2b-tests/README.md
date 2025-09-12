# Strapi B2B Catalog - Test Suite

A comprehensive unit testing suite for the Strapi B2B catalog application, covering REST APIs, admin panel functionality, authentication, and data models.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Strapi B2B application running

### Installation

```bash
cd strapi-b2b-tests
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test suites
npm run test:api      # API endpoint tests
npm run test:admin    # Admin panel tests
npm run test:auth     # Authentication tests
npm run test:models   # Database model tests
```

## 📁 Test Structure

```
tests/
├── api/                    # REST API endpoint tests
│   ├── products.test.js    # Product CRUD operations
│   ├── categories.test.js  # Category management
│   └── suppliers.test.js   # Supplier management
├── admin/                  # Admin panel functionality tests
│   ├── admin-auth.test.js  # Admin authentication
│   └── content-manager.test.js # Content management operations
├── auth/                   # Authentication & authorization tests
│   └── authentication.test.js # User auth, JWT, roles
├── models/                 # Database model tests
│   └── product.model.test.js # Product model validation
├── helpers/                # Test utilities and helpers
│   └── test-utils.js      # Common test functions
└── setup/                  # Test configuration
    ├── jest.setup.js      # Jest configuration
    └── strapi-instance.js # Strapi test instance
```

## 🧪 Test Categories

### API Tests (`tests/api/`)
- **Products API**: CRUD operations, filtering, pagination, validation
- **Categories API**: Category management, relationships
- **Suppliers API**: Supplier data management, email validation

### Admin Panel Tests (`tests/admin/`)
- **Admin Authentication**: Login, token validation, user management
- **Content Manager**: CRUD via admin panel, bulk operations, content types

### Authentication Tests (`tests/auth/`)
- **User Registration**: Validation, duplicate prevention
- **User Login**: Credential validation, JWT generation
- **Protected Routes**: Token validation, role-based access
- **Authorization**: Permission testing, role enforcement

### Model Tests (`tests/models/`)
- **Data Validation**: Required fields, constraints, formats
- **Relationships**: Category associations, foreign keys
- **Queries**: Filtering, sorting, searching
- **Data Integrity**: Updates, partial modifications

## 🔧 Configuration

### Environment Variables
Tests use isolated environment with in-memory database:
- `NODE_ENV=test`
- `DATABASE_CLIENT=sqlite`
- `DATABASE_FILENAME=:memory:`

### Test Database
Each test suite uses a fresh in-memory SQLite database to ensure isolation and prevent test interference.

## 📊 Coverage Reports

Generate detailed coverage reports:

```bash
npm run test:coverage
```

Coverage reports include:
- Line coverage
- Function coverage
- Branch coverage
- Statement coverage

## 🛠️ Test Utilities

### Helper Functions (`tests/helpers/test-utils.js`)
- `createAdminUser()` - Create test admin user
- `getAdminJWT()` - Get admin authentication token
- `createTestUser()` - Create regular test user
- `getUserJWT()` - Get user authentication token
- `createTestProduct()` - Create test product data
- `createTestCategory()` - Create test category data
- `createTestSupplier()` - Create test supplier data
- `cleanupTestData()` - Clean up test data after tests

### Test Setup
- Automatic Strapi instance management
- Database cleanup between tests
- JWT token generation
- Test data factories

## 🚨 Best Practices

### Writing Tests
1. **Isolation**: Each test should be independent
2. **Cleanup**: Always clean up test data
3. **Descriptive Names**: Use clear, descriptive test names
4. **Assertions**: Use specific assertions with clear expectations
5. **Error Cases**: Test both success and failure scenarios

### Test Data
- Use factory functions for consistent test data
- Avoid hardcoded IDs or timestamps
- Clean up after each test to prevent interference

### Authentication
- Use helper functions for token generation
- Test both authenticated and unauthenticated scenarios
- Verify proper authorization for protected routes

## 📈 Continuous Integration

This test suite is designed to run in CI/CD pipelines:
- Fast execution with in-memory database
- Comprehensive coverage reporting
- Clear pass/fail indicators
- Detailed error reporting

## 🐛 Troubleshooting

### Common Issues

**Tests timing out:**
- Increase timeout in `jest.config.js`
- Check Strapi instance startup

**Database connection errors:**
- Verify test environment variables
- Check Strapi configuration

**Authentication failures:**
- Verify JWT secrets in test setup
- Check user creation helpers

### Debug Mode

Run tests with verbose output:
```bash
npm test -- --verbose
```

## 📝 Adding New Tests

1. Create test file in appropriate directory
2. Import required helpers and setup
3. Follow existing test patterns
4. Add cleanup in `afterEach` hooks
5. Update this README if adding new test categories

## 🤝 Contributing

1. Follow existing code style and patterns
2. Add tests for new features
3. Ensure all tests pass before submitting
4. Update documentation as needed

## 📄 License

MIT License - see LICENSE file for details
