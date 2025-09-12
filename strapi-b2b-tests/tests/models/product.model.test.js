const { setupStrapi, cleanupStrapi } = require('../setup/strapi-instance');
const { createTestProduct, createTestCategory, cleanupTestData } = require('../helpers/test-utils');

describe('Product Model', () => {
  let strapi;

  beforeAll(async () => {
    strapi = await setupStrapi();
  });

  afterAll(async () => {
    await cleanupStrapi();
  });

  afterEach(async () => {
    await cleanupTestData(strapi);
  });

  describe('Product Creation', () => {
    test('should create product with valid data', async () => {
      const productData = {
        name: 'Test Product',
        description: 'Test description',
        price: 99.99,
        sku: 'TEST-001'
      };

      const product = await strapi.entityService.create('api::product.product', {
        data: productData
      });

      expect(product.name).toBe(productData.name);
      expect(product.price).toBe(productData.price);
      expect(product.sku).toBe(productData.sku);
      expect(product.id).toBeDefined();
    });

    test('should validate required fields', async () => {
      const invalidData = {
        description: 'Missing name and price'
      };

      await expect(
        strapi.entityService.create('api::product.product', {
          data: invalidData
        })
      ).rejects.toThrow();
    });

    test('should enforce unique SKU constraint', async () => {
      const productData = {
        name: 'Product 1',
        price: 99.99,
        sku: 'UNIQUE-001'
      };

      await strapi.entityService.create('api::product.product', {
        data: productData
      });

      // Try to create another product with same SKU
      const duplicateData = {
        name: 'Product 2',
        price: 199.99,
        sku: 'UNIQUE-001'
      };

      await expect(
        strapi.entityService.create('api::product.product', {
          data: duplicateData
        })
      ).rejects.toThrow();
    });
  });

  describe('Product Relationships', () => {
    test('should associate product with category', async () => {
      const category = await createTestCategory(strapi, { name: 'Electronics' });
      
      const product = await strapi.entityService.create('api::product.product', {
        data: {
          name: 'Laptop',
          price: 999.99,
          sku: 'LAP-001',
          category: category.id
        }
      });

      const productWithCategory = await strapi.entityService.findOne('api::product.product', product.id, {
        populate: ['category']
      });

      expect(productWithCategory.category.id).toBe(category.id);
      expect(productWithCategory.category.name).toBe('Electronics');
    });

    test('should handle multiple categories', async () => {
      const category1 = await createTestCategory(strapi, { name: 'Electronics' });
      const category2 = await createTestCategory(strapi, { name: 'Computers' });
      
      const product = await strapi.entityService.create('api::product.product', {
        data: {
          name: 'Gaming Laptop',
          price: 1299.99,
          sku: 'GAME-001',
          categories: [category1.id, category2.id]
        }
      });

      const productWithCategories = await strapi.entityService.findOne('api::product.product', product.id, {
        populate: ['categories']
      });

      expect(productWithCategories.categories).toHaveLength(2);
    });
  });

  describe('Product Queries', () => {
    test('should find products by price range', async () => {
      await createTestProduct(strapi, { name: 'Cheap Product', price: 50, sku: 'CHEAP-001' });
      await createTestProduct(strapi, { name: 'Mid Product', price: 150, sku: 'MID-001' });
      await createTestProduct(strapi, { name: 'Expensive Product', price: 500, sku: 'EXP-001' });

      const products = await strapi.entityService.findMany('api::product.product', {
        filters: {
          price: {
            $gte: 100,
            $lte: 300
          }
        }
      });

      expect(products).toHaveLength(1);
      expect(products[0].name).toBe('Mid Product');
    });

    test('should search products by name', async () => {
      await createTestProduct(strapi, { name: 'Apple iPhone', sku: 'IPHONE-001' });
      await createTestProduct(strapi, { name: 'Apple MacBook', sku: 'MACBOOK-001' });
      await createTestProduct(strapi, { name: 'Samsung Galaxy', sku: 'GALAXY-001' });

      const products = await strapi.entityService.findMany('api::product.product', {
        filters: {
          name: {
            $contains: 'Apple'
          }
        }
      });

      expect(products).toHaveLength(2);
      expect(products.every(p => p.name.includes('Apple'))).toBe(true);
    });

    test('should sort products by price', async () => {
      await createTestProduct(strapi, { name: 'Product C', price: 300, sku: 'PROD-C-001' });
      await createTestProduct(strapi, { name: 'Product A', price: 100, sku: 'PROD-A-001' });
      await createTestProduct(strapi, { name: 'Product B', price: 200, sku: 'PROD-B-001' });

      const products = await strapi.entityService.findMany('api::product.product', {
        sort: { price: 'asc' }
      });

      expect(products[0].price).toBe(100);
      expect(products[1].price).toBe(200);
      expect(products[2].price).toBe(300);
    });
  });

  describe('Product Updates', () => {
    test('should update product fields', async () => {
      const product = await createTestProduct(strapi, {
        name: 'Original Name',
        price: 100
      });

      const updatedProduct = await strapi.entityService.update('api::product.product', product.id, {
        data: {
          name: 'Updated Name',
          price: 150
        }
      });

      expect(updatedProduct.name).toBe('Updated Name');
      expect(updatedProduct.price).toBe(150);
    });

    test('should maintain data integrity on partial updates', async () => {
      const product = await createTestProduct(strapi, {
        name: 'Test Product',
        description: 'Original description',
        price: 100,
        sku: 'TEST-001'
      });

      const updatedProduct = await strapi.entityService.update('api::product.product', product.id, {
        data: {
          price: 150
        }
      });

      expect(updatedProduct.name).toBe('Test Product');
      expect(updatedProduct.description).toBe('Original description');
      expect(updatedProduct.price).toBe(150);
      expect(updatedProduct.sku).toBe('TEST-001');
    });
  });
});
