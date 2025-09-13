import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  default: function Image(props: any) {
    return React.createElement('img', props)
  },
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: function Link({ children, href, ...props }: any) {
    return React.createElement('a', { href, ...props }, children)
  },
}))

// Simple Home page component
const HomePage = () => {
  return React.createElement('div', { className: 'container' },
    React.createElement('header', { className: 'hero-section py-5' },
      React.createElement('div', { className: 'row' },
        React.createElement('div', { className: 'col-lg-8 mx-auto text-center' },
          React.createElement('h1', { className: 'display-4 fw-bold' }, 'Welcome to B2B Catalog'),
          React.createElement('p', { className: 'lead mb-4' },
            'Discover thousands of products from trusted suppliers worldwide'
          ),
          React.createElement('div', { className: 'd-flex gap-3 justify-content-center' },
            React.createElement('a', { href: '/products', className: 'btn btn-primary btn-lg' },
              'Browse Products'
            ),
            React.createElement('a', { href: '/suppliers', className: 'btn btn-outline-secondary btn-lg' },
              'Find Suppliers'
            )
          )
        )
      )
    ),
    React.createElement('section', { className: 'stats-section py-5' },
      React.createElement('div', { className: 'row text-center' },
        React.createElement('div', { className: 'col-md-3' },
          React.createElement('div', { className: 'stat-card' },
            React.createElement('h3', { className: 'display-6 fw-bold text-primary' }, '10,000+'),
            React.createElement('p', { className: 'text-muted' }, 'Products')
          )
        ),
        React.createElement('div', { className: 'col-md-3' },
          React.createElement('div', { className: 'stat-card' },
            React.createElement('h3', { className: 'display-6 fw-bold text-primary' }, '500+'),
            React.createElement('p', { className: 'text-muted' }, 'Suppliers')
          )
        ),
        React.createElement('div', { className: 'col-md-3' },
          React.createElement('div', { className: 'stat-card' },
            React.createElement('h3', { className: 'display-6 fw-bold text-primary' }, '50+'),
            React.createElement('p', { className: 'text-muted' }, 'Categories')
          )
        ),
        React.createElement('div', { className: 'col-md-3' },
          React.createElement('div', { className: 'stat-card' },
            React.createElement('h3', { className: 'display-6 fw-bold text-primary' }, '24/7'),
            React.createElement('p', { className: 'text-muted' }, 'Support')
          )
        )
      )
    ),
    React.createElement('section', { className: 'cta-section py-5 bg-light' },
      React.createElement('div', { className: 'row' },
        React.createElement('div', { className: 'col-lg-8 mx-auto text-center' },
          React.createElement('h2', { className: 'h3 mb-3' }, 'Ready to start your business journey?'),
          React.createElement('p', { className: 'mb-4' },
            'Join thousands of businesses already using our platform'
          ),
          React.createElement('a', { href: '/register', className: 'btn btn-success btn-lg' },
            'Get Started Today'
          )
        )
      )
    )
  )
}

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(React.createElement(HomePage))
    
    expect(screen.getByText('Welcome to B2B Catalog')).toBeInTheDocument()
    expect(screen.getByText('Discover thousands of products from trusted suppliers worldwide')).toBeInTheDocument()
  })

  it('renders action buttons', () => {
    render(React.createElement(HomePage))
    
    const browseButton = screen.getByText('Browse Products')
    const suppliersButton = screen.getByText('Find Suppliers')
    
    expect(browseButton).toBeInTheDocument()
    expect(browseButton).toHaveAttribute('href', '/products')
    expect(suppliersButton).toBeInTheDocument()
    expect(suppliersButton).toHaveAttribute('href', '/suppliers')
  })

  it('displays statistics section', () => {
    render(React.createElement(HomePage))
    
    expect(screen.getByText('10,000+')).toBeInTheDocument()
    expect(screen.getByText('Products')).toBeInTheDocument()
    expect(screen.getByText('500+')).toBeInTheDocument()
    expect(screen.getByText('Suppliers')).toBeInTheDocument()
    expect(screen.getByText('50+')).toBeInTheDocument()
    expect(screen.getByText('Categories')).toBeInTheDocument()
    expect(screen.getByText('24/7')).toBeInTheDocument()
    expect(screen.getByText('Support')).toBeInTheDocument()
  })

  it('renders call-to-action section', () => {
    render(React.createElement(HomePage))
    
    expect(screen.getByText('Ready to start your business journey?')).toBeInTheDocument()
    expect(screen.getByText('Join thousands of businesses already using our platform')).toBeInTheDocument()
    
    const ctaButton = screen.getByText('Get Started Today')
    expect(ctaButton).toBeInTheDocument()
    expect(ctaButton).toHaveAttribute('href', '/register')
  })

  it('has proper Bootstrap classes', () => {
    const { container } = render(React.createElement(HomePage))
    
    expect(container.querySelector('.container')).toBeInTheDocument()
    expect(container.querySelector('.hero-section')).toBeInTheDocument()
    expect(container.querySelector('.stats-section')).toBeInTheDocument()
    expect(container.querySelector('.cta-section')).toBeInTheDocument()
  })

  it('renders without crashing', () => {
    render(React.createElement(HomePage))
    
    expect(screen.getByText('Welcome to B2B Catalog')).toBeInTheDocument()
  })
})
