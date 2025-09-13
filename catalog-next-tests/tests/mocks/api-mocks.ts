import { mockStrapiResponse, mockStrapiItem } from '../utils/test-utils'

// Define ApiService interface locally to avoid import issues
interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

class ApiService {
  static async get<T>(endpoint: string): Promise<StrapiResponse<T>> {
    const response = await fetch(`http://localhost:1337/api${endpoint}`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    return response.json();
  }

  static async post<T>(endpoint: string, data: any): Promise<StrapiResponse<T>> {
    const response = await fetch(`http://localhost:1337/api${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    return response.json();
  }

  static async put<T>(endpoint: string, data: any): Promise<StrapiResponse<T>> {
    const response = await fetch(`http://localhost:1337/api${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    return response.json();
  }

  static async delete<T>(endpoint: string): Promise<void> {
    const response = await fetch(`http://localhost:1337/api${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
  }
}

// Mock API responses
export const mockProductsResponse = mockStrapiResponse([
  mockStrapiItem(1, {
    name: 'Laptop Pro',
    description: 'High-performance laptop',
    price: 1299.99,
    category: { data: mockStrapiItem(1, { name: 'Electronics' }) },
    supplier: { data: mockStrapiItem(1, { name: 'TechCorp' }) },
    images: [{ url: '/laptop1.jpg' }, { url: '/laptop2.jpg' }],
    stock: 15,
    featured: true,
  }),
  mockStrapiItem(2, {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse',
    price: 29.99,
    category: { data: mockStrapiItem(1, { name: 'Electronics' }) },
    supplier: { data: mockStrapiItem(2, { name: 'AccessoryCorp' }) },
    images: [{ url: '/mouse1.jpg' }],
    stock: 50,
    featured: false,
  }),
])

export const mockCategoriesResponse = mockStrapiResponse([
  mockStrapiItem(1, {
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    slug: 'electronics',
  }),
  mockStrapiItem(2, {
    name: 'Office Supplies',
    description: 'Office equipment and supplies',
    slug: 'office-supplies',
  }),
])

export const mockSuppliersResponse = mockStrapiResponse([
  mockStrapiItem(1, {
    name: 'TechCorp',
    email: 'contact@techcorp.com',
    phone: '+1-555-0123',
    address: '123 Tech Street, Silicon Valley, CA',
  }),
  mockStrapiItem(2, {
    name: 'AccessoryCorp',
    email: 'sales@accessorycorp.com',
    phone: '+1-555-0456',
    address: '456 Accessory Ave, New York, NY',
  }),
])

// Mock the ApiService class
export const mockApiService = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}

// Setup default mock implementations
export const setupApiMocks = () => {
  mockApiService.get.mockImplementation((endpoint: string) => {
    if (endpoint.includes('/products')) {
      return Promise.resolve(mockProductsResponse)
    }
    if (endpoint.includes('/categories')) {
      return Promise.resolve(mockCategoriesResponse)
    }
    if (endpoint.includes('/suppliers')) {
      return Promise.resolve(mockSuppliersResponse)
    }
    return Promise.reject(new Error('Unknown endpoint'))
  })

  mockApiService.post.mockResolvedValue(mockStrapiResponse(mockStrapiItem(1, {})))
  mockApiService.put.mockResolvedValue(mockStrapiResponse(mockStrapiItem(1, {})))
  mockApiService.delete.mockResolvedValue(undefined)
}

// Reset mocks
export const resetApiMocks = () => {
  Object.values(mockApiService).forEach(mock => {
    if (jest.isMockFunction(mock)) {
      mock.mockReset()
    }
  })
}
