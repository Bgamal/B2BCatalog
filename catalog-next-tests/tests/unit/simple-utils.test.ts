import '@testing-library/jest-dom'

// Simple utility functions for testing
const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

const generateImageUrl = (baseUrl: string, imagePath?: string): string => {
  if (!imagePath) return '/placeholder-image.jpg'
  return imagePath.startsWith('http') ? imagePath : `${baseUrl}${imagePath}`
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('formats USD currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56')
      expect(formatCurrency(0)).toBe('$0.00')
      expect(formatCurrency(999.99)).toBe('$999.99')
    })

    it('formats different currencies', () => {
      expect(formatCurrency(1000, 'EUR')).toBe('€1,000.00')
      expect(formatCurrency(1000, 'GBP')).toBe('£1,000.00')
    })
  })

  describe('generateImageUrl', () => {
    const baseUrl = 'https://api.example.com'

    it('returns placeholder for empty image path', () => {
      expect(generateImageUrl(baseUrl)).toBe('/placeholder-image.jpg')
      expect(generateImageUrl(baseUrl, '')).toBe('/placeholder-image.jpg')
    })

    it('returns full URL for absolute paths', () => {
      const fullUrl = 'https://cdn.example.com/image.jpg'
      expect(generateImageUrl(baseUrl, fullUrl)).toBe(fullUrl)
    })

    it('combines base URL with relative path', () => {
      expect(generateImageUrl(baseUrl, '/uploads/image.jpg')).toBe('https://api.example.com/uploads/image.jpg')
    })
  })

  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('user+tag@example.org')).toBe(true)
    })

    it('rejects invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test.test@example.com')).toBe(true) // This is actually valid
    })
  })

  describe('slugify', () => {
    it('converts text to URL-friendly slug', () => {
      expect(slugify('Hello World')).toBe('hello-world')
      expect(slugify('Product Name & Description')).toBe('product-name-description')
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces')
    })

    it('handles special characters', () => {
      expect(slugify('Test!@#$%^&*()')).toBe('test')
      expect(slugify('café-résumé')).toBe('caf-rsum')
    })

    it('handles edge cases', () => {
      expect(slugify('')).toBe('')
      expect(slugify('---')).toBe('')
      expect(slugify('a')).toBe('a')
    })
  })
})
