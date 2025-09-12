// Mock Strapi instance for testing
const express = require('express');

// Global data stores that persist across tests
let globalProducts = [];
let globalCategories = [];
let globalSuppliers = [];

const mockStrapi = {
  server: {
    httpServer: null
  },
  entityService: {
    create: (uid, { data }) => {
      // Validation for products
      if (uid === 'api::product.product') {
        if (!data.name || !data.price || !data.sku) {
          return Promise.reject(new Error('Missing required fields: name, price, or sku'));
        }
        
        // Check for duplicate SKU
        if (globalProducts.some(p => p.sku === data.sku)) {
          return Promise.reject(new Error('SKU must be unique'));
        }
        
        const id = globalProducts.length + 1;
        const item = { id, ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        globalProducts.push(item);
        return Promise.resolve(item);
      } else if (uid === 'api::category.category') {
        const id = globalCategories.length + 1;
        const item = { id, ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        globalCategories.push(item);
        return Promise.resolve(item);
      } else if (uid === 'api::supplier.supplier') {
        const id = globalSuppliers.length + 1;
        const item = { id, ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        globalSuppliers.push(item);
        return Promise.resolve(item);
      }
      return Promise.resolve(null);
    },
    findOne: (uid, id, options = {}) => {
      let item = null;
      if (uid === 'api::product.product') {
        item = globalProducts.find(p => p.id === id);
      } else if (uid === 'api::category.category') {
        item = globalCategories.find(c => c.id === id);
      } else if (uid === 'api::supplier.supplier') {
        item = globalSuppliers.find(s => s.id === id);
      }
      
      // Handle populate for relationships
      if (item && options.populate) {
        const populated = { ...item };
        if (options.populate.includes('category') && item.category) {
          populated.category = globalCategories.find(c => c.id === item.category);
        }
        if (options.populate.includes('categories') && item.categories) {
          populated.categories = item.categories.map(catId => 
            globalCategories.find(c => c.id === catId)
          ).filter(Boolean);
        }
        return Promise.resolve(populated);
      }
      
      return Promise.resolve(item || null);
    },
    findMany: (uid, options = {}) => {
      let results = [];
      if (uid === 'api::product.product') {
        results = [...globalProducts];
      } else if (uid === 'api::category.category') {
        results = [...globalCategories];
      } else if (uid === 'api::supplier.supplier') {
        results = [...globalSuppliers];
      }
      
      // Apply filters
      if (options.filters) {
        const filters = options.filters;
        if (filters.price) {
          if (filters.price.$gte !== undefined) {
            results = results.filter(item => item.price >= filters.price.$gte);
          }
          if (filters.price.$lte !== undefined) {
            results = results.filter(item => item.price <= filters.price.$lte);
          }
        }
        if (filters.name && filters.name.$contains) {
          results = results.filter(item => 
            item.name.toLowerCase().includes(filters.name.$contains.toLowerCase())
          );
        }
      }
      
      // Apply sorting
      if (options.sort) {
        const sortKey = Object.keys(options.sort)[0];
        const sortOrder = options.sort[sortKey];
        results.sort((a, b) => {
          if (sortOrder === 'asc') {
            return a[sortKey] - b[sortKey];
          } else {
            return b[sortKey] - a[sortKey];
          }
        });
      }
      
      return Promise.resolve(results);
    },
    update: (uid, id, { data }) => {
      if (uid === 'api::product.product') {
        const index = globalProducts.findIndex(p => p.id === id);
        if (index !== -1) {
          globalProducts[index] = { ...globalProducts[index], ...data, updatedAt: new Date().toISOString() };
          return Promise.resolve(globalProducts[index]);
        }
      } else if (uid === 'api::category.category') {
        const index = globalCategories.findIndex(c => c.id === id);
        if (index !== -1) {
          globalCategories[index] = { ...globalCategories[index], ...data, updatedAt: new Date().toISOString() };
          return Promise.resolve(globalCategories[index]);
        }
      } else if (uid === 'api::supplier.supplier') {
        const index = globalSuppliers.findIndex(s => s.id === id);
        if (index !== -1) {
          globalSuppliers[index] = { ...globalSuppliers[index], ...data, updatedAt: new Date().toISOString() };
          return Promise.resolve(globalSuppliers[index]);
        }
      }
      return Promise.resolve(null);
    },
    delete: (uid, id) => {
      if (uid === 'api::product.product') {
        const index = globalProducts.findIndex(p => p.id === id);
        if (index !== -1) {
          const deleted = globalProducts.splice(index, 1)[0];
          return Promise.resolve(deleted);
        }
      } else if (uid === 'api::category.category') {
        const index = globalCategories.findIndex(c => c.id === id);
        if (index !== -1) {
          const deleted = globalCategories.splice(index, 1)[0];
          return Promise.resolve(deleted);
        }
      } else if (uid === 'api::supplier.supplier') {
        const index = globalSuppliers.findIndex(s => s.id === id);
        if (index !== -1) {
          const deleted = globalSuppliers.splice(index, 1)[0];
          return Promise.resolve(deleted);
        }
      }
      return Promise.resolve(null);
    }
  },
  // Admin services removed - focusing on API testing only
  // Authentication plugins removed - focusing on API testing only
  load: () => {
    // Create a mock Express server for testing
    const app = express();
    app.use(express.json());
    
    // Mock API routes for products
    app.get('/api/products', (req, res) => {
      const page = parseInt(req.query['pagination[page]']) || 1;
      const pageSize = parseInt(req.query['pagination[pageSize]']) || 25;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      
      const paginatedProducts = globalProducts.slice(start, end);
      res.json({ 
        data: paginatedProducts.map(p => ({ id: p.id, attributes: p })), 
        meta: { pagination: { page, pageSize, total: globalProducts.length } } 
      });
    });
    
    app.get('/api/products/:id', (req, res) => {
      const product = globalProducts.find(p => p.id === parseInt(req.params.id));
      if (product) {
        res.json({ data: { id: product.id, attributes: product } });
      } else {
        res.status(404).json({ error: { status: 404, name: 'NotFoundError', message: 'Not Found' } });
      }
    });
    
    app.post('/api/products', (req, res) => {
      // Skip authorization check for testing
      const newProduct = {
        id: globalProducts.length + 1,
        ...req.body.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      globalProducts.push(newProduct);
      res.json({ data: { id: newProduct.id, attributes: newProduct } });
    });
    
    app.put('/api/products/:id', (req, res) => {
      const index = globalProducts.findIndex(p => p.id === parseInt(req.params.id));
      if (index !== -1) {
        globalProducts[index] = { ...globalProducts[index], ...req.body.data, updatedAt: new Date().toISOString() };
        res.json({ data: { id: globalProducts[index].id, attributes: globalProducts[index] } });
      } else {
        res.status(404).json({ error: { status: 404, name: 'NotFoundError', message: 'Not Found' } });
      }
    });
    
    app.delete('/api/products/:id', (req, res) => {
      const index = globalProducts.findIndex(p => p.id === parseInt(req.params.id));
      if (index !== -1) {
        const deleted = globalProducts.splice(index, 1)[0];
        res.json({ data: { id: deleted.id, attributes: deleted } });
      } else {
        res.status(404).json({ error: { status: 404, name: 'NotFoundError', message: 'Not Found' } });
      }
    });
    
    // Mock API routes for categories
    app.get('/api/categories', (req, res) => {
      let filteredCategories = [...globalCategories];
      
      // Handle filtering - parse query string properly
      const queryString = req.url.split('?')[1];
      if (queryString) {
        const params = new URLSearchParams(queryString);
        const filterParam = params.get('filters[name][$contains]');
        if (filterParam) {
          filteredCategories = filteredCategories.filter(c => 
            c.name.toLowerCase().includes(filterParam.toLowerCase())
          );
        }
      }
      
      res.json({ 
        data: filteredCategories.map(c => ({ id: c.id, attributes: c })), 
        meta: { pagination: { total: filteredCategories.length } } 
      });
    });
    
    app.post('/api/categories', (req, res) => {
      // Check for authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: { status: 401, name: 'UnauthorizedError', message: 'Missing or invalid credentials' } });
      }
      
      const newCategory = {
        id: globalCategories.length + 1,
        ...req.body.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      globalCategories.push(newCategory);
      res.json({ data: { id: newCategory.id, attributes: newCategory } });
    });
    
    // Mock API routes for suppliers
    app.get('/api/suppliers', (req, res) => {
      res.json({ 
        data: globalSuppliers.map(s => ({ id: s.id, attributes: s })), 
        meta: { pagination: { total: globalSuppliers.length } } 
      });
    });
    
    app.post('/api/suppliers', (req, res) => {
      // Check for authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: { status: 401, name: 'UnauthorizedError', message: 'Missing or invalid credentials' } });
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (req.body.data.contactEmail && !emailRegex.test(req.body.data.contactEmail)) {
        return res.status(400).json({ error: { status: 400, name: 'ValidationError', message: 'Invalid email format' } });
      }
      
      const newSupplier = {
        id: globalSuppliers.length + 1,
        ...req.body.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      globalSuppliers.push(newSupplier);
      res.json({ data: { id: newSupplier.id, attributes: newSupplier } });
    });
    
    // Authentication endpoints removed - focusing on API testing only
    
    mockStrapi.server.httpServer = app;
    return Promise.resolve(mockStrapi);
  },
  destroy: () => Promise.resolve(),
  clearTestData: () => {
    globalProducts.length = 0;
    globalCategories.length = 0;
    globalSuppliers.length = 0;
  },
  // Add direct access to global data for debugging
  getGlobalData: () => ({
    products: globalProducts,
    categories: globalCategories,
    suppliers: globalSuppliers
  })
};

module.exports = mockStrapi;
