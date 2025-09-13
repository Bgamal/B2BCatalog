/**
 * API Import Script for B2B Catalog Sample Data
 * This script uses HTTP requests to populate the Strapi database via REST API
 * 
 * Usage:
 * 1. Ensure Strapi server is running on http://localhost:1337
 * 2. Run: node import-api-calls.js
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:1337/api';

// Load sample data
const categoriesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'categories.json'), 'utf8'));
const suppliersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'suppliers.json'), 'utf8'));
const productsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'sample-products.json'), 'utf8'));

async function importData() {
  console.log('🚀 Starting API data import...');

  try {
    // Import Categories
    console.log('📁 Importing categories...');
    const categoryMap = {};
    
    for (const category of categoriesData) {
      try {
        const response = await axios.post(`${API_BASE}/categories`, {
          data: category
        });
        categoryMap[category.name] = response.data.data.id;
        console.log(`✅ Imported category: ${category.name}`);
      } catch (error) {
        console.log(`⚠️ Category ${category.name} may already exist or error occurred`);
      }
    }

    // Import Suppliers
    console.log('🏢 Importing suppliers...');
    const supplierMap = {};
    
    for (const supplier of suppliersData) {
      try {
        const response = await axios.post(`${API_BASE}/suppliers`, {
          data: supplier
        });
        supplierMap[supplier.name] = response.data.data.id;
        console.log(`✅ Imported supplier: ${supplier.name}`);
      } catch (error) {
        console.log(`⚠️ Supplier ${supplier.name} may already exist or error occurred`);
      }
    }

    // Import Products
    console.log('📦 Importing products...');
    
    for (const product of productsData) {
      try {
        const categoryId = categoryMap[product.category];
        const supplierId = supplierMap[product.supplier];

        if (!categoryId || !supplierId) {
          console.log(`⚠️ Skipping ${product.name} - missing category or supplier mapping`);
          continue;
        }

        const productData = {
          name: product.name,
          sku: product.sku,
          description: product.description,
          price: product.price,
          stock: product.stock,
          rating: product.rating,
          featured: product.featured,
          category: categoryId,
          supplier: supplierId
        };

        const response = await axios.post(`${API_BASE}/products`, {
          data: productData
        });
        console.log(`✅ Imported product: ${product.name}`);
      } catch (error) {
        console.log(`⚠️ Product ${product.name} import failed:`, error.response?.data?.error?.message || error.message);
      }
    }

    console.log('🎉 API data import completed!');
    console.log(`📊 Import Summary:`);
    console.log(`   - Categories: ${categoriesData.length} items`);
    console.log(`   - Suppliers: ${suppliersData.length} items`);
    console.log(`   - Products: ${productsData.length} items`);

  } catch (error) {
    console.error('❌ Import failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure Strapi server is running on http://localhost:1337');
    }
  }
}

// Run the import
importData();
