import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Helper function to load sample data
function loadSampleData(filename) {
    try {
        const filePath = path.join(__dirname, '../../sample-data', filename);
        const rawData = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(rawData);
    }
    catch (error) {
        console.warn(`Could not load sample data file ${filename}:`, error.message);
        return null;
    }
}
// Import categories
async function importCategories(strapi) {
    const categories = loadSampleData('categories.json');
    if (!categories)
        return [];
    const existingCategories = await strapi.entityService.findMany('api::category.category');
    if (existingCategories.length > 0) {
        console.log(`Found ${existingCategories.length} existing categories, skipping import`);
        return existingCategories;
    }
    console.log('Importing sample categories...');
    const imported = [];
    for (const categoryData of categories) {
        try {
            const category = await strapi.entityService.create('api::category.category', {
                data: categoryData
            });
            imported.push(category);
            console.log(`✅ Created category: ${categoryData.name}`);
        }
        catch (error) {
            console.error(`❌ Failed to create category ${categoryData.name}:`, error.message);
        }
    }
    console.log(`📊 Imported ${imported.length} categories`);
    return imported;
}
// Import suppliers
async function importSuppliers(strapi) {
    const suppliers = loadSampleData('suppliers.json');
    if (!suppliers)
        return [];
    const existingSuppliers = await strapi.entityService.findMany('api::supplier.supplier');
    if (existingSuppliers.length > 0) {
        console.log(`Found ${existingSuppliers.length} existing suppliers, skipping import`);
        return existingSuppliers;
    }
    console.log('Importing sample suppliers...');
    const imported = [];
    for (const supplierData of suppliers) {
        try {
            const supplier = await strapi.entityService.create('api::supplier.supplier', {
                data: supplierData
            });
            imported.push(supplier);
            console.log(`✅ Created supplier: ${supplierData.name}`);
        }
        catch (error) {
            console.error(`❌ Failed to create supplier ${supplierData.name}:`, error.message);
        }
    }
    console.log(`📊 Imported ${imported.length} suppliers`);
    return imported;
}
// Import products
async function importProducts(strapi, categories, suppliers) {
    const products = loadSampleData('products.json');
    if (!products)
        return [];
    const existingProducts = await strapi.entityService.findMany('api::product.product');
    if (existingProducts.length > 0) {
        console.log(`Found ${existingProducts.length} existing products, skipping import`);
        return existingProducts;
    }
    // Create lookup maps
    const categoryMap = new Map();
    const supplierMap = new Map();
    categories.forEach(cat => categoryMap.set(cat.name, cat.id));
    suppliers.forEach(sup => supplierMap.set(sup.name, sup.id));
    console.log('Importing sample products...');
    const imported = [];
    for (const productData of products) {
        try {
            // Map category and supplier names to IDs, and fix field names
            const data = { ...productData };
            // Map stockQuantity to stock (Strapi schema requirement)
            if (productData.stockQuantity !== undefined) {
                data.stock = productData.stockQuantity;
                delete data.stockQuantity;
            }
            if (productData.category && categoryMap.has(productData.category)) {
                data.category = categoryMap.get(productData.category);
            }
            else {
                delete data.category;
            }
            if (productData.supplier && supplierMap.has(productData.supplier)) {
                data.supplier = supplierMap.get(productData.supplier);
            }
            else {
                delete data.supplier;
            }
            const product = await strapi.entityService.create('api::product.product', {
                data: data
            });
            imported.push(product);
            console.log(`✅ Created product: ${productData.name}`);
        }
        catch (error) {
            console.error(`❌ Failed to create product ${productData.name}:`, error.message);
        }
    }
    console.log(`📊 Imported ${imported.length} products`);
    return imported;
}
export default {
    async bootstrap({ strapi }) {
        try {
            console.log('🚀 Starting Strapi B2B application bootstrap');
            // Set up public permissions for API access
            console.log('🔑 Configuring public API permissions');
            const role = await strapi.query('plugin::users-permissions.role').findOne({
                where: { type: 'public' }
            });
            if (role) {
                const permissionsToSet = {
                    'api::product.product': ['find', 'findOne'],
                    'api::category.category': ['find', 'findOne'],
                    'api::supplier.supplier': ['find', 'findOne'],
                };
                for (const [apiKey, actions] of Object.entries(permissionsToSet)) {
                    for (const action of actions) {
                        const existing = await strapi.query('plugin::users-permissions.permission').findMany({
                            where: {
                                role: role.id,
                                action: `${apiKey}.${action}`,
                            },
                        });
                        if (existing.length === 0) {
                            await strapi.query('plugin::users-permissions.permission').create({
                                data: {
                                    action: `${apiKey}.${action}`,
                                    role: role.id,
                                    enabled: true,
                                },
                            });
                        }
                    }
                }
                console.log('✅ Public API permissions configured successfully');
            }
            else {
                console.warn('⚠️ Public role not found, skipping permission setup');
            }
            // Verify database connection
            try {
                console.log('🔍 Verifying database connection');
                await strapi.db.connection.raw('SELECT 1');
                console.log('✅ Database connection verified');
            }
            catch (dbError) {
                console.error('❌ Database connection failed:', dbError.message);
                throw dbError;
            }
            // Import sample data
            try {
                console.log('📦 Starting sample data import');
                const categories = await importCategories(strapi);
                const suppliers = await importSuppliers(strapi);
                const products = await importProducts(strapi, categories, suppliers);
                console.log('🎉 Sample data import completed!', {
                    categories: categories.length,
                    suppliers: suppliers.length,
                    products: products.length
                });
            }
            catch (importError) {
                console.error('❌ Sample data import failed:', importError.message);
                // Don't throw - let the application start even if sample data import fails
            }
            console.log('✅ Strapi B2B bootstrap completed successfully');
            console.log('🎯 Ready to use with sample data loaded!');
        }
        catch (error) {
            console.error('💥 Bootstrap process failed:', error.message);
            console.error('Stack:', error.stack);
            // Re-throw to prevent application from starting in broken state
            throw error;
        }
    },
    async destroy({ strapi }) {
        try {
            console.log('🛑 Starting application shutdown');
            // Perform cleanup operations here if needed
            // For example: close connections, clear caches, etc.
            console.log('✅ Application shutdown completed');
        }
        catch (error) {
            console.error('❌ Error during application shutdown:', error.message);
        }
    }
};
