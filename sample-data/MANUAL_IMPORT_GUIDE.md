# Manual Sample Data Import Guide

## 🚀 Quick Manual Import via Strapi Admin Panel

### Step 1: Access Strapi Admin
1. Open http://localhost:1337/admin in your browser
2. Login with your admin credentials

### Step 2: Import Categories
1. Go to **Content Manager** → **Category**
2. Click **Create new entry** for each category
3. Copy data from `categories.json`:

```json
[
  {"name": "Office Supplies", "slug": "office-supplies", "description": "Essential office equipment and supplies for daily business operations"},
  {"name": "Industrial Equipment", "slug": "industrial-equipment", "description": "Heavy-duty machinery and equipment for manufacturing and industrial use"},
  {"name": "IT & Technology", "slug": "it-technology", "description": "Computer hardware, software, and technology solutions for businesses"},
  {"name": "Safety & Security", "slug": "safety-security", "description": "Personal protective equipment and workplace safety solutions"},
  {"name": "Medical & Healthcare", "slug": "medical-healthcare", "description": "Medical devices, equipment, and healthcare supplies"}
]
```

### Step 3: Import Suppliers
1. Go to **Content Manager** → **Supplier**
2. Click **Create new entry** for each supplier
3. Copy data from `suppliers.json`:

```json
[
  {"name": "TechFlow Solutions", "email": "contact@techflow.com", "phone": "+1-555-0101", "address": "123 Tech Street, Silicon Valley, CA 94000"},
  {"name": "Industrial Supply Co.", "email": "sales@industrialsupply.com", "phone": "+1-555-0102", "address": "456 Factory Ave, Detroit, MI 48000"},
  {"name": "MedEquip Healthcare", "email": "info@medequip.com", "phone": "+1-555-0103", "address": "789 Medical Plaza, Houston, TX 77000"}
]
```

### Step 4: Import Products
1. Go to **Content Manager** → **Product**
2. Click **Create new entry** for each product
3. Copy data from `sample-products.json` and link to categories/suppliers

## 🔧 Alternative: Direct Database Import

### Option 1: SQL Import (if using SQLite)
```sql
-- Copy the database file
cp strapi-b2b/database/data.db strapi-b2b/database/data.db.backup

-- Use SQLite browser or command line to import JSON data
```

### Option 2: API Import Script
```bash
# Install dependencies
npm install axios

# Run the import script
node import-api-calls.js
```

## 📊 Verify Import Success
1. Check **Content Manager** in Strapi admin
2. Visit frontend pages:
   - http://localhost:3001/categories
   - http://localhost:3001/suppliers  
   - http://localhost:3001/products

## 🐛 Troubleshooting
- Ensure Strapi server is running on port 1337
- Check that content types (Category, Supplier, Product) exist
- Verify API permissions are enabled for public access
- Check browser console for any errors
