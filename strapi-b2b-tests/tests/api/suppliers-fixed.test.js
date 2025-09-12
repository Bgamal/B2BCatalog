const request = require('supertest');
const { setupStrapi, cleanupStrapi } = require('../setup/strapi-instance');
const { getUserJWT } = require('../helpers/test-utils');

describe('Suppliers API - Fixed', () => {
  let strapi;
  let userToken;

  beforeAll(async () => {
    strapi = await setupStrapi();
    userToken = 'mock-jwt-token'; // Use mock token directly
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

  describe('GET /api/suppliers', () => {
    test('should return empty suppliers list initially', async () => {
      const response = await request(strapi.server.httpServer)
        .get('/api/suppliers')
        .expect(200);

      expect(response.body.data).toHaveLength(0);
      expect(response.body.meta.pagination.total).toBe(0);
    });

    test('should return suppliers after creating them via API', async () => {
      // Create suppliers via API calls
      await request(strapi.server.httpServer)
        .post('/api/suppliers')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ 
          data: { 
            name: 'Supplier A', 
            contactEmail: 'a@test.com' 
          } 
        })
        .expect(200);

      await request(strapi.server.httpServer)
        .post('/api/suppliers')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ 
          data: { 
            name: 'Supplier B', 
            contactEmail: 'b@test.com' 
          } 
        })
        .expect(200);

      const response = await request(strapi.server.httpServer)
        .get('/api/suppliers')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.meta.pagination.total).toBe(2);
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

    test('should handle supplier creation without email', async () => {
      const supplierData = {
        name: 'Supplier Without Email'
      };

      const response = await request(strapi.server.httpServer)
        .post('/api/suppliers')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ data: supplierData })
        .expect(200);

      expect(response.body.data.attributes.name).toBe(supplierData.name);
    });
  });
});
