# B2B Catalog Solution

A comprehensive B2B e-commerce platform built with modern web technologies, featuring a Next.js frontend and Strapi CMS backend for efficient product catalog management and business procurement needs.

## 🚀 Solution Overview

The B2B Catalog Solution is a full-stack web application designed to streamline business-to-business product procurement. It provides an intuitive interface for browsing products, managing inventory, and analyzing business metrics with real-time data synchronization between frontend and backend systems.

### Key Features

- **🛍️ Product Catalog Management**: Comprehensive product browsing with advanced filtering and search capabilities
- **📊 Analytics Dashboard**: Real-time insights into product performance, inventory levels, and business metrics
- **🏷️ Category & Supplier Management**: Organized product categorization and supplier relationship management
- **📱 Responsive Design**: Mobile-first approach with Bootstrap integration for optimal user experience
- **🔍 Advanced Search & Filtering**: Multi-criteria filtering by category, supplier, price range, and product attributes
- **⭐ Product Rating System**: Customer feedback and rating system for informed purchasing decisions
- **📈 Inventory Tracking**: Real-time stock monitoring with low-stock alerts and out-of-stock notifications
- **🖼️ Image Gallery**: Multi-image product galleries with carousel functionality
- **🎯 Trending Products**: Most viewed and popular product recommendations

## 📁 Project Structure

```
B2BCatalog/
├── catalog-next/          # Next.js Frontend Application
├── strapi-b2b/           # Strapi CMS Backend
├── catalog-next-tests/   # Frontend Test Suite
├── strapi-b2b-tests/    # Backend Test Suite
├── README.md            # Project documentation
├── LICENSE              # MIT License
└── COVERAGE_REPORT.md   # Test coverage analysis
```

---

## 🎨 Frontend Application (catalog-next)

### Technology Stack
- **Framework**: Next.js 15.5.3 with React 19.1.1
- **UI Library**: React Bootstrap 2.10.10 with Bootstrap 5.3.8
- **Styling**: CSS Modules with Bootstrap integration
- **Icons**: React Icons 5.5.0
- **Image Carousel**: React Slick 0.31.0
- **HTTP Client**: Axios 1.12.0
- **Language**: TypeScript 5.4.5

### Core Features

#### 🏠 Homepage
- Hero section with call-to-action buttons
- Quick statistics cards showcasing platform capabilities
- Most viewed products section with grid layout
- Responsive design with modern UI components

#### 🛍️ Product Catalog (`/products`)
- **Advanced Filtering System**:
  - Search by product name, SKU, or description
  - Filter by category and supplier
  - Price range slider filtering
  - Real-time filter application
- **Product Display**:
  - Grid layout with responsive cards
  - Multi-image carousel for each product
  - Product ratings with star display
  - Stock status indicators (In Stock, Low Stock, Out of Stock)
  - Price formatting with currency display
- **Sorting Options**:
  - Name (A-Z, Z-A)
  - Price (Low to High, High to Low)
  - Rating (Highest Rated)

#### 📊 Analytics Dashboard (`/analytics`)
- **Key Performance Metrics**:
  - Total products count
  - Total inventory value
  - Total product views
  - Low stock alerts
- **Product Performance Table**:
  - Top performing products by views, price, stock, or rating
  - Real-time stock status indicators
  - Direct product navigation links
- **Category Breakdown**:
  - Products count per category
  - Total value per category
  - View statistics per category
- **Quick Statistics**:
  - Average product price
  - Average product rating
  - Out of stock and low stock counts

#### 🏷️ Categories Page (`/categories`)
- Grid display of all product categories
- Category descriptions and metadata
- Responsive card layout with Bootstrap components

#### 🏢 Suppliers Page (`/suppliers`)
- List of all registered suppliers
- Supplier contact information
- Direct navigation to supplier-specific products

#### 🧩 Reusable Components
- **Navigation**: Bootstrap navbar with responsive design and user account dropdown
- **Logo**: Branded logo component with consistent styling
- **MostViewedProducts**: Configurable product showcase component
- **ProductImageSlider**: Carousel component for product image galleries
- **ThemeInitializer**: Bootstrap theme configuration

### API Integration
- RESTful API communication with Strapi backend
- Environment-based API configuration (`NEXT_PUBLIC_API_BASE`)
- Error handling and loading states
- Real-time data synchronization

### Development Features
- **Development Server**: Runs on port 3001 (`npm run dev`)
- **Production Build**: Optimized build process (`npm run build`)
- **TypeScript Support**: Full type safety with custom type definitions
- **Client-Side Rendering**: Optimized for SEO and performance

---

## ⚙️ Backend API (strapi-b2b)

### Technology Stack
- **Framework**: Strapi 5.11.1 (Headless CMS)
- **Database**: SQLite 3 with Better-SQLite3 9.4.5
- **Runtime**: Node.js >=18.0.0
- **Package Manager**: npm >=8.0.0
- **Authentication**: Strapi Users & Permissions Plugin 5.23.4
- **UI Framework**: React 18.3.1 with React Router DOM 6.30.1
- **Styling**: Styled Components 6.1.19

### API Endpoints

#### Products API (`/api/products`)
- **GET /api/products**: Retrieve all products with pagination and population
- **GET /api/products/:id**: Get single product with full relations (images, category, supplier)
- **Populate Support**: Automatic population of related entities (images, categories, suppliers)
- **Custom Controller**: Enhanced product controller with sanitized responses

#### Categories API (`/api/categories`)
- **GET /api/categories**: Retrieve all product categories
- **Standard CRUD Operations**: Create, read, update, delete categories
- **Relationship Management**: Linked to products for organization

#### Suppliers API (`/api/suppliers`)
- **GET /api/suppliers**: Retrieve all suppliers with contact information
- **Standard CRUD Operations**: Full supplier management capabilities
- **Business Information**: Name, email, phone, address fields

### Data Models

#### Product Model
```typescript
{
  id: number
  name: string
  sku: string
  description: string
  price: number
  stock: number
  rating: number
  featured: boolean
  images: Image[]
  category: Category
  supplier: Supplier
  createdAt: string
  updatedAt: string
  publishedAt: string
}
```

#### Category Model
```typescript
{
  id: number
  name: string
  slug: string
  description: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}
```

#### Supplier Model
```typescript
{
  id: number
  name: string
  email: string
  phone: string
  address: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}
```

### Database Configuration
- **Database Type**: SQLite for development and testing
- **File Location**: `database/data.db`
- **ORM**: Strapi's built-in entity service
- **Migrations**: Automatic schema management

### Content Management
- **Admin Panel**: Full-featured admin interface for content management
- **Media Library**: Image upload and management system
- **User Permissions**: Role-based access control
- **API Documentation**: Auto-generated API documentation

### Development Features
- **Development Mode**: `npm run develop` with hot reload
- **Production Mode**: `npm run start` for production deployment
- **Build Process**: `npm run build` for optimized builds

### 📊 Logging & Error Handling

#### Backend Logging System
- **Custom Logger Utility** (`src/utils/logger.js`):
  - Structured logging with multiple levels (ERROR, WARN, INFO, DEBUG)
  - Configurable log levels via `LOG_LEVEL` environment variable
  - Color-coded console output for better readability
  - File-based logging for ERROR and WARN levels in `/logs` directory
  - Timestamped log entries with contextual information

- **Specialized Logging Methods**:
  - `logDatabaseOperation()` - Database operation tracking
  - `logDatabaseError()` - Database error logging with stack traces
  - `logApiRequest()` - API request logging with user context
  - `logApiError()` - API error logging with full request context
  - `logStartup()` - Application lifecycle logging

#### Backend Error Handling
- **Global Error Middleware** (`src/middlewares/error-handler.js`):
  - Catches and processes all unhandled errors
  - Maps error types to appropriate HTTP status codes
  - Provides structured error responses with consistent format
  - Logs critical errors (5xx) to files for monitoring
  - Environment-aware error details (development vs production)

- **Database Service Wrapper** (`src/services/database-service.js`):
  - Wraps Strapi's entityService with comprehensive error handling
  - Transforms database-specific errors into user-friendly messages
  - Handles connection errors, timeouts, and constraint violations
  - Provides detailed logging for all database operations
  - Supports operations: findMany, findOne, create, update, delete, count

- **Controller-Level Error Handling**:
  - Try-catch blocks in all API controllers (Products, Categories, Suppliers)
  - Contextual error logging with user ID and request parameters
  - Proper error propagation with maintained error context

#### Frontend Error Handling
- **API Integration Error Handling**:
  - Centralized error handling in API service layer (`src/lib/api.ts`)
  - HTTP status code validation with descriptive error messages
  - Promise-based error handling with proper error propagation

- **Component-Level Error Handling**:
  - Try-catch blocks in data fetching operations
  - Loading states and error state management
  - User-friendly error messages with retry functionality
  - Graceful fallbacks for missing data or failed API calls

- **Error Display Components**:
  - Bootstrap Alert components for error messaging
  - Retry buttons for failed operations
  - Loading spinners during async operations
  - Fallback content for missing images or data

#### Error Response Format
```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Validation Error",
    "details": "Specific error details"
  },
  "data": null
}
```

#### Log File Structure
- **Location**: `/logs` directory in backend root
- **File Naming**: `{level}-{date}.log` (e.g., `error-2024-01-15.log`)
- **Log Format**: `[timestamp] [level] message {context}`
- **Retention**: Manual cleanup required (consider log rotation for production)

---

## 🧪 Testing & Quality Assurance

### Comprehensive Test Coverage
The B2B Catalog solution includes extensive test suites with **85%+ code coverage** across both frontend and backend components. See [COVERAGE_REPORT.md](./COVERAGE_REPORT.md) for detailed analysis.

### Frontend Tests (catalog-next-tests)
- **Test Framework**: Jest 29.7.0 with React Testing Library
- **Test Results**: ✅ 15 test suites passed, 148 tests passed (Latest run: January 2025)
- **Coverage**: Comprehensive coverage across all components and pages
- **Test Categories**:
  - **Component Tests**: React component unit tests (Logo, Navigation, ProductImageSlider, etc.)
  - **Page Tests**: Next.js page component tests (Homepage, Products, Categories, Analytics)
  - **API Tests**: Frontend API integration and error handling
  - **Integration Tests**: End-to-end workflow testing
  - **Unit Tests**: Utility functions and helper methods

### Backend Tests (strapi-b2b-tests)
- **Test Framework**: Jest 29.7.0 with Supertest for API testing
- **Test Results**: ✅ 9 test suites passed, 46 tests passed (Latest run: January 2025)
- **Coverage**: Full API endpoint and service layer coverage
- **Test Categories**:
  - **API Tests**: RESTful endpoint testing (Products, Categories, Suppliers)
  - **Model Tests**: Data validation and relationship integrity
  - **Unit Tests**: Service layer and business logic including DatabaseService
  - **Integration Tests**: Database operations and external services
  - **Setup Tests**: Test environment and mock data utilities

### Running Tests

**Frontend Testing:**
```bash
cd catalog-next-tests
npm install
npm run test              # Run all tests
npm run test:coverage     # Generate coverage report
npm run test:watch        # Watch mode for development
npm run test:components   # Component tests only
```

**Backend Testing:**
```bash
cd strapi-b2b-tests
npm install
npm run test              # Run all tests
npm run test:coverage     # Generate coverage report
npm run test:api          # API tests only
npm run test:models       # Model tests only
```

### Test Results Summary
- **Frontend**: 148 tests across 15 test suites - All passing ✅
- **Backend**: 46 tests across 9 test suites - All passing ✅
- **Total Tests**: 194 tests successfully executed
- **CI/CD Ready**: Automated testing with coverage reporting

---

## 🚀 Getting Started

### Prerequisites
- Node.js >=18.0.0
- npm >=8.0.0

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd B2BCatalog
   ```

2. **Setup Backend (Strapi)**
   ```bash
   cd strapi-b2b
   npm install
   npm run develop
   ```
   The Strapi admin panel will be available at `http://localhost:1337/admin`

3. **Setup Frontend (Next.js)**
   ```bash
   cd catalog-next
   npm install
   npm run dev
   ```
   The frontend application will be available at `http://localhost:3001`

### Environment Configuration

Create `.env.local` in the `catalog-next` directory:
```env
NEXT_PUBLIC_API_BASE=http://localhost:1337
```

### Default Ports
- **Frontend**: http://localhost:3001
- **Backend**: http://localhost:1337
- **Admin Panel**: http://localhost:1337/admin

### Testing Setup
After setting up the main applications, you can run the comprehensive test suites:

```bash
# Run frontend tests with coverage
cd catalog-next-tests
npm install
npm run test:coverage

# Run backend tests with coverage  
cd strapi-b2b-tests
npm install
npm run test:coverage
```

View detailed test results and coverage analysis in [COVERAGE_REPORT.md](./COVERAGE_REPORT.md).

---

## 🔧 Development Workflow

1. **Start Backend**: Run Strapi development server
2. **Configure Content Types**: Set up Products, Categories, and Suppliers in Strapi admin
3. **Add Sample Data**: Populate the database with test products and categories
4. **Start Frontend**: Launch Next.js development server
5. **Run Tests**: Execute test suites to ensure code quality
6. **Test Integration**: Verify API communication between frontend and backend
7. **Check Coverage**: Review test coverage reports for quality assurance

---

## 📈 Future Enhancements

- User authentication and authorization
- Shopping cart and checkout functionality
- Order management system
- Advanced analytics and reporting
- Multi-language support
- Payment gateway integration
- Email notifications
- Advanced search with Elasticsearch
- Real-time inventory updates
- Bulk product import/export

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.
