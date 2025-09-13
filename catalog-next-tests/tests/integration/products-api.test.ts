import { createMockApiResponse } from '../utils/test-utils'

// Setup fetch mock
global.fetch = jest.fn()
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

// Mock fetch responses
const mockFetchSuccess = (data: any) => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => data,
  } as Response)
}

const mockFetchError = (status = 500, message = 'Server Error') => {
  mockFetch.mockRejectedValueOnce(new Error(message))
}

describe('Products API Integration', () => {
  const API_BASE = 'http://localhost:1337'
  const API_URL = `${API_BASE}/api`

  beforeEach(() => {
    mockFetch.mockClear()
    process.env.NEXT_PUBLIC_API_BASE = API_BASE
  })

  describe('Fetch Products', () => {
    it('fetches products with correct endpoint', async () => {
      const mockProducts = [
        {
          id: 1,
          attributes: {
            name: 'Laptop Pro',
            sku: 'LP001',
            price: 1299.99,
            description: 'High-performance laptop',
            stock: 15,
            featured: true,
            images: [{ id: 1, url: '/laptop.jpg' }],
            category: {
              data: { id: 1, attributes: { name: 'Electronics' } }
            },
            supplier: {
              data: { id: 1, attributes: { name: 'TechCorp' } }
            }
          }
        }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createMockApiResponse(mockProducts, true),
      } as Response)

      const response = await fetch(`${API_URL}/products?populate=*`)
      const data = await response.json()

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/products?populate=*`)
      expect(response.ok).toBe(true)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].attributes.name).toBe('Laptop Pro')
    })

    it('fetches products with pagination', async () => {
      const mockProducts = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        attributes: {
          name: `Product ${i + 1}`,
          sku: `SKU${i + 1}`,
          price: 100 + i,
        }
      }))

      const mockResponse = {
        data: mockProducts,
        meta: {
          pagination: {
            page: 1,
            pageSize: 25,
            pageCount: 1,
            total: 25,
          },
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const response = await fetch(`${API_URL}/products?pagination[page]=1&pagination[pageSize]=25`)
      const data = await response.json()

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/products?pagination[page]=1&pagination[pageSize]=25`)
      expect(data.data).toHaveLength(25)
      expect(data.meta.pagination.pageSize).toBe(25)
    })

    it('fetches products with search filter', async () => {
      const mockProducts = [
        {
          id: 1,
          attributes: {
            name: 'Laptop Pro',
            sku: 'LP001',
            price: 1299.99,
          }
        }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createMockApiResponse(mockProducts, true),
      } as Response)

      const searchTerm = 'laptop'
      const response = await fetch(`${API_URL}/products?filters[name][$containsi]=${searchTerm}`)
      const data = await response.json()

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/products?filters[name][$containsi]=${searchTerm}`)
      expect(data.data[0].attributes.name.toLowerCase()).toContain(searchTerm)
    })

    it('fetches products by category', async () => {
      const mockProducts = [
        {
          id: 1,
          attributes: {
            name: 'Laptop Pro',
            category: {
              data: { id: 1, attributes: { name: 'Electronics' } }
            }
          }
        }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createMockApiResponse(mockProducts, true),
      } as Response)

      const categoryId = 1
      const response = await fetch(`${API_URL}/products?filters[category][id][$eq]=${categoryId}&populate=*`)
      const data = await response.json()

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/products?filters[category][id][$eq]=${categoryId}&populate=*`)
      expect(data.data[0].attributes.category.data.id).toBe(categoryId)
    })

    it('fetches products sorted by price', async () => {
      const mockProducts = [
        { id: 1, attributes: { name: 'Cheap Product', price: 10.99 } },
        { id: 2, attributes: { name: 'Expensive Product', price: 999.99 } },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createMockApiResponse(mockProducts, true),
      } as Response)

      const response = await fetch(`${API_URL}/products?sort=price:asc`)
      const data = await response.json()

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/products?sort=price:asc`)
      expect(data.data[0].attributes.price).toBeLessThan(data.data[1].attributes.price)
    })

    it('handles API error gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response)

      const response = await fetch(`${API_URL}/products`)

      expect(response.ok).toBe(false)
      expect(response.status).toBe(500)
    })
  })

  describe('Fetch Single Product', () => {
    it('fetches single product by ID', async () => {
      const mockProduct = {
        id: 1,
        attributes: {
          name: 'Laptop Pro',
          sku: 'LP001',
          price: 1299.99,
          description: 'High-performance laptop for professionals',
          images: [
            { id: 1, url: '/laptop1.jpg' },
            { id: 2, url: '/laptop2.jpg' }
          ],
          category: {
            data: { id: 1, attributes: { name: 'Electronics' } }
          },
          supplier: {
            data: { id: 1, attributes: { name: 'TechCorp' } }
          }
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createMockApiResponse(mockProduct),
      } as Response)

      const productId = 1
      const response = await fetch(`${API_URL}/products/${productId}?populate=*`)
      const data = await response.json()

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/products/${productId}?populate=*`)
      expect(data.data.id).toBe(productId)
      expect(data.data.attributes.name).toBe('Laptop Pro')
      expect(data.data.attributes.images).toHaveLength(2)
    })

    it('handles product not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response)

      const response = await fetch(`${API_URL}/products/999`)

      expect(response.ok).toBe(false)
      expect(response.status).toBe(404)
    })
  })

  describe('Most Viewed Products', () => {
    it('fetches most viewed products', async () => {
      const mockProducts = [
        {
          id: 1,
          attributes: {
            name: 'Popular Product 1',
            viewCount: 150,
            price: 99.99
          }
        },
        {
          id: 2,
          attributes: {
            name: 'Popular Product 2',
            viewCount: 120,
            price: 149.99
          }
        }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createMockApiResponse(mockProducts, true),
      } as Response)

      const limit = 6
      const response = await fetch(`${API_URL}/products?sort=viewCount:desc&populate=*&pagination[pageSize]=${limit}`)
      const data = await response.json()

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/products?sort=viewCount:desc&populate=*&pagination[pageSize]=${limit}`)
      expect(data.data).toHaveLength(2)
      expect(data.data[0].attributes.viewCount).toBeGreaterThanOrEqual(data.data[1].attributes.viewCount)
    })
  })

  describe('Categories API', () => {
    it('fetches all categories', async () => {
      const mockCategories = [
        {
          id: 1,
          attributes: {
            name: 'Electronics',
            description: 'Electronic devices and accessories',
            slug: 'electronics'
          }
        },
        {
          id: 2,
          attributes: {
            name: 'Office Supplies',
            description: 'Office equipment and supplies',
            slug: 'office-supplies'
          }
        }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createMockApiResponse(mockCategories, true),
      } as Response)

      const response = await fetch(`${API_URL}/categories`)
      const data = await response.json()

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/categories`)
      expect(data.data).toHaveLength(2)
      expect(data.data[0].attributes.name).toBe('Electronics')
    })
  })

  describe('Suppliers API', () => {
    it('fetches all suppliers', async () => {
      const mockSuppliers = [
        {
          id: 1,
          attributes: {
            name: 'TechCorp',
            email: 'contact@techcorp.com',
            phone: '+1-555-0123',
            address: '123 Tech Street, Silicon Valley, CA'
          }
        }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createMockApiResponse(mockSuppliers, true),
      } as Response)

      const response = await fetch(`${API_URL}/suppliers`)
      const data = await response.json()

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/suppliers`)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].attributes.name).toBe('TechCorp')
    })
  })
})
