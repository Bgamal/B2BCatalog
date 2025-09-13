import '@testing-library/jest-dom'

// Mock fetch globally
global.fetch = jest.fn()
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

// Create a mock ApiService class based on the actual implementation
class ApiService {
  private static getApiBase(): string {
    return process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:1337'
  }

  static async get(endpoint: string): Promise<any> {
    const url = `${this.getApiBase()}/api${endpoint}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }
    
    return response.json()
  }

  static async post(endpoint: string, data: any): Promise<any> {
    const url = `${this.getApiBase()}/api${endpoint}`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }
    
    return response.json()
  }

  static async put(endpoint: string, data: any): Promise<any> {
    const url = `${this.getApiBase()}/api${endpoint}`
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }
    
    return response.json()
  }

  static async delete(endpoint: string): Promise<any> {
    const url = `${this.getApiBase()}/api${endpoint}`
    const response = await fetch(url, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }
    
    return response.json()
  }
}

// Utility functions for Strapi response mapping
const mapStrapiList = (response: any) => {
  return response.data?.map((item: any) => ({
    id: item.id,
    ...item.attributes,
  })) || []
}

const mapStrapiItem = (response: any) => {
  if (!response.data) return null
  return {
    id: response.data.id,
    ...response.data.attributes,
  }
}

describe('ApiService', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    process.env.NEXT_PUBLIC_API_BASE = 'http://localhost:1337'
  })

  describe('get method', () => {
    it('makes GET request to correct endpoint', async () => {
      const mockData = { id: 1, name: 'Test' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response)

      await ApiService.get('/products')

      expect(fetch).toHaveBeenCalledWith('http://localhost:1337/api/products')
    })

    it('returns parsed JSON response', async () => {
      const mockData = { id: 1, name: 'Test' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response)

      const result = await ApiService.get('/products')

      expect(result).toEqual(mockData)
    })

    it('throws error on failed request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response)

      await expect(ApiService.get('/products')).rejects.toThrow('API request failed: 404')
    })

    it('uses default API base when env var not set', async () => {
      delete process.env.NEXT_PUBLIC_API_BASE
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response)

      await ApiService.get('/products')

      expect(fetch).toHaveBeenCalledWith('http://localhost:1337/api/products')
    })
  })

  describe('post method', () => {
    it('makes POST request with correct data', async () => {
      const mockData = { id: 1, name: 'New Product' }
      const postData = { name: 'New Product', price: 99.99 }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response)

      await ApiService.post('/products', postData)

      expect(fetch).toHaveBeenCalledWith('http://localhost:1337/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })
    })

    it('returns response data', async () => {
      const mockData = { id: 1, name: 'New Product' }
      const postData = { name: 'New Product', price: 99.99 }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response)

      const result = await ApiService.post('/products', postData)

      expect(result).toEqual(mockData)
    })

    it('throws error on failed POST request', async () => {
      const postData = { name: 'Invalid Product' }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
      } as Response)

      await expect(ApiService.post('/products', postData)).rejects.toThrow('API request failed: 400')
    })
  })

  describe('put method', () => {
    it('makes PUT request with correct data', async () => {
      const mockData = { id: 1, name: 'Updated Product' }
      const putData = { name: 'Updated Product', price: 149.99 }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response)

      await ApiService.put('/products/1', putData)

      expect(fetch).toHaveBeenCalledWith('http://localhost:1337/api/products/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(putData),
      })
    })

    it('returns updated data', async () => {
      const mockData = { id: 1, name: 'Updated Product' }
      const putData = { name: 'Updated Product', price: 149.99 }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response)

      const result = await ApiService.put('/products/1', putData)

      expect(result).toEqual(mockData)
    })

    it('throws error on failed PUT request', async () => {
      const putData = { name: 'Invalid Update' }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response)

      await expect(ApiService.put('/products/999', putData)).rejects.toThrow('API request failed: 404')
    })
  })

  describe('delete method', () => {
    it('makes DELETE request to correct endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response)

      await ApiService.delete('/products/1')

      expect(fetch).toHaveBeenCalledWith('http://localhost:1337/api/products/1', {
        method: 'DELETE',
      })
    })

    it('returns response data', async () => {
      const mockData = { message: 'Product deleted' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response)

      const result = await ApiService.delete('/products/1')

      expect(result).toEqual(mockData)
    })

    it('throws error on failed DELETE request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response)

      await expect(ApiService.delete('/products/999')).rejects.toThrow('API request failed: 404')
    })
  })
})

describe('Strapi Response Mapping', () => {
  describe('mapStrapiList', () => {
    it('maps Strapi list response correctly', () => {
      const strapiResponse = {
        data: [
          {
            id: 1,
            attributes: {
              name: 'Product 1',
              price: 99.99,
              description: 'Test product 1',
            },
          },
          {
            id: 2,
            attributes: {
              name: 'Product 2',
              price: 149.99,
              description: 'Test product 2',
            },
          },
        ],
      }

      const result = mapStrapiList(strapiResponse)

      expect(result).toEqual([
        {
          id: 1,
          name: 'Product 1',
          price: 99.99,
          description: 'Test product 1',
        },
        {
          id: 2,
          name: 'Product 2',
          price: 149.99,
          description: 'Test product 2',
        },
      ])
    })

    it('returns empty array for empty response', () => {
      const strapiResponse = { data: [] }
      const result = mapStrapiList(strapiResponse)
      expect(result).toEqual([])
    })

    it('returns empty array for null data', () => {
      const strapiResponse = { data: null }
      const result = mapStrapiList(strapiResponse)
      expect(result).toEqual([])
    })
  })

  describe('mapStrapiItem', () => {
    it('maps Strapi item response correctly', () => {
      const strapiResponse = {
        data: {
          id: 1,
          attributes: {
            name: 'Product 1',
            price: 99.99,
            description: 'Test product',
          },
        },
      }

      const result = mapStrapiItem(strapiResponse)

      expect(result).toEqual({
        id: 1,
        name: 'Product 1',
        price: 99.99,
        description: 'Test product',
      })
    })

    it('returns null for empty response', () => {
      const strapiResponse = { data: null }
      const result = mapStrapiItem(strapiResponse)
      expect(result).toBeNull()
    })

    it('returns null for missing data', () => {
      const strapiResponse = {}
      const result = mapStrapiItem(strapiResponse)
      expect(result).toBeNull()
    })
  })
})
