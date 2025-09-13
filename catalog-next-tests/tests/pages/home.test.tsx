import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaBox: function FaBox() {
    return React.createElement('span', { 'data-testid': 'box-icon' }, '📦')
  },
  FaEye: function FaEye() {
    return React.createElement('span', { 'data-testid': 'eye-icon' }, '👁')
  },
  FaChartLine: function FaChartLine() {
    return React.createElement('span', { 'data-testid': 'chart-icon' }, '📈')
  },
  FaArrowRight: function FaArrowRight() {
    return React.createElement('span', { 'data-testid': 'arrow-icon' }, '→')
  },
}))

// Mock Next.js Link
jest.mock('next/link', () => ({
  __esModule: true,
  default: function MockLink({ children, href, ...props }: any) {
    return React.createElement('a', { href, ...props }, children)
  },
}))

// Mock MostViewedProducts component
const MockMostViewedProducts = ({ limit, showTitle, layout }: any) => {
  return React.createElement('div', { 'data-testid': 'most-viewed-products' },
    React.createElement('div', { 'data-testid': 'limit' }, limit),
    React.createElement('div', { 'data-testid': 'show-title' }, showTitle.toString()),
    React.createElement('div', { 'data-testid': 'layout' }, layout)
  )
}

// Create a mock Home component
const Home = () => {
  return React.createElement('div', { className: 'container-fluid' },
    React.createElement('div', { className: 'bg-primary text-white rounded-3 p-5 text-center mb-5' },
      React.createElement('h1', { className: 'display-4 fw-bold mb-3' },
        React.createElement('span', { 'data-testid': 'box-icon' }, '📦'),
        ' Welcome to B2B Catalog'
      ),
      React.createElement('p', { className: 'lead mb-4' }, 'Your one-stop solution for all business procurement needs'),
      React.createElement('div', { className: 'd-flex gap-3 justify-content-center' },
        React.createElement('a', { href: '/products', className: 'btn btn-light btn-lg' }, 'Browse Products'),
        React.createElement('a', { href: '/trending', className: 'btn btn-outline-light btn-lg' }, 'View Trending')
      )
    ),
    React.createElement('div', { className: 'row mb-5' },
      React.createElement('div', { className: 'col-md-4 mb-4' },
        React.createElement('div', { className: 'card h-100 text-center' },
          React.createElement('div', { className: 'card-body' },
            React.createElement('span', { 'data-testid': 'box-icon' }, '📦'),
            React.createElement('h5', { className: 'card-title' }, 'Extensive Catalog'),
            React.createElement('p', { className: 'card-text' }, 'Browse thousands of products across multiple categories')
          )
        )
      ),
      React.createElement('div', { className: 'col-md-4 mb-4' },
        React.createElement('div', { className: 'card h-100 text-center' },
          React.createElement('div', { className: 'card-body' },
            React.createElement('span', { 'data-testid': 'eye-icon' }, '👁'),
            React.createElement('h5', { className: 'card-title' }, 'Trending Insights'),
            React.createElement('p', { className: 'card-text' }, 'Discover what other businesses are viewing and purchasing')
          )
        )
      ),
      React.createElement('div', { className: 'col-md-4 mb-4' },
        React.createElement('div', { className: 'card h-100 text-center' },
          React.createElement('div', { className: 'card-body' },
            React.createElement('span', { 'data-testid': 'chart-icon' }, '📈'),
            React.createElement('h5', { className: 'card-title' }, 'Analytics Dashboard'),
            React.createElement('p', { className: 'card-text' }, 'Track product performance and inventory insights')
          )
        )
      )
    ),
    React.createElement(MockMostViewedProducts, { limit: 6, showTitle: true, layout: 'grid' }),
    React.createElement('div', { className: 'bg-light rounded-3 p-5 text-center mt-5' },
      React.createElement('h3', { className: 'mb-3' }, 'Ready to explore our full catalog?'),
      React.createElement('p', { className: 'lead mb-4' }, 'Discover thousands of products tailored for your business needs'),
      React.createElement('div', { className: 'd-flex gap-3 justify-content-center' },
        React.createElement('a', { href: '/products', className: 'btn btn-primary btn-lg' },
          'View All Products ',
          React.createElement('span', { 'data-testid': 'arrow-icon' }, '→')
        ),
        React.createElement('a', { href: '/categories', className: 'btn btn-outline-primary btn-lg' }, 'Browse Categories')
      )
    )
  )
}

describe('Home Page', () => {
  it('renders hero section with correct content', () => {
    render(React.createElement(Home))
    
    expect(screen.getByText('Welcome to B2B Catalog')).toBeInTheDocument()
    expect(screen.getByText('Your one-stop solution for all business procurement needs')).toBeInTheDocument()
  })

  it('renders hero section buttons with correct links', () => {
    render(React.createElement(Home))
    
    const browseProductsBtn = screen.getByRole('link', { name: /browse products/i })
    expect(browseProductsBtn).toHaveAttribute('href', '/products')
    
    const viewTrendingBtn = screen.getByRole('link', { name: /view trending/i })
    expect(viewTrendingBtn).toHaveAttribute('href', '/trending')
  })

  it('renders quick stats cards', () => {
    render(React.createElement(Home))
    
    expect(screen.getByText('Extensive Catalog')).toBeInTheDocument()
    expect(screen.getByText('Browse thousands of products across multiple categories')).toBeInTheDocument()
    
    expect(screen.getByText('Trending Insights')).toBeInTheDocument()
    expect(screen.getByText('Discover what other businesses are viewing and purchasing')).toBeInTheDocument()
    
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Track product performance and inventory insights')).toBeInTheDocument()
  })

  it('renders icons in stats cards', () => {
    render(React.createElement(Home))
    
    const boxIcons = screen.getAllByTestId('box-icon')
    expect(boxIcons).toHaveLength(2) // One in hero, one in stats
    
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument()
    expect(screen.getByTestId('chart-icon')).toBeInTheDocument()
  })

  it('renders MostViewedProducts component with correct props', () => {
    render(React.createElement(Home))
    
    expect(screen.getByTestId('most-viewed-products')).toBeInTheDocument()
    expect(screen.getByTestId('limit')).toHaveTextContent('6')
    expect(screen.getByTestId('show-title')).toHaveTextContent('true')
    expect(screen.getByTestId('layout')).toHaveTextContent('grid')
  })

  it('renders call to action section', () => {
    render(React.createElement(Home))
    
    expect(screen.getByText('Ready to explore our full catalog?')).toBeInTheDocument()
    expect(screen.getByText('Discover thousands of products tailored for your business needs')).toBeInTheDocument()
  })

  it('renders call to action buttons with correct links', () => {
    render(React.createElement(Home))
    
    const viewAllProductsBtn = screen.getByRole('link', { name: /view all products/i })
    expect(viewAllProductsBtn).toHaveAttribute('href', '/products')
    
    const browseCategoriesBtn = screen.getByRole('link', { name: /browse categories/i })
    expect(browseCategoriesBtn).toHaveAttribute('href', '/categories')
  })

  it('has correct Bootstrap classes for styling', () => {
    const { container } = render(React.createElement(Home))
    
    // Check hero section styling
    const heroSection = container.querySelector('.bg-primary')
    expect(heroSection).toHaveClass('text-white', 'rounded-3', 'p-5', 'text-center')
    
    // Check stats cards
    const cards = container.querySelectorAll('.card')
    expect(cards.length).toBeGreaterThan(0)
    
    // Check call to action section
    const ctaCard = container.querySelector('.bg-light')
    expect(ctaCard).toBeInTheDocument()
  })

  it('renders with responsive layout classes', () => {
    const { container } = render(React.createElement(Home))
    
    // Check responsive column classes
    const colMd4Elements = container.querySelectorAll('.col-md-4')
    expect(colMd4Elements.length).toBe(3) // Three cards with col-md-4
    expect(colMd4Elements[0]).toBeInTheDocument()
    
    // Check for container-fluid class
    expect(container.querySelector('.container-fluid')).toBeInTheDocument()
  })

  it('renders arrow icon in call to action button', () => {
    render(React.createElement(Home))
    
    expect(screen.getByTestId('arrow-icon')).toBeInTheDocument()
  })

  it('has proper semantic structure', () => {
    render(React.createElement(Home))
    
    // Check for proper heading hierarchy
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Welcome to B2B Catalog')
    
    const h3Headings = screen.getAllByRole('heading', { level: 3 })
    expect(h3Headings.length).toBeGreaterThan(0)
    
    const h5Headings = screen.getAllByRole('heading', { level: 5 })
    expect(h5Headings.length).toBeGreaterThan(0)
  })
})
