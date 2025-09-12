'use client';

import { useEffect, useState } from 'react';
import { FaEye, FaFire, FaChartLine } from 'react-icons/fa';

const API = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:1337') + '/api';

type Product = {
  id: number;
  name: string;
  sku: string;
  price: number;
  viewCount?: number;
  images?: Array<{
    id: number;
    url: string;
  }>;
  category?: {
    data: {
      id: number;
      attributes: {
        name: string;
      };
    } | null;
  };
};

interface MostViewedProductsProps {
  limit?: number;
  showTitle?: boolean;
  layout?: 'grid' | 'list';
  className?: string;
}

export default function MostViewedProducts({ 
  limit = 6, 
  showTitle = true, 
  layout = 'grid',
  className = '' 
}: MostViewedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMostViewedProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API}/products?sort=viewCount:desc&populate=*&pagination[pageSize]=${limit}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        const mappedProducts = (data?.data ?? []).map((item: any) => ({
          id: item.id,
          name: item.attributes?.name || item.name,
          sku: item.attributes?.sku || item.sku,
          price: item.attributes?.price || item.price || 0,
          viewCount: item.attributes?.viewCount || item.viewCount || 0,
          images: item.attributes?.images || item.images,
          category: item.attributes?.category || item.category
        }));
        
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Error fetching most viewed products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMostViewedProducts();
  }, [limit]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getImageUrl = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:1337'}${product.images[0].url}`;
    }
    return '/placeholder-product.png';
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        {showTitle && (
          <div className="d-flex align-items-center mb-4">
            <FaFire className="text-danger me-2" size={24} />
            <h2 className="h4 mb-0">Most Viewed Products</h2>
          </div>
        )}
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`${className}`}>
        {showTitle && (
          <div className="d-flex align-items-center mb-4">
            <FaFire className="text-danger me-2" size={24} />
            <h2 className="h4 mb-0">Most Viewed Products</h2>
          </div>
        )}
        <div className="text-center py-5 text-muted">
          <FaEye size={48} className="mb-3 opacity-50" />
          <p>No products found</p>
        </div>
      </div>
    );
  }

  if (layout === 'list') {
    return (
      <div className={`${className}`}>
        {showTitle && (
          <div className="d-flex align-items-center mb-4">
            <FaFire className="text-danger me-2" size={24} />
            <h2 className="h4 mb-0">Most Viewed Products</h2>
          </div>
        )}
        <div className="list-group">
          {products.map((product, index) => (
            <a
              key={product.id}
              href={`/product/${product.id}`}
              className="list-group-item list-group-item-action d-flex align-items-center p-3"
            >
              <div className="position-relative me-3">
                <img
                  src={getImageUrl(product)}
                  alt={product.name}
                  className="rounded"
                  style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                />
                {index < 3 && (
                  <span className="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger">
                    {index + 1}
                  </span>
                )}
              </div>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="mb-1">{product.name}</h6>
                    <p className="mb-1 text-muted small">SKU: {product.sku}</p>
                    <div className="d-flex align-items-center">
                      <FaEye className="text-muted me-1" size={12} />
                      <small className="text-muted">{product.viewCount || 0} views</small>
                      {index < 3 && <FaChartLine className="text-success ms-2" size={12} />}
                    </div>
                  </div>
                  <div className="text-end">
                    <strong className="text-primary">{formatCurrency(product.price)}</strong>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {showTitle && (
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center">
            <FaFire className="text-danger me-2" size={24} />
            <h2 className="h4 mb-0">Most Viewed Products</h2>
          </div>
          <a href="/trending" className="btn btn-outline-primary btn-sm">
            View All
          </a>
        </div>
      )}
      <div className="row g-4">
        {products.map((product, index) => (
          <div key={product.id} className="col-lg-4 col-md-6">
            <div className="card h-100 shadow-sm position-relative">
              {index < 3 && (
                <div className="position-absolute top-0 start-0 z-3">
                  <span className="badge bg-danger rounded-0 rounded-end">
                    <FaFire className="me-1" size={12} />
                    #{index + 1}
                  </span>
                </div>
              )}
              <div className="position-relative">
                <img
                  src={getImageUrl(product)}
                  alt={product.name}
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="position-absolute bottom-0 end-0 m-2">
                  <span className="badge bg-dark bg-opacity-75 d-flex align-items-center">
                    <FaEye className="me-1" size={10} />
                    {product.viewCount || 0}
                  </span>
                </div>
              </div>
              <div className="card-body d-flex flex-column">
                <h6 className="card-title">{product.name}</h6>
                <p className="card-text text-muted small mb-2">SKU: {product.sku}</p>
                {product.category?.data && (
                  <span className="badge bg-light text-dark mb-2 align-self-start">
                    {product.category.data.attributes.name}
                  </span>
                )}
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <strong className="text-primary h5 mb-0">
                    {formatCurrency(product.price)}
                  </strong>
                  <a href={`/product/${product.id}`} className="btn btn-primary btn-sm">
                    View Details
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
