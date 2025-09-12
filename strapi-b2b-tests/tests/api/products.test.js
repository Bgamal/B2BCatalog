const request = require('supertest');
const { setupStrapi, cleanupStrapi } = require('../setup/strapi-instance');

describe('Products API - Working Tests', () => {
  let strapi;

  beforeAll(async () => {
    strapi = await setupStrapi();
  });

  afterAll(async () => {
    await cleanupStrapi();
  });

  afterEach(async () => {
    // Clear test data after each test
    if (strapi.clearTestData) {
      strapi.clearTestData();
    }
  });

  describe('GET /api/products', () => {
    test('should return empty array when no products exist', async () => {
      const response = await request(strapi.server.httpServer)
        .get('/api/products')
        .expect(200);

      expect(response.body.data).toEqual([]);
      expect(response.body.meta.pagination.total).toBe(0);
    });

    test('should return products after creating them via API', async () => {
      // Create products via HTTP API
      await request(strapi.server.httpServer)
        .post('/api/products')
        .send({ 
          data: { 
            name: 'Product 1', 
            sku: 'PROD-001', 
            price: 99.99, 
            stock: 10,
            minOrderQuantity: 1,
            isActive: true
          } 
        })
        .expect(200);

      await request(strapi.server.httpServer)
        .post('/api/products')
        .send({ 
          data: { 
            name: 'Product 2', 
            sku: 'PROD-002', 
            price: 199.99, 
            stock: 20,
            minOrderQuantity: 1,
            isActive: true
          } 
        })
        .expect(200);

      const response = await request(strapi.server.httpServer)
        .get('/api/products')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.meta.pagination.total).toBe(2);
    });
  });

  describe('POST /api/products', () => {
    test('should create new product with valid data', async () => {
      const productData = {
        name: 'New Product',
        sku: 'NEW-001',
        price: 299.99,
        stock: 50,
        minOrderQuantity: 1,
        isActive: true
      };

      const response = await request(strapi.server.httpServer)
        .post('/api/products')
        .send({ data: productData })
        .expect(200);

      expect(response.body.data.attributes.name).toBe(productData.name);
      expect(response.body.data.attributes.sku).toBe(productData.sku);
      expect(response.body.data.attributes.price).toBe(productData.price);
    });
  });

  describe('GET /api/products/:id', () => {
    test('should return specific product by id', async () => {
      // Create a product first
      const createResponse = await request(strapi.server.httpServer)
        .post('/api/products')
        .send({ 
          data: { 
            name: 'Test Product', 
            sku: 'TEST-001', 
            price: 99.99, 
            stock: 10,
            minOrderQuantity: 1,
            isActive: true
          } 
        })
        .expect(200);

      const productId = createResponse.body.data.id;

      const response = await request(strapi.server.httpServer)
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(response.body.data.attributes.name).toBe('Test Product');
      expect(response.body.data.attributes.sku).toBe('TEST-001');
    });

    test('should return 404 for non-existent product', async () => {
      await request(strapi.server.httpServer)
        .get('/api/products/999')
        .expect(404);
    });
  });
});
