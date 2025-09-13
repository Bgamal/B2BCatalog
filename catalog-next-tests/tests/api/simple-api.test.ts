import '@testing-library/jest-dom'

// Mock fetch for API testing
global.fetch = jest.fn()

const mockFetch = fetch as jest.MockedFunction<typeof fetch>

// Simple API service class
class SimpleApiService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async get(endpoint: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  }

  async post(endpoint: string, data: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  }
}

describe('Simple API Service', () => {
  let apiService: SimpleApiService
  const baseUrl = 'https://api.example.com'

  beforeEach(() => {
    apiService = new SimpleApiService(baseUrl)
    mockFetch.mockClear()
  })

  describe('GET requests', () => {
    it('makes successful GET request', async () => {
      const mockData = { id: 1, name: 'Test Product' }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response)

      const result = await apiService.get('/products/1')

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/products/1')
      expect(result).toEqual(mockData)
    })

    it('handles GET request errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response)

      await expect(apiService.get('/products/999')).rejects.toThrow('HTTP error! status: 404')
    })
  })

  describe('POST requests', () => {
    it('makes successful POST request', async () => {
      const postData = { name: 'New Product', price: 99.99 }
      const mockResponse = { id: 2, ...postData }
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response)

      const result = await apiService.post('/products', postData)

      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })
      expect(result).toEqual(mockResponse)
    })

    it('handles POST request errors', async () => {
      const postData = { name: 'Invalid Product' }
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
      } as Response)

      await expect(apiService.post('/products', postData)).rejects.toThrow('HTTP error! status: 400')
    })
  })

  describe('Network errors', () => {
    it('handles network failures', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(apiService.get('/products')).rejects.toThrow('Network error')
    })
  })
})
