#!/usr/bin/env node

/**
 * Data Import Utility for Strapi B2B Catalog
 * 
 * This script imports sample data from JSON files into the Strapi database.
 * Run this script after starting Strapi to populate the database with sample data.
 * 
 * Usage:
 *   node import-data.js [--clear] [--categories] [--suppliers] [--products]
 * 
 * Options:
 *   --clear      Clear existing data before import
 *   --categories Import categories only
 *   --suppliers  Import suppliers only
 *   --products   Import products only
 *   (no options) Import all data types
 */

const fs = require('fs');
const path = require('path');

// Configuration
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN || null;

// Parse command line arguments
const args = process.argv.slice(2);
const shouldClear = args.includes('--clear');
const importCategories = args.includes('--categories') || args.length === 0 || (args.length === 1 && shouldClear);
const importSuppliers = args.includes('--suppliers') || args.length === 0 || (args.length === 1 && shouldClear);
const importProducts = args.includes('--products') || args.length === 0 || (args.length === 1 && shouldClear);

// Helper function to make API requests
async function apiRequest(endpoint, method = 'GET', data = null) {
  const url = `${STRAPI_URL}/api${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (API_TOKEN) {
    options.headers['Authorization'] = `Bearer ${API_TOKEN}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`API request failed: ${method} ${url}`);
    console.error('Error:', error.message);
    throw error;
  }
}

// Helper function to load JSON data
function loadJsonData(filename) {
  try {
    const filePath = path.join(__dirname, filename);
    const rawData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Failed to load ${filename}:`, error.message);
    return null;
  }
}

// Helper function to clear existing data
async function clearData(endpoint, entityName) {
  try {
    console.log(`🗑️  Clearing existing ${entityName}...`);
    const response = await apiRequest(endpoint);
    
    if (response.data && response.data.length > 0) {
      for (const item of response.data) {
        await apiRequest(`${endpoint}/${item.id}`, 'DELETE');
      }
      console.log(`✅ Cleared ${response.data.length} existing ${entityName}`);
    } else {
      console.log(`ℹ️  No existing ${entityName} to clear`);
    }
  } catch (error) {
    console.error(`❌ Failed to clear ${entityName}:`, error.message);
  }
}

// Import categories
async function importCategoriesData() {
  console.log('\n📁 Importing Categories...');
  
  if (shouldClear) {
    await clearData('/categories', 'categories');
  }

  const categories = loadJsonData('categories.json');
  if (!categories) return;

  const imported = [];
  for (const category of categories) {
    try {
      const result = await apiRequest('/categories', 'POST', { data: category });
      imported.push(result.data);
      console.log(`✅ Created category: ${category.name}`);
    } catch (error) {
      console.error(`❌ Failed to create category "${category.name}":`, error.message);
    }
  }

  console.log(`📊 Imported ${imported.length}/${categories.length} categories`);
  return imported;
}

// Import suppliers
async function importSuppliersData() {
  console.log('\n🏢 Importing Suppliers...');
  
  if (shouldClear) {
    await clearData('/suppliers', 'suppliers');
  }

  const suppliers = loadJsonData('suppliers.json');
  if (!suppliers) return;

  const imported = [];
  for (const supplier of suppliers) {
    try {
      const result = await apiRequest('/suppliers', 'POST', { data: supplier });
      imported.push(result.data);
      console.log(`✅ Created supplier: ${supplier.name}`);
    } catch (error) {
      console.error(`❌ Failed to create supplier "${supplier.name}":`, error.message);
    }
  }

  console.log(`📊 Imported ${imported.length}/${suppliers.length} suppliers`);
  return imported;
}

// Import products
async function importProductsData(categories, suppliers) {
  console.log('\n📦 Importing Products...');
  
  if (shouldClear) {
    await clearData('/products', 'products');
  }

  const products = loadJsonData('products.json');
  if (!products) return;

  // Create lookup maps for categories and suppliers
  const categoryMap = new Map();
  const supplierMap = new Map();

  if (categories) {
    categories.forEach(cat => categoryMap.set(cat.name, cat.id));
  }

  if (suppliers) {
    suppliers.forEach(sup => supplierMap.set(sup.name, sup.id));
  }

  // If we don't have categories/suppliers from import, fetch them
  if (categoryMap.size === 0) {
    try {
      const categoriesResponse = await apiRequest('/categories');
      categoriesResponse.data.forEach(cat => categoryMap.set(cat.name, cat.id));
    } catch (error) {
      console.warn('⚠️  Could not fetch existing categories');
    }
  }

  if (supplierMap.size === 0) {
    try {
      const suppliersResponse = await apiRequest('/suppliers');
      suppliersResponse.data.forEach(sup => supplierMap.set(sup.name, sup.id));
    } catch (error) {
      console.warn('⚠️  Could not fetch existing suppliers');
    }
  }

  const imported = [];
  for (const product of products) {
    try {
      // Map category and supplier names to IDs
      const productData = { ...product };
      
      if (product.category && categoryMap.has(product.category)) {
        productData.category = categoryMap.get(product.category);
      } else {
        console.warn(`⚠️  Category "${product.category}" not found for product "${product.name}"`);
        delete productData.category;
      }

      if (product.supplier && supplierMap.has(product.supplier)) {
        productData.supplier = supplierMap.get(product.supplier);
      } else {
        console.warn(`⚠️  Supplier "${product.supplier}" not found for product "${product.name}"`);
        delete productData.supplier;
      }

      const result = await apiRequest('/products', 'POST', { data: productData });
      imported.push(result.data);
      console.log(`✅ Created product: ${product.name}`);
    } catch (error) {
      console.error(`❌ Failed to create product "${product.name}":`, error.message);
    }
  }

  console.log(`📊 Imported ${imported.length}/${products.length} products`);
  return imported;
}

// Main import function
async function main() {
  console.log('🚀 Starting Strapi B2B Sample Data Import');
  console.log(`📡 Strapi URL: ${STRAPI_URL}`);
  console.log(`🔑 API Token: ${API_TOKEN ? 'Provided' : 'Not provided (using public endpoints)'}`);
  
  if (shouldClear) {
    console.log('🗑️  Clear mode enabled');
  }

  console.log(`📋 Import plan: Categories=${importCategories}, Suppliers=${importSuppliers}, Products=${importProducts}`);

  try {
    let categories = null;
    let suppliers = null;

    // Import in order: categories, suppliers, then products
    if (importCategories) {
      categories = await importCategoriesData();
    }

    if (importSuppliers) {
      suppliers = await importSuppliersData();
    }

    if (importProducts) {
      await importProductsData(categories, suppliers);
    }

    console.log('\n🎉 Data import completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Categories: ${importCategories ? 'Imported' : 'Skipped'}`);
    console.log(`   Suppliers: ${importSuppliers ? 'Imported' : 'Skipped'}`);
    console.log(`   Products: ${importProducts ? 'Imported' : 'Skipped'}`);

  } catch (error) {
    console.error('\n❌ Data import failed:', error.message);
    process.exit(1);
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ or you need to install node-fetch');
  console.error('   Install with: npm install node-fetch');
  process.exit(1);
}

// Run the import
if (require.main === module) {
  main();
}

module.exports = {
  importCategoriesData,
  importSuppliersData,
  importProductsData,
  main
};
