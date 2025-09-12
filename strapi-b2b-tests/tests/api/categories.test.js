const request = require('supertest');
const { setupStrapi, cleanupStrapi } = require('../setup/strapi-instance');
const { createTestCategory, cleanupTestData } = require('../helpers/test-utils');

describe('Categories API', () => {
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

  describe('GET /api/categories', () => {
    test('should return all categories', async () => {
      await createTestCategory(strapi, { name: 'Electronics' });
      await createTestCategory(strapi, { name: 'Furniture' });

      const response = await request(strapi.server.httpServer)
        .get('/api/categories')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.meta.pagination.total).toBe(2);
    });

    test('should support filtering', async () => {
      await createTestCategory(strapi, { name: 'Office Electronics' });
      await createTestCategory(strapi, { name: 'Home Electronics' });
      await createTestCategory(strapi, { name: 'Furniture' });

      const response = await request(strapi.server.httpServer)
        .get('/api/categories?filters[name][$contains]=Electronics')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
    });
  });

  describe('POST /api/categories', () => {
    test('should create new category', async () => {
      const categoryData = {
        name: 'New Category',
        description: 'Category description'
      };

      const response = await request(strapi.server.httpServer)
        .post('/api/categories')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ data: categoryData })
        .expect(200);

      expect(response.body.data.attributes.name).toBe(categoryData.name);
    });

    test('should require authentication', async () => {
      await request(strapi.server.httpServer)
        .post('/api/categories')
        .send({ data: { name: 'Test' } })
        .expect(401);
    });
  });
});
