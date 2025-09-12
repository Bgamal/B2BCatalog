const request = require('supertest');

/**
 * Test utilities for Strapi B2B testing
 */

// Admin functions removed - focusing on API testing only

// Authentication functions removed - focusing on API testing only

// Helper to create test data
async function createTestProduct(strapi, data = {}) {
  const defaultData = {
    name: 'Test Product',
    description: 'Test product description',
    price: 99.99,
    sku: `TEST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generate unique SKU
    stock: 100,
    minOrderQuantity: 1,
    isActive: true
  };

  return await strapi.entityService.create('api::product.product', {
    data: { ...defaultData, ...data }
  });
}

async function createTestCategory(strapi, data = {}) {
  const defaultData = {
    name: 'Test Category',
    slug: 'test-category'
  };

  return await strapi.entityService.create('api::category.category', {
    data: { ...defaultData, ...data }
  });
}

async function createTestSupplier(strapi, data = {}) {
  const defaultData = {
    name: 'Test Supplier',
    contactEmail: 'supplier@test.com'
  };

  return await strapi.entityService.create('api::supplier.supplier', {
    data: { ...defaultData, ...data }
  });
}

// Helper to clean test data
async function cleanupTestData(strapi) {
  try {
    // Always use clearTestData if available for better performance
    if (strapi.clearTestData) {
      strapi.clearTestData();
      return;
    }
    
    // Fallback to individual cleanup
    const products = await strapi.entityService.findMany('api::product.product');
    if (products && products.length > 0) {
      for (const product of products) {
        await strapi.entityService.delete('api::product.product', product.id);
      }
    }

    const categories = await strapi.entityService.findMany('api::category.category');
    if (categories && categories.length > 0) {
      for (const category of categories) {
        await strapi.entityService.delete('api::category.category', category.id);
      }
    }

    const suppliers = await strapi.entityService.findMany('api::supplier.supplier');
    if (suppliers && suppliers.length > 0) {
      for (const supplier of suppliers) {
        await strapi.entityService.delete('api::supplier.supplier', supplier.id);
      }
    }
  } catch (error) {
    console.warn('Error during cleanup:', error.message);
    // Don't throw error during cleanup to avoid breaking tests
  }
}

module.exports = {
  createTestProduct,
  createTestCategory,
  createTestSupplier,
  cleanupTestData
};
