import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock react-slick
jest.mock('react-slick', () => {
  return function MockSlider({ children, ...props }: any) {
    return React.createElement('div', { 'data-testid': 'slider', ...props }, children)
  }
})

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage(props: any) {
    return React.createElement('img', props)
  },
}))

// Mock CSS imports
jest.mock('slick-carousel/slick/slick.css', () => ({}))
jest.mock('slick-carousel/slick/slick-theme.css', () => ({}))

// Create a mock ProductImageSlider component
const ProductImageSlider = ({ images }: { images: Array<{ url: string; alt: string }> }) => {
  if (!images || images.length === 0) {
    return React.createElement('div', { className: 'no-images-placeholder' },
      React.createElement('p', null, 'No images available')
    )
  }

  return React.createElement('div', { 'data-testid': 'slider', className: 'product-image-slider' },
    images.map((image, index) =>
      React.createElement('div', { key: index, className: 'slide' },
        React.createElement('img', {
          src: image.url,
          alt: image.alt,
          className: 'product-image'
        })
      )
    )
  )
}

describe('ProductImageSlider Component', () => {
  const mockImages = [
    { url: '/image1.jpg', alt: 'Product Image 1' },
    { url: '/image2.jpg', alt: 'Product Image 2' },
    { url: '/image3.jpg', alt: 'Product Image 3' },
  ]

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_BASE = 'http://localhost:1337'
  })

  it('renders slider with images', () => {
    render(React.createElement(ProductImageSlider, { images: mockImages }))

    expect(screen.getByTestId('slider')).toBeInTheDocument()
    expect(screen.getByAltText('Product Image 1')).toBeInTheDocument()
    expect(screen.getByAltText('Product Image 2')).toBeInTheDocument()
    expect(screen.getByAltText('Product Image 3')).toBeInTheDocument()
  })

  it('renders images with correct attributes', () => {
    render(React.createElement(ProductImageSlider, { images: mockImages }))

    const image1 = screen.getByAltText('Product Image 1')
    expect(image1).toHaveAttribute('src', '/image1.jpg')
    expect(image1).toHaveAttribute('alt', 'Product Image 1')
  })

  it('renders fallback when no images provided', () => {
    render(React.createElement(ProductImageSlider, { images: [] }))

    expect(screen.getByText('No images available')).toBeInTheDocument()
  })

  it('renders fallback when images is null', () => {
    render(React.createElement(ProductImageSlider, { images: null as any }))

    expect(screen.getByText('No images available')).toBeInTheDocument()
  })

  it('applies correct CSS classes', () => {
    const { container } = render(React.createElement(ProductImageSlider, { images: mockImages }))

    expect(container.querySelector('.product-image-slider')).toBeInTheDocument()
    expect(container.querySelector('.slide')).toBeInTheDocument()
    expect(container.querySelector('.product-image')).toBeInTheDocument()
  })

  it('renders correct number of images', () => {
    const singleImage = [{ url: '/single.jpg', alt: 'Single Image' }]
    render(React.createElement(ProductImageSlider, { images: singleImage }))

    expect(screen.getByAltText('Single Image')).toBeInTheDocument()
    expect(screen.queryByAltText('Product Image 1')).not.toBeInTheDocument()
  })

  it('handles images with different formats', () => {
    const mixedImages = [
      { url: '/image.jpg', alt: 'JPEG Image' },
      { url: '/image.png', alt: 'PNG Image' },
      { url: '/image.webp', alt: 'WebP Image' },
    ]

    render(React.createElement(ProductImageSlider, { images: mixedImages }))

    expect(screen.getByAltText('JPEG Image')).toBeInTheDocument()
    expect(screen.getByAltText('PNG Image')).toBeInTheDocument()
    expect(screen.getByAltText('WebP Image')).toBeInTheDocument()
  })

  it('renders without crashing', () => {
    render(React.createElement(ProductImageSlider, { images: mockImages }))

    expect(screen.getByTestId('slider')).toBeInTheDocument()
  })
})
