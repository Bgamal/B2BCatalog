'use client';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface ProductImageSliderProps {
  images: Array<{
    id: number;
    url: string;
  }>;
  productName: string;
}

const ProductImageSlider = ({ images, productName }: ProductImageSliderProps) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    arrows: true,
    className: 'product-slider'
  };

  if (!images || images.length === 0) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ height: '500px' }}>
        <div className="text-muted">No images available</div>
      </div>
    );
  }

  return (
    <Slider {...settings}>
      {images.map((image, index) => (
        <div key={image.id || index} className="d-flex justify-content-center p-3" style={{ height: '500px' }}>
          <img 
            src={`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:1337'}${image.url}`} 
            alt={`${productName} - ${index + 1}`}
            className="img-fluid"
            style={{ 
              maxHeight: '100%', 
              maxWidth: '100%',
              objectFit: 'contain',
              margin: '0 auto'
            }}
          />
        </div>
      ))}
    </Slider>
  );
};

export default ProductImageSlider;
