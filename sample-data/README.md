# Sample Data for B2B Catalog

This directory contains sample data files and import scripts to populate your B2B Catalog application with realistic test data.

## 📁 Files Overview

### Data Files
- **`categories.json`** - 15 B2B product categories with descriptions and slugs
- **`suppliers.json`** - 20 business suppliers with contact information
- **`sample-products.json`** - 15 sample products with realistic B2B pricing and specifications

### Import Scripts
- **`seed-strapi.js`** - Strapi entity service seeding script for direct database population
- **`import-api-calls.js`** - HTTP API import script using REST endpoints
- **`README.md`** - This documentation file

## 🗂️ Sample Data Contents

### Categories (15 items)
- Office Supplies
- Industrial Equipment  
- IT & Technology
- Safety & Security
- Cleaning & Janitorial
- Food Service Equipment
- Medical & Healthcare
- Automotive Parts
- Construction Materials
- Electrical Components
- Packaging & Shipping
- Laboratory Equipment
- Furniture & Fixtures
- HVAC & Climate Control
- Textiles & Apparel

### Suppliers (20 items)
- TechFlow Solutions (CA)
- Industrial Supply Co. (MI)
- MedEquip Healthcare (TX)
- Office Essentials Inc. (GA)
- SafeGuard Equipment (AZ)
- CleanPro Commercial (IL)
- FoodService Direct (NV)
- AutoParts Warehouse (OH)
- BuildRight Materials (CO)
- ElectroTech Components (MA)
- And 10 more suppliers across the US

### Products (15 items)
Sample products include:
- Wireless Ergonomic Mouse ($45.99)
- Industrial Safety Helmet ($28.50)
- Commercial Coffee Machine ($1,299.99)
- Digital Blood Pressure Monitor ($245.00)
- Laboratory Microscope ($899.99)
- Commercial Air Conditioner ($2,499.99)
- And 9 more products with realistic B2B pricing

## 🚀 Import Methods

### Method 1: Direct Strapi Seeding (Recommended)

1. **Copy the seeding script to Strapi:**
   ```bash
   # Linux/Mac
   cp seed-strapi.js ../strapi-b2b/config/functions/bootstrap.js
   
   # Windows PowerShell
   Copy-Item seed-strapi.js ..\strapi-b2b\config\functions\bootstrap.js
   ```

2. **Restart Strapi server:**
   ```bash
   cd ../strapi-b2b
   npm run develop
   ```

3. **Data will be automatically imported on server start**

### Method 2: API Import Script

1. **Ensure Strapi server is running:**
   ```bash
   cd ../strapi-b2b
   npm run develop
   ```

2. **Install axios (if not already installed):**
   ```bash
   npm install axios
   ```

3. **Run the import script:**
   ```bash
   node import-api-calls.js
   ```

### Method 3: Manual Import via Admin Panel

1. **Access Strapi Admin Panel:**
   - Open http://localhost:1337/admin
   - Login with your admin credentials

2. **Import Categories:**
   - Go to Content Manager → Categories
   - Create entries using data from `categories.json`

3. **Import Suppliers:**
   - Go to Content Manager → Suppliers  
   - Create entries using data from `suppliers.json`

4. **Import Products:**
   - Go to Content Manager → Products
   - Create entries using data from `sample-products.json`
   - Link each product to appropriate category and supplier

## 📊 Data Relationships

The sample data includes proper relationships:
- **Products** are linked to **Categories** (many-to-one)
- **Products** are linked to **Suppliers** (many-to-one)
- All entries include realistic B2B pricing and specifications
- Products have stock levels, ratings, and featured flags

## 🔧 Customization

### Adding More Data
1. **Categories:** Add new entries to `categories.json` with name, slug, and description
2. **Suppliers:** Add new entries to `suppliers.json` with business contact information  
3. **Products:** Add new entries to `sample-products.json` ensuring category and supplier names match existing data

### Modifying Existing Data
- Edit the JSON files directly
- Re-run the import scripts to update the database
- Or modify individual entries via the Strapi admin panel

## ⚠️ Important Notes

- **Duplicate Prevention:** The seeding script checks for existing data to prevent duplicates
- **Relationships:** Product imports require categories and suppliers to exist first
- **Error Handling:** Import scripts include error handling and progress logging
- **Data Validation:** All data follows Strapi content type schemas

## 🧪 Testing Data

After importing, you can:
- View categories at: http://localhost:3001/categories
- View suppliers at: http://localhost:3001/suppliers  
- Browse products at: http://localhost:3001/products
- Check analytics at: http://localhost:3001/analytics

## 📝 Data Schema

### Category Schema
```json
{
  "name": "string (required)",
  "slug": "string (required, unique)",
  "description": "text (optional)"
}
```

### Supplier Schema
```json
{
  "name": "string (required)",
  "email": "email (optional)",
  "phone": "string (optional)", 
  "address": "text (optional)"
}
```

### Product Schema
```json
{
  "name": "string (required)",
  "sku": "string (required, unique)",
  "description": "text (optional)",
  "price": "decimal (required)",
  "stock": "integer (required)",
  "rating": "decimal (optional)",
  "featured": "boolean (default: false)",
  "category": "relation (required)",
  "supplier": "relation (required)"
}
```

---

**Generated:** 2025-09-13  
**Version:** 1.0  
**Compatibility:** Strapi 5.x, B2B Catalog Solution
