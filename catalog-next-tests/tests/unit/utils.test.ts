describe('Utility Functions', () => {
  describe('Currency Formatting', () => {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    };

    it('formats whole numbers correctly', () => {
      expect(formatCurrency(100)).toBe('$100.00')
      expect(formatCurrency(1000)).toBe('$1,000.00')
    })

    it('formats decimal numbers correctly', () => {
      expect(formatCurrency(99.99)).toBe('$99.99')
      expect(formatCurrency(1299.50)).toBe('$1,299.50')
    })

    it('handles zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00')
    })

    it('handles negative numbers correctly', () => {
      expect(formatCurrency(-50.25)).toBe('-$50.25')
    })

    it('handles large numbers correctly', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00')
    })
  })

  describe('Image URL Generation', () => {
    const getImageUrl = (images: Array<{ url: string }> | undefined, apiBase = 'http://localhost:1337') => {
      if (images && images.length > 0) {
        return `${apiBase}${images[0].url}`;
      }
      return '/placeholder-product.png';
    };

    beforeEach(() => {
      process.env.NEXT_PUBLIC_API_BASE = 'http://localhost:1337'
    })

    it('returns full URL when images exist', () => {
      const images = [{ url: '/uploads/product1.jpg' }]
      expect(getImageUrl(images)).toBe('http://localhost:1337/uploads/product1.jpg')
    })

    it('returns placeholder when no images', () => {
      expect(getImageUrl([])).toBe('/placeholder-product.png')
      expect(getImageUrl(undefined)).toBe('/placeholder-product.png')
    })

    it('uses first image when multiple images exist', () => {
      const images = [
        { url: '/uploads/product1.jpg' },
        { url: '/uploads/product2.jpg' }
      ]
      expect(getImageUrl(images)).toBe('http://localhost:1337/uploads/product1.jpg')
    })

    it('works with custom API base', () => {
      const images = [{ url: '/uploads/product1.jpg' }]
      expect(getImageUrl(images, 'https://api.example.com')).toBe('https://api.example.com/uploads/product1.jpg')
    })
  })

  describe('Search Query Building', () => {
    const buildSearchQuery = (params: {
      search?: string;
      category?: string;
      minPrice?: number;
      maxPrice?: number;
      sortBy?: string;
      page?: number;
      pageSize?: number;
    }) => {
      const query = new URLSearchParams()
      
      if (params.search) {
        query.append('filters[name][$containsi]', params.search)
      }
      
      if (params.category) {
        query.append('filters[category][name][$eq]', params.category)
      }
      
      if (params.minPrice !== undefined) {
        query.append('filters[price][$gte]', params.minPrice.toString())
      }
      
      if (params.maxPrice !== undefined) {
        query.append('filters[price][$lte]', params.maxPrice.toString())
      }
      
      if (params.sortBy) {
        query.append('sort', params.sortBy)
      }
      
      if (params.page) {
        query.append('pagination[page]', params.page.toString())
      }
      
      if (params.pageSize) {
        query.append('pagination[pageSize]', params.pageSize.toString())
      }
      
      query.append('populate', '*')
      
      return query.toString()
    }

    it('builds basic search query', () => {
      const query = buildSearchQuery({ search: 'laptop' })
      expect(query).toContain('filters%5Bname%5D%5B%24containsi%5D=laptop')
      expect(query).toContain('populate=*')
    })

    it('builds category filter query', () => {
      const query = buildSearchQuery({ category: 'Electronics' })
      expect(query).toContain('filters%5Bcategory%5D%5Bname%5D%5B%24eq%5D=Electronics')
    })

    it('builds price range query', () => {
      const query = buildSearchQuery({ minPrice: 100, maxPrice: 500 })
      expect(query).toContain('filters%5Bprice%5D%5B%24gte%5D=100')
      expect(query).toContain('filters%5Bprice%5D%5B%24lte%5D=500')
    })

    it('builds sort query', () => {
      const query = buildSearchQuery({ sortBy: 'price:asc' })
      expect(query).toContain('sort=price%3Aasc')
    })

    it('builds pagination query', () => {
      const query = buildSearchQuery({ page: 2, pageSize: 20 })
      expect(query).toContain('pagination%5Bpage%5D=2')
      expect(query).toContain('pagination%5BpageSize%5D=20')
    })

    it('builds complex query with multiple parameters', () => {
      const query = buildSearchQuery({
        search: 'laptop',
        category: 'Electronics',
        minPrice: 500,
        maxPrice: 2000,
        sortBy: 'price:desc',
        page: 1,
        pageSize: 25
      })
      
      expect(query).toContain('filters%5Bname%5D%5B%24containsi%5D=laptop')
      expect(query).toContain('filters%5Bcategory%5D%5Bname%5D%5B%24eq%5D=Electronics')
      expect(query).toContain('filters%5Bprice%5D%5B%24gte%5D=500')
      expect(query).toContain('filters%5Bprice%5D%5B%24lte%5D=2000')
      expect(query).toContain('sort=price%3Adesc')
      expect(query).toContain('pagination%5Bpage%5D=1')
      expect(query).toContain('pagination%5BpageSize%5D=25')
    })

    it('handles empty parameters', () => {
      const query = buildSearchQuery({})
      expect(query).toBe('populate=*')
    })
  })

  describe('Data Validation', () => {
    const validateProduct = (product: any) => {
      const errors: string[] = []
      
      if (!product.name || typeof product.name !== 'string' || product.name.trim().length === 0) {
        errors.push('Product name is required')
      }
      
      if (!product.sku || typeof product.sku !== 'string' || product.sku.trim().length === 0) {
        errors.push('Product SKU is required')
      }
      
      if (product.price === undefined || product.price === null || typeof product.price !== 'number' || product.price < 0) {
        errors.push('Product price must be a non-negative number')
      }
      
      if (product.stock !== undefined && (typeof product.stock !== 'number' || product.stock < 0)) {
        errors.push('Product stock must be a non-negative number')
      }
      
      return {
        isValid: errors.length === 0,
        errors
      }
    }

    it('validates valid product', () => {
      const product = {
        name: 'Test Product',
        sku: 'TP001',
        price: 99.99,
        stock: 10
      }
      
      const result = validateProduct(product)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('validates product without optional fields', () => {
      const product = {
        name: 'Test Product',
        sku: 'TP001',
        price: 99.99
      }
      
      const result = validateProduct(product)
      expect(result.isValid).toBe(true)
    })

    it('rejects product without name', () => {
      const product = {
        sku: 'TP001',
        price: 99.99
      }
      
      const result = validateProduct(product)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Product name is required')
    })

    it('rejects product with empty name', () => {
      const product = {
        name: '   ',
        sku: 'TP001',
        price: 99.99
      }
      
      const result = validateProduct(product)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Product name is required')
    })

    it('rejects product without SKU', () => {
      const product = {
        name: 'Test Product',
        price: 99.99
      }
      
      const result = validateProduct(product)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Product SKU is required')
    })

    it('rejects product with negative price', () => {
      const product = {
        name: 'Test Product',
        sku: 'TP001',
        price: -10
      }
      
      const result = validateProduct(product)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Product price must be a non-negative number')
    })

    it('rejects product with negative stock', () => {
      const product = {
        name: 'Test Product',
        sku: 'TP001',
        price: 99.99,
        stock: -5
      }
      
      const result = validateProduct(product)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Product stock must be a non-negative number')
    })

    it('collects multiple validation errors', () => {
      const product = {
        name: '',
        price: -10,
        stock: -5
      }
      
      const result = validateProduct(product)
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(4) // name, sku, price, stock
    })
  })
})
