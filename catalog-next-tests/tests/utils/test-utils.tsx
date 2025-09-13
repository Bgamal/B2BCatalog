import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import 'bootstrap/dist/css/bootstrap.min.css'

// Mock Bootstrap components that might cause issues in tests
jest.mock('react-bootstrap', () => ({
  ...jest.requireActual('react-bootstrap'),
  Carousel: function Carousel({ children, ...props }: any) {
    return React.createElement('div', { 'data-testid': 'carousel', ...props }, children)
  },
  Modal: function Modal({ children, show, ...props }: any) {
    return show ? React.createElement('div', { 'data-testid': 'modal', ...props }, children) : null
  },
}))

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return React.createElement('div', null, children)
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Common test data
export const mockProduct = {
  id: 1,
  name: 'Test Product',
  description: 'Test product description',
  price: 99.99,
  category: 'Electronics',
  supplier: 'Test Supplier',
  image: '/test-image.jpg',
  images: ['/test-image1.jpg', '/test-image2.jpg'],
  stock: 10,
  featured: true,
}

export const mockCategory = {
  id: 1,
  name: 'Electronics',
  description: 'Electronic products',
  slug: 'electronics',
}

export const mockSupplier = {
  id: 1,
  name: 'Test Supplier',
  email: 'supplier@test.com',
  phone: '+1234567890',
  address: '123 Test Street',
}

export const mockStrapiResponse = <T,>(data: T) => ({
  data,
  meta: {
    pagination: {
      page: 1,
      pageSize: 25,
      pageCount: 1,
      total: 1,
    },
  },
})

export const mockStrapiItem = (id: number, attributes: any) => ({
  id,
  attributes,
})

// Helper to create mock API responses
export const createMockApiResponse = (data: any, isArray = false) => {
  if (isArray) {
    return mockStrapiResponse(data)
  }
  return mockStrapiResponse(data)
}

// Mock fetch responses
export const mockFetchSuccess = (data: any) => {
  (globalThis as any).fetchMock.mockResponseOnce(JSON.stringify(data))
}

export const mockFetchError = (status = 500, message = 'Server Error') => {
  (globalThis as any).fetchMock.mockRejectOnce(new Error(message))
}

// Wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0))
