import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

// Create a mock ThemeInitializer component
const ThemeInitializer = ({ children }: { children?: React.ReactNode }) => {
  React.useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('theme')
      let theme = storedTheme
      
      if (!theme) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        theme = prefersDark ? 'dark' : 'light'
      }
      
      document.documentElement.setAttribute('data-bs-theme', theme)
    } catch (error) {
      console.error('Error initializing theme:', error)
    }
  }, [])

  return children ? React.createElement(React.Fragment, null, children) : null
}

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

describe('ThemeInitializer Component', () => {
  const mockMatchMedia = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
    
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    })
    
    mockMatchMedia.mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))

    // Mock document.documentElement.setAttribute
    document.documentElement.setAttribute = jest.fn()
  })

  it('renders children when provided', () => {
    const TestChild = () => React.createElement('div', { 'data-testid': 'test-child' }, 'Test Child')
    
    render(
      React.createElement(ThemeInitializer, null,
        React.createElement(TestChild)
      )
    )
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument()
  })

  it('returns null when no children provided', () => {
    const { container } = render(React.createElement(ThemeInitializer))
    expect(container.firstChild).toBeNull()
  })

  it('sets light theme when no stored theme and system prefers light', async () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    mockMatchMedia.mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)' ? false : true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))

    render(React.createElement(ThemeInitializer))

    await waitFor(() => {
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-bs-theme', 'light')
    })
  })

  it('sets dark theme when no stored theme and system prefers dark', async () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    mockMatchMedia.mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)' ? true : false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))

    render(React.createElement(ThemeInitializer))

    await waitFor(() => {
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-bs-theme', 'dark')
    })
  })

  it('uses stored theme when available', async () => {
    mockLocalStorage.getItem.mockReturnValue('dark')

    render(React.createElement(ThemeInitializer))

    await waitFor(() => {
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-bs-theme', 'dark')
    })
  })

  it('prioritizes stored theme over system preference', async () => {
    mockLocalStorage.getItem.mockReturnValue('light')
    mockMatchMedia.mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)' ? true : false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))

    render(React.createElement(ThemeInitializer))

    await waitFor(() => {
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-bs-theme', 'light')
    })
  })

  it('handles localStorage errors gracefully', async () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('localStorage error')
    })

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    render(React.createElement(ThemeInitializer))

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error initializing theme:', expect.any(Error))
    })

    consoleSpy.mockRestore()
  })

  it('calls localStorage.getItem with correct key', async () => {
    render(React.createElement(ThemeInitializer))

    await waitFor(() => {
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('theme')
    })
  })

  it('calls matchMedia with correct query', async () => {
    render(React.createElement(ThemeInitializer))

    await waitFor(() => {
      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
    })
  })
})
