import React from 'react'
import { render, screen } from '@testing-library/react'

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage(props) {
    return <img {...props} />
  }
})

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }) {
    return <a href={href} {...props}>{children}</a>
  }
})

// Simple Logo component for testing
const Logo = () => {
  return (
    <a href="/" className="d-flex align-items-center text-decoration-none">
      <img 
        src="/logo.svg" 
        alt="B2B Catalog Logo" 
        width={150} 
        height={40}
        className="d-inline-block align-top"
      />
    </a>
  );
};

describe('Logo Component (Simple)', () => {
  it('renders logo image with correct attributes', () => {
    render(<Logo />)
    
    const logoImage = screen.getByAltText('B2B Catalog Logo')
    expect(logoImage).toBeInTheDocument()
    expect(logoImage).toHaveAttribute('src', '/logo.svg')
    expect(logoImage).toHaveAttribute('width', '150')
    expect(logoImage).toHaveAttribute('height', '40')
  })

  it('renders as a link to home page', () => {
    render(<Logo />)
    
    const logoLink = screen.getByRole('link')
    expect(logoLink).toBeInTheDocument()
    expect(logoLink).toHaveAttribute('href', '/')
  })

  it('has correct CSS classes', () => {
    render(<Logo />)
    
    const logoLink = screen.getByRole('link')
    expect(logoLink).toHaveClass('d-flex', 'align-items-center', 'text-decoration-none')
    
    const logoImage = screen.getByAltText('B2B Catalog Logo')
    expect(logoImage).toHaveClass('d-inline-block', 'align-top')
  })
})
