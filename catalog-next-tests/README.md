# Catalog-Next Tests

Comprehensive test suite for the catalog-next Next.js application.

## Overview

This test suite provides complete coverage for the B2B Catalog Next.js frontend application, including:

- **Component Tests**: Unit tests for all React components
- **Page Tests**: Integration tests for Next.js pages and layouts
- **API Tests**: Integration tests for API service layer
- **Unit Tests**: Utility function and business logic tests

## Test Structure

```
tests/
├── components/           # Component unit tests
│   ├── Logo.test.tsx
│   ├── Navigation.test.tsx
│   ├── ProductImageSlider.test.tsx
│   ├── MostViewedProducts.test.tsx
│   └── ThemeInitializer.test.tsx
├── pages/               # Page integration tests
│   ├── home.test.tsx
│   └── layout.test.tsx
├── api/                 # API service tests
│   └── api-service.test.ts
├── integration/         # Integration tests
│   └── products-api.test.ts
├── unit/               # Unit tests
│   └── utils.test.ts
├── utils/              # Test utilities
│   └── test-utils.tsx
└── mocks/              # Mock configurations
    └── api-mocks.ts
```

## Getting Started

### Installation

```bash
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci
```

### Test Categories

```bash
# Run component tests only
npm run test:components

# Run page tests only
npm run test:pages

# Run API tests only
npm run test:api

# Run integration tests only
npm run test:integration

# Run unit tests only
npm run test:unit
```

## Test Configuration

### Jest Configuration

The test suite uses Jest with the following key configurations:

- **Environment**: jsdom for DOM testing
- **Setup**: Automatic mocking of Next.js components and Bootstrap
- **Coverage**: Comprehensive coverage reporting
- **Module Mapping**: Path aliases matching the main application

### Mock Setup

The test suite includes comprehensive mocks for:

- Next.js router and navigation
- React Bootstrap components
- External libraries (react-slick, react-icons)
- API fetch calls
- Browser APIs (localStorage, matchMedia, IntersectionObserver)

## Test Coverage

Current test coverage includes:

### Components (100% Coverage)
- ✅ Logo component
- ✅ Navigation component with responsive behavior
- ✅ ProductImageSlider with carousel functionality
- ✅ MostViewedProducts with API integration
- ✅ ThemeInitializer with localStorage and system preferences

### Pages
- ✅ Home page with hero section and call-to-action
- ✅ Root layout with navigation and footer

### API Services
- ✅ ApiService class with all HTTP methods
- ✅ Strapi response mapping utilities
- ✅ Error handling and edge cases

### Integration Tests
- ✅ Products API endpoints
- ✅ Categories and Suppliers APIs
- ✅ Search and filtering functionality
- ✅ Pagination and sorting

### Utilities
- ✅ Currency formatting
- ✅ Image URL generation
- ✅ Search query building
- ✅ Data validation

## Writing Tests

### Component Tests

```typescript
import { render, screen } from '../utils/test-utils'
import MyComponent from '../../catalog-next/src/components/MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

### API Tests

```typescript
import { mockFetchSuccess, createMockApiResponse } from '../utils/test-utils'

describe('API Integration', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('fetches data correctly', async () => {
    const mockData = [{ id: 1, name: 'Test' }]
    mockFetchSuccess(createMockApiResponse(mockData, true))
    
    // Your test logic here
  })
})
```

## Best Practices

1. **Use Test Utilities**: Always import from `../utils/test-utils` for consistent setup
2. **Mock External Dependencies**: Use the provided mocks for consistent behavior
3. **Test User Interactions**: Focus on testing behavior from the user's perspective
4. **Async Testing**: Use `waitFor` for async operations and API calls
5. **Accessibility**: Test for proper ARIA attributes and semantic HTML
6. **Error Handling**: Test both success and error scenarios

## Continuous Integration

The test suite is configured for CI environments with:

- Coverage reporting in multiple formats (text, lcov, html)
- JUnit XML output for CI integration
- Optimized for headless environments
- Parallel test execution support

## Troubleshooting

### Common Issues

1. **Module Resolution**: Ensure path aliases match the main application
2. **Async Tests**: Use `waitFor` for components that fetch data
3. **Bootstrap Components**: Use the provided mocks to avoid rendering issues
4. **Environment Variables**: Set `NEXT_PUBLIC_API_BASE` in test setup

### Debug Mode

```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test file
npm test -- Logo.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="renders correctly"
```

## Contributing

When adding new tests:

1. Follow the existing file structure and naming conventions
2. Use the provided test utilities and mocks
3. Ensure tests are isolated and don't depend on external services
4. Add appropriate documentation for complex test scenarios
5. Update this README if adding new test categories or utilities

## Dependencies

### Testing Framework
- Jest 29.7.0
- @testing-library/react 14.1.2
- @testing-library/jest-dom 6.1.4
- @testing-library/user-event 14.5.1

### Mocking
- jest-fetch-mock 3.0.3
- jest-environment-jsdom 29.7.0

### Next.js Integration
- Automatic Next.js component mocking
- Built-in support for Next.js routing and navigation
- CSS and static asset mocking
