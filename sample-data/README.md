# Sample Data for Strapi B2B Catalog

This directory contains sample data files for populating the Strapi B2B catalog with realistic business data.

## 📁 Data Files

### Categories (`categories.json`)
Contains 10 business categories:
- Electronics
- Office Supplies  
- Industrial Equipment
- Safety Equipment
- Cleaning Supplies
- IT Hardware
- Medical Supplies
- Automotive Parts
- Construction Materials
- Food Service

### Suppliers (`suppliers.json`)
Contains 10 business suppliers with complete contact information:
- TechCorp Solutions (Electronics & IT)
- Global Office Supply Co. (Office Supplies)
- Industrial Equipment Partners (Heavy Machinery)
- SafeGuard Equipment Inc. (Safety Equipment)
- CleanPro Solutions (Cleaning Products)
- MedSupply Direct (Medical Equipment)
- AutoParts Wholesale (Automotive Parts)
- BuildRight Materials (Construction)
- FoodService Pro (Commercial Kitchen)
- EcoGreen Supplies (Sustainable Products)

### Products (`products.json`)
Contains 15 detailed products with:
- Complete specifications
- Pricing information (retail and cost)
- Stock quantities
- Category and supplier relationships
- SKU codes
- Weight and dimensions
- Tags and features

## 🚀 Import Instructions

### Method 1: Using the Import Script (Recommended)

1. **Start your Strapi application:**
   ```bash
   cd strapi-b2b
   npm run develop
   ```

2. **Run the import script:**
   ```bash
   cd sample-data
   node import-data.js
   ```

### Method 2: Manual Import via Admin Panel

1. Start Strapi and access the admin panel at `http://localhost:1337/admin`
2. Create categories first (Content Manager → Categories)
3. Create suppliers second (Content Manager → Suppliers)
4. Create products last (Content Manager → Products)

## 🔧 Import Script Options

The `import-data.js` script supports several options:

```bash
# Import all data (default)
node import-data.js

# Clear existing data and import all
node import-data.js --clear

# Import only categories
node import-data.js --categories

# Import only suppliers
node import-data.js --suppliers

# Import only products
node import-data.js --products

# Clear and import specific data types
node import-data.js --clear --categories --suppliers
```

## 🔑 API Token (Optional)

For authenticated imports, set the `STRAPI_API_TOKEN` environment variable:

```bash
export STRAPI_API_TOKEN=your-api-token-here
node import-data.js
```

## 📊 Data Relationships

The sample data includes proper relationships:
- **Products** are linked to **Categories** and **Suppliers**
- **Categories** have hierarchical structure potential
- **Suppliers** include complete business information

## 🎯 Use Cases

This sample data is perfect for:
- **Development and Testing** - Realistic data for frontend development
- **Demonstrations** - Professional-looking catalog for demos
- **Performance Testing** - Sufficient data volume for testing
- **Feature Development** - Complete relationships for testing search, filtering, etc.

## 📝 Data Structure Examples

### Category Example
```json
{
  "name": "Electronics",
  "description": "Electronic devices and components for various applications",
  "slug": "electronics",
  "isActive": true,
  "sortOrder": 1
}
```

### Supplier Example
```json
{
  "name": "TechCorp Solutions",
  "contactEmail": "sales@techcorp.com",
  "contactPhone": "+1-555-0101",
  "website": "https://www.techcorp.com",
  "address": {
    "street": "123 Technology Drive",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94105",
    "country": "USA"
  },
  "isActive": true,
  "rating": 4.8
}
```

### Product Example
```json
{
  "name": "Professional Laptop Computer",
  "sku": "TECH-LAP-001",
  "price": 1299.99,
  "costPrice": 899.99,
  "stockQuantity": 45,
  "category": "Electronics",
  "supplier": "TechCorp Solutions",
  "specifications": {
    "processor": "Intel Core i7-12700H",
    "memory": "16GB DDR4",
    "storage": "512GB NVMe SSD"
  }
}
```

## ⚠️ Important Notes

1. **Import Order**: Always import categories and suppliers before products
2. **Relationships**: The import script automatically maps category and supplier names to IDs
3. **Duplicates**: Use `--clear` flag to avoid duplicate entries
4. **Validation**: All data follows Strapi content type schemas
5. **Images**: Sample data doesn't include images - add them manually or via separate upload script

## 🔄 Updating Sample Data

To modify the sample data:
1. Edit the JSON files directly
2. Re-run the import script with `--clear` flag
3. Or manually update via the Strapi admin panel

## 🐛 Troubleshooting

**Import fails with authentication error:**
- Ensure Strapi is running
- Check if public permissions are enabled for the content types
- Or provide a valid API token

**Relationship errors:**
- Ensure categories and suppliers are imported before products
- Check that category and supplier names match exactly

**Network errors:**
- Verify Strapi URL (default: http://localhost:1337)
- Ensure Strapi is accessible and running
