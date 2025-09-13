const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:1337/api';

async function importSampleData() {
    console.log('🚀 Starting direct sample data import...');
    
    try {
        // Load sample data files
        const categoriesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'categories.json'), 'utf8'));
        const suppliersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'suppliers.json'), 'utf8'));
        const productsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'sample-products.json'), 'utf8'));
        
        console.log(`📊 Loaded: ${categoriesData.length} categories, ${suppliersData.length} suppliers, ${productsData.length} products`);
        
        // Import Categories
        console.log('📁 Importing categories...');
        const categoryMap = {};
        for (const category of categoriesData) {
            try {
                const response = await axios.post(`${API_BASE}/categories`, {
                    data: {
                        ...category,
                        publishedAt: new Date().toISOString()
                    }
                });
                categoryMap[category.name] = response.data.data.id;
                console.log(`✅ Imported category: ${category.name}`);
            } catch (error) {
                if (error.response?.status === 400) {
                    console.log(`⚠️ Category ${category.name} may already exist`);
                    // Try to find existing category
                    try {
                        const existing = await axios.get(`${API_BASE}/categories?filters[name][$eq]=${encodeURIComponent(category.name)}`);
                        if (existing.data.data.length > 0) {
                            categoryMap[category.name] = existing.data.data[0].id;
                        }
                    } catch (findError) {
                        console.log(`❌ Error finding category ${category.name}:`, findError.message);
                    }
                } else {
                    console.log(`❌ Error importing category ${category.name}:`, error.message);
                }
            }
        }
        
        // Import Suppliers
        console.log('🏢 Importing suppliers...');
        const supplierMap = {};
        for (const supplier of suppliersData) {
            try {
                const response = await axios.post(`${API_BASE}/suppliers`, {
                    data: {
                        ...supplier,
                        publishedAt: new Date().toISOString()
                    }
                });
                supplierMap[supplier.name] = response.data.data.id;
                console.log(`✅ Imported supplier: ${supplier.name}`);
            } catch (error) {
                if (error.response?.status === 400) {
                    console.log(`⚠️ Supplier ${supplier.name} may already exist`);
                    // Try to find existing supplier
                    try {
                        const existing = await axios.get(`${API_BASE}/suppliers?filters[name][$eq]=${encodeURIComponent(supplier.name)}`);
                        if (existing.data.data.length > 0) {
                            supplierMap[supplier.name] = existing.data.data[0].id;
                        }
                    } catch (findError) {
                        console.log(`❌ Error finding supplier ${supplier.name}:`, findError.message);
                    }
                } else {
                    console.log(`❌ Error importing supplier ${supplier.name}:`, error.message);
                }
            }
        }
        
        // Import Products
        console.log('📦 Importing products...');
        for (const product of productsData) {
            const categoryId = categoryMap[product.category];
            const supplierId = supplierMap[product.supplier];
            
            if (!categoryId || !supplierId) {
                console.log(`⚠️ Skipping product ${product.name} - missing category (${categoryId}) or supplier (${supplierId})`);
                continue;
            }
            
            try {
                const response = await axios.post(`${API_BASE}/products`, {
                    data: {
                        name: product.name,
                        sku: product.sku,
                        description: product.description,
                        price: product.price,
                        stock: product.stock,
                        rating: product.rating,
                        featured: product.featured,
                        category: categoryId,
                        supplier: supplierId,
                        publishedAt: new Date().toISOString()
                    }
                });
                console.log(`✅ Imported product: ${product.name}`);
            } catch (error) {
                if (error.response?.status === 400) {
                    console.log(`⚠️ Product ${product.name} may already exist`);
                } else {
                    console.log(`❌ Error importing product ${product.name}:`, error.message);
                }
            }
        }
        
        console.log('🎉 Sample data import completed!');
        
        // Verify import
        console.log('🔍 Verifying import...');
        try {
            const categoriesCheck = await axios.get(`${API_BASE}/categories`);
            const suppliersCheck = await axios.get(`${API_BASE}/suppliers`);
            const productsCheck = await axios.get(`${API_BASE}/products`);
            
            console.log(`📊 Final counts:`);
            console.log(`   - Categories: ${categoriesCheck.data.data.length}`);
            console.log(`   - Suppliers: ${suppliersCheck.data.data.length}`);
            console.log(`   - Products: ${productsCheck.data.data.length}`);
        } catch (verifyError) {
            console.log('⚠️ Could not verify import - check Strapi admin panel');
        }
        
    } catch (error) {
        console.error('❌ Import failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Ensure Strapi is running on http://localhost:1337');
        console.log('2. Check API permissions in Strapi admin panel');
        console.log('3. Verify content types (Category, Supplier, Product) exist');
    }
}

// Run the import
importSampleData();
