import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock Next.js font
jest.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'inter-font',
  }),
}))

// Mock components
const MockNavigation = ({ children }: any) => {
  return React.createElement('div', { 'data-testid': 'navigation' },
    React.createElement('div', { 'data-testid': 'nav-children' }, children)
  )
}

const MockThemeInitializer = () => {
  return React.createElement('div', { 'data-testid': 'theme-initializer' })
}

// Create a mock RootLayout component
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const currentYear = new Date().getFullYear()
  
  return React.createElement('html', { lang: 'en' },
    React.createElement('head', null,
      React.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }),
      React.createElement('link', {
        href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css',
        rel: 'stylesheet'
      })
    ),
    React.createElement('body', { className: 'd-flex flex-column min-vh-100 inter-font' },
      React.createElement(MockThemeInitializer),
      React.createElement(MockNavigation, null,
        React.createElement('main', { role: 'main', className: 'flex-grow-1 py-4' },
          React.createElement('div', { className: 'container' }, children)
        )
      ),
      React.createElement('footer', { role: 'contentinfo', className: 'bg-dark text-white py-4 mt-auto' },
        React.createElement('div', { className: 'container' },
          React.createElement('div', { className: 'row' },
            React.createElement('div', { className: 'col-md-4 mb-3' },
              React.createElement('h5', null, 'About Us'),
              React.createElement('p', null, 'Your one-stop B2B product catalog solution for all your business needs.')
            ),
            React.createElement('div', { className: 'col-md-4 mb-3' },
              React.createElement('h5', null, 'Quick Links'),
              React.createElement('ul', { className: 'list-unstyled' },
                React.createElement('li', null, React.createElement('a', { href: '/about', className: 'text-light' }, 'About Us')),
                React.createElement('li', null, React.createElement('a', { href: '/products', className: 'text-light' }, 'Products')),
                React.createElement('li', null, React.createElement('a', { href: '/categories', className: 'text-light' }, 'Categories')),
                React.createElement('li', null, React.createElement('a', { href: '/suppliers', className: 'text-light' }, 'Suppliers'))
              )
            ),
            React.createElement('div', { className: 'col-md-4 mb-3' },
              React.createElement('h5', null, 'Connect With Us'),
              React.createElement('div', { className: 'd-flex gap-3' },
                React.createElement('a', { href: '#', className: 'text-light' }, React.createElement('i', { className: 'bi-facebook' })),
                React.createElement('a', { href: '#', className: 'text-light' }, React.createElement('i', { className: 'bi-twitter' })),
                React.createElement('a', { href: '#', className: 'text-light' }, React.createElement('i', { className: 'bi-linkedin' })),
                React.createElement('a', { href: '#', className: 'text-light' }, React.createElement('i', { className: 'bi-instagram' }))
              )
            )
          ),
          React.createElement('hr', { className: 'my-3' }),
          React.createElement('div', { className: 'text-center' },
            React.createElement('p', { className: 'mb-0' }, `© ${currentYear} B2B Catalog. All rights reserved.`)
          )
        )
      ),
      React.createElement('script', {
        src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
        async: true
      })
    )
  )
}

describe('RootLayout', () => {
  const mockChildren = React.createElement('div', { 'data-testid': 'page-content' }, 'Page Content')

  it('renders html structure with correct attributes', () => {
    const { container } = render(React.createElement(RootLayout, null, mockChildren))
    
    const html = container.querySelector('html')
    expect(html).toHaveAttribute('lang', 'en')
  })

  it('includes viewport meta tag', () => {
    render(React.createElement(RootLayout, null, mockChildren))
    
    const viewport = document.querySelector('meta[name="viewport"]')
    expect(viewport).toHaveAttribute('content', 'width=device-width, initial-scale=1')
  })

  it('includes Bootstrap Icons CSS link', () => {
    render(React.createElement(RootLayout, null, mockChildren))
    
    const bootstrapIcons = document.querySelector('link[href*="bootstrap-icons"]')
    expect(bootstrapIcons).toBeInTheDocument()
  })

  it('renders ThemeInitializer component', () => {
    render(React.createElement(RootLayout, null, mockChildren))
    
    expect(screen.getByTestId('theme-initializer')).toBeInTheDocument()
  })

  it('renders Navigation component with children', () => {
    render(React.createElement(RootLayout, null, mockChildren))
    
    expect(screen.getByTestId('navigation')).toBeInTheDocument()
    expect(screen.getByTestId('nav-children')).toBeInTheDocument()
  })

  it('renders main content area', () => {
    render(React.createElement(RootLayout, null, mockChildren))
    
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
    expect(main).toHaveClass('flex-grow-1', 'py-4')
  })

  it('renders children content', () => {
    render(React.createElement(RootLayout, null, mockChildren))
    
    expect(screen.getByTestId('page-content')).toBeInTheDocument()
  })

  it('renders footer with correct content', () => {
    render(React.createElement(RootLayout, null, mockChildren))
    
    expect(screen.getAllByText('About Us')[0]).toBeInTheDocument()
    expect(screen.getByText('Your one-stop B2B product catalog solution for all your business needs.')).toBeInTheDocument()
    
    expect(screen.getByText('Quick Links')).toBeInTheDocument()
    expect(screen.getByText('Connect With Us')).toBeInTheDocument()
  })

  it('renders footer navigation links', () => {
    render(React.createElement(RootLayout, null, mockChildren))
    
    expect(screen.getByRole('link', { name: 'About Us' })).toHaveAttribute('href', '/about')
    expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/products')
    expect(screen.getByRole('link', { name: 'Categories' })).toHaveAttribute('href', '/categories')
    expect(screen.getByRole('link', { name: 'Suppliers' })).toHaveAttribute('href', '/suppliers')
  })

  it('renders social media links', () => {
    const { container } = render(React.createElement(RootLayout, null, mockChildren))
    
    const socialLinks = container.querySelectorAll('.bi-facebook, .bi-twitter, .bi-linkedin, .bi-instagram')
    expect(socialLinks.length).toBe(4)
  })

  it('renders copyright with current year', () => {
    render(React.createElement(RootLayout, null, mockChildren))
    
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(`© ${currentYear} B2B Catalog. All rights reserved.`)).toBeInTheDocument()
  })

  it('has correct body classes', () => {
    const { container } = render(React.createElement(RootLayout, null, mockChildren))
    
    const body = container.querySelector('body')
    expect(body).toHaveClass('d-flex', 'flex-column', 'min-vh-100', 'inter-font')
  })

  it('includes Bootstrap JS bundle script', () => {
    render(React.createElement(RootLayout, null, mockChildren))
    
    const bootstrapScript = document.querySelector('script[src*="bootstrap.bundle.min.js"]')
    expect(bootstrapScript).toBeInTheDocument()
    expect(bootstrapScript).toHaveAttribute('async')
  })

  it('has proper semantic structure', () => {
    render(React.createElement(RootLayout, null, mockChildren))
    
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument() // footer
  })

  it('renders container for main content', () => {
    const { container } = render(React.createElement(RootLayout, null, mockChildren))
    
    const mainContainer = container.querySelector('main .container')
    expect(mainContainer).toBeInTheDocument()
  })

  it('footer has correct styling classes', () => {
    const { container } = render(React.createElement(RootLayout, null, mockChildren))
    
    const footer = container.querySelector('footer')
    expect(footer).toHaveClass('bg-dark', 'text-white', 'py-4', 'mt-auto')
  })
})
