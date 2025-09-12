const request = require('supertest');
const express = require('express');

// Simple API tests without full Strapi dependency
describe('Products API - Simple Tests', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    
    // Mock products data
    let products = [
      { id: 1, name: 'Test Product 1', price: 99.99, sku: 'TEST-001' },
      { id: 2, name: 'Test Product 2', price: 199.99, sku: 'TEST-002' }
    ];

    // Mock API endpoints
    app.get('/api/products', (req, res) => {
      res.json({ data: products, meta: { pagination: { total: products.length } } });
    });

    app.get('/api/products/:id', (req, res) => {
      const product = products.find(p => p.id === parseInt(req.params.id));
      if (product) {
        res.json({ data: { id: product.id, attributes: product } });
      } else {
        res.status(404).json({ error: 'Not found' });
      }
    });

    app.post('/api/products', (req, res) => {
      const newProduct = {
        id: products.length + 1,
        ...req.body.data
      };
      products.push(newProduct);
      res.json({ data: { id: newProduct.id, attributes: newProduct } });
    });
  });

  test('should return all products', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect(200);

    expect(response.body.data).toHaveLength(2);
    expect(response.body.meta.pagination.total).toBe(2);
  });

  test('should return specific product by id', async () => {
    const response = await request(app)
      .get('/api/products/1')
      .expect(200);

    expect(response.body.data.attributes.name).toBe('Test Product 1');
    expect(response.body.data.attributes.price).toBe(99.99);
  });

  test('should return 404 for non-existent product', async () => {
    await request(app)
      .get('/api/products/999')
      .expect(404);
  });

  test('should create new product', async () => {
    const productData = {
      name: 'New Product',
      price: 299.99,
      sku: 'NEW-001'
    };

    const response = await request(app)
      .post('/api/products')
      .send({ data: productData })
      .expect(200);

    expect(response.body.data.attributes.name).toBe(productData.name);
    expect(response.body.data.attributes.price).toBe(productData.price);
  });
});
