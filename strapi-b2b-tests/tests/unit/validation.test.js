// Unit tests for data validation logic
describe('Data Validation Tests', () => {
  
  describe('Product Validation', () => {
    test('should validate required product fields', () => {
      const validateProduct = (product) => {
        const errors = [];
        if (!product.name || product.name.trim() === '') {
          errors.push('Name is required');
        }
        if (!product.price || product.price <= 0) {
          errors.push('Price must be greater than 0');
        }
        if (!product.sku || product.sku.trim() === '') {
          errors.push('SKU is required');
        }
        return errors;
      };

      // Valid product
      expect(validateProduct({
        name: 'Test Product',
        price: 99.99,
        sku: 'TEST-001'
      })).toEqual([]);

      // Invalid products
      expect(validateProduct({})).toContain('Name is required');
      expect(validateProduct({ name: '', price: -10, sku: '' })).toHaveLength(3);
    });

    test('should validate SKU format', () => {
      const validateSKU = (sku) => {
        const skuRegex = /^[A-Z0-9-]+$/;
        return skuRegex.test(sku);
      };

      expect(validateSKU('TEST-001')).toBe(true);
      expect(validateSKU('PROD123')).toBe(true);
      expect(validateSKU('invalid-sku')).toBe(false);
      expect(validateSKU('test@123')).toBe(false);
    });

    test('should validate price range', () => {
      const validatePrice = (price) => {
        return price > 0 && price <= 999999.99;
      };

      expect(validatePrice(99.99)).toBe(true);
      expect(validatePrice(0.01)).toBe(true);
      expect(validatePrice(0)).toBe(false);
      expect(validatePrice(-10)).toBe(false);
      expect(validatePrice(1000000)).toBe(false);
    });
  });

  describe('Category Validation', () => {
    test('should validate category name', () => {
      const validateCategory = (category) => {
        if (!category || !category.name || typeof category.name !== 'string') {
          return false;
        }
        return category.name.length >= 2 && category.name.length <= 100;
      };

      expect(validateCategory({ name: 'Electronics' })).toBe(true);
      expect(validateCategory({ name: 'A' })).toBe(false);
      expect(validateCategory({ name: '' })).toBe(false);
      expect(validateCategory({})).toBe(false);
      expect(validateCategory(null)).toBe(false);
      expect(validateCategory(undefined)).toBe(false);
    });
  });

  describe('Supplier Validation', () => {
    test('should validate email format', () => {
      const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
    });

    test('should validate phone number format', () => {
      const validatePhone = (phone) => {
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        return phone && phoneRegex.test(phone) && phone.length >= 10;
      };

      expect(validatePhone('+1234567890')).toBe(true);
      expect(validatePhone('(123) 456-7890')).toBe(true);
      expect(validatePhone('123-456-7890')).toBe(true);
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('abc123')).toBe(false);
    });
  });
});
