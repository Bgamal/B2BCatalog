const request = require('supertest');
const { setupStrapi, cleanupStrapi } = require('../setup/strapi-instance');
const { createTestSupplier, cleanupTestData } = require('../helpers/test-utils');

describe('Suppliers API', () => {
  let strapi;
  let userToken;

  beforeAll(async () => {
    strapi = await setupStrapi();
    userToken = 'mock-jwt-token'; // Use mock token since auth is removed
  });

  afterAll(async () => {
    await cleanupStrapi();
  });

  afterEach(async () => {
    await cleanupTestData(strapi);
  });

  describe('GET /api/suppliers', () => {
    test('should return all suppliers', async () => {
      await createTestSupplier(strapi, { name: 'Supplier A', contactEmail: 'a@test.com' });
      await createTestSupplier(strapi, { name: 'Supplier B', contactEmail: 'b@test.com' });

      const response = await request(strapi.server.httpServer)
        .get('/api/suppliers')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.meta.pagination.total).toBe(2);
    });

    test('should validate email format', async () => {
      const supplierData = {
        name: 'Test Supplier',
        contactEmail: 'invalid-email'
      };

      await request(strapi.server.httpServer)
        .post('/api/suppliers')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ data: supplierData })
        .expect(400);
    });
  });

  describe('POST /api/suppliers', () => {
    test('should create new supplier with valid data', async () => {
      const supplierData = {
        name: 'New Supplier',
        contactEmail: 'new@supplier.com'
      };

      const response = await request(strapi.server.httpServer)
        .post('/api/suppliers')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ data: supplierData })
        .expect(200);

      expect(response.body.data.attributes.name).toBe(supplierData.name);
      expect(response.body.data.attributes.contactEmail).toBe(supplierData.contactEmail);
    });
  });
});
