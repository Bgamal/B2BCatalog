/**
 * Strapi Bootstrap Script
 * Sets up permissions and seeds sample data
 * 
 * Usage:
 * 1. Place this file in your strapi-b2b/config/functions/bootstrap.js
 * 2. Automatically runs on Strapi startup
 */

const fs = require('fs');
const path = require('path');

// Load sample data
const categoriesData = require('../../../sample-data/categories.json');
const suppliersData = require('../../../sample-data/suppliers.json');
const productsData = require('../../../sample-data/sample-products.json');

async function setPermissions() {
  console.log('🔐 Setting up API permissions...');
  
  try {
    // Get the public role
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' }
    });

    if (!publicRole) {
      console.log('⚠️ Public role not found');
      return;
    }

    // Define permissions for each content type
    const permissions = [
      // Category permissions
      { action: 'api::category.category.find', enabled: true },
      { action: 'api::category.category.findOne', enabled: true },
      
      // Supplier permissions
      { action: 'api::supplier.supplier.find', enabled: true },
      { action: 'api::supplier.supplier.findOne', enabled: true },
      
      // Product permissions
      { action: 'api::product.product.find', enabled: true },
      { action: 'api::product.product.findOne', enabled: true },
    ];

    // Set permissions
    for (const permission of permissions) {
      await strapi.query('plugin::users-permissions.permission').updateMany({
        where: {
          action: permission.action,
          role: publicRole.id
        },
        data: { enabled: permission.enabled }
      });
      console.log(`✅ Set permission: ${permission.action}`);
    }

    console.log('🎉 API permissions configured successfully!');
  } catch (error) {
    console.error('❌ Error setting permissions:', error);
  }
}

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Check if data already exists
    const existingCategories = await strapi.entityService.findMany('api::category.category');
    const existingSuppliers = await strapi.entityService.findMany('api::supplier.supplier');
    const existingProducts = await strapi.entityService.findMany('api::product.product');

    if (existingCategories.length > 0 || existingSuppliers.length > 0 || existingProducts.length > 0) {
      console.log('📊 Sample data already exists. Skipping seeding.');
      return;
    }

    // Seed Categories
    console.log('📁 Seeding categories...');
    const createdCategories = {};
    for (const categoryData of categoriesData) {
      const category = await strapi.entityService.create('api::category.category', {
        data: {
          ...categoryData,
          publishedAt: new Date()
        }
      });
      createdCategories[categoryData.name] = category;
      console.log(`✅ Created category: ${categoryData.name}`);
    }

    // Seed Suppliers
    console.log('🏢 Seeding suppliers...');
    const createdSuppliers = {};
    for (const supplierData of suppliersData) {
      const supplier = await strapi.entityService.create('api::supplier.supplier', {
        data: {
          ...supplierData,
          publishedAt: new Date()
        }
      });
      createdSuppliers[supplierData.name] = supplier;
      console.log(`✅ Created supplier: ${supplierData.name}`);
    }

    // Seed Products
    console.log('📦 Seeding products...');
    for (const productData of productsData) {
      const categoryId = createdCategories[productData.category]?.id;
      const supplierId = createdSuppliers[productData.supplier]?.id;

      if (!categoryId || !supplierId) {
        console.log(`⚠️ Skipping product ${productData.name} - missing category or supplier`);
        continue;
      }

      const product = await strapi.entityService.create('api::product.product', {
        data: {
          name: productData.name,
          sku: productData.sku,
          description: productData.description,
          price: productData.price,
          stock: productData.stock,
          rating: productData.rating,
          featured: productData.featured,
          category: categoryId,
          supplier: supplierId,
          publishedAt: new Date()
        }
      });
      console.log(`✅ Created product: ${productData.name}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Categories: ${categoriesData.length}`);
    console.log(`   - Suppliers: ${suppliersData.length}`);
    console.log(`   - Products: ${productsData.length}`);

  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    throw error;
  }
}

// Export for manual execution
module.exports = {
  seedDatabase,
  categoriesData,
  suppliersData,
  productsData
};

// Bootstrap function for Strapi
module.exports = async () => {
  // Set permissions first
  await setPermissions();
  
  // Then seed data
  await seedDatabase();
};
