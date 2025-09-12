'use client';

import { useEffect, useState } from 'react';
import { FaFire, FaEye, FaChartLine, FaFilter, FaSort } from 'react-icons/fa';

const API = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:1337') + '/api';

type Product = {
  id: number;
  name: string;
  sku: string;
  price: number;
  viewCount?: number;
  stock: number;
  images?: Array<{
    id: number;
    url: string;
  }>;
  category?: {
    data: {
      id: number;
      attributes: {
        name: string;
        slug: string;
      };
    } | null;
  };
  supplier?: {
    data: {
      id: number;
      attributes: {
        name: string;
      };
    } | null;
  };
};

type Category = {
  id: number;
  name: string;
};

export default function TrendingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('viewCount');
  const [timeFilter, setTimeFilter] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${API}/products?sort=${sortBy}:desc&populate=*&pagination[pageSize]=50`),
          fetch(`${API}/categories`)
        ]);
        
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        
        const mappedProducts = (productsData?.data ?? []).map((item: any) => ({
          id: item.id,
          name: item.attributes?.name || item.name,
          sku: item.attributes?.sku || item.sku,
          price: item.attributes?.price || item.price || 0,
          stock: item.attributes?.stock || item.stock || 0,
          viewCount: item.attributes?.viewCount || item.viewCount || 0,
          images: item.attributes?.images || item.images,
          category: item.attributes?.category || item.category,
          supplier: item.attributes?.supplier || item.supplier
        }));
        
        const mappedCategories = (categoriesData?.data ?? []).map((item: any) => ({
          id: item.id,
          name: item.attributes?.name || item.name
        }));
        
        setProducts(mappedProducts);
        setCategories(mappedCategories);
      } catch (error) {
        console.error('Error fetching trending products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sortBy]);

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category?.data?.attributes?.name === selectedCategory)
    : products;

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

  const getTrendingBadge = (index: number, viewCount: number) => {
    if (index === 0) return { text: 'Hot', color: 'bg-danger', icon: <FaFire /> };
    if (index < 3) return { text: 'Trending', color: 'bg-warning', icon: <FaChartLine /> };
    if (viewCount > 100) return { text: 'Popular', color: 'bg-info', icon: <FaEye /> };
    return null;
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading trending products...</span>
          </div>
          <p className="mt-2">Loading trending products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <FaFire className="text-danger me-3" size={32} />
              <div>
                <h1 className="h2 mb-1">Trending Products</h1>
                <p className="text-muted mb-0">Most viewed and popular items in our catalog</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row g-3 align-items-center">
                <div className="col-auto">
                  <FaFilter className="text-muted" />
                </div>
                <div className="col-md-3">
                  <label className="form-label small text-muted mb-1">Category</label>
                  <select
                    className="form-select form-select-sm"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label small text-muted mb-1">Sort By</label>
                  <select
                    className="form-select form-select-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="viewCount">Most Viewed</option>
                    <option value="price">Highest Price</option>
                    <option value="stock">Most Stock</option>
                    <option value="createdAt">Newest</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label small text-muted mb-1">Time Period</label>
                  <select
                    className="form-select form-select-sm"
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                  >
                    <option value="all">All Time</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
                <div className="col-auto">
                  <span className="badge bg-primary">{filteredProducts.length} products</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Trending Products */}
      {filteredProducts.length > 0 && (
        <div className="row mb-5">
          <div className="col-12">
            <h3 className="h5 mb-3 d-flex align-items-center">
              <FaChartLine className="text-success me-2" />
              Top Trending
            </h3>
            <div className="row g-4">
              {filteredProducts.slice(0, 3).map((product, index) => {
                const badge = getTrendingBadge(index, product.viewCount || 0);
                return (
                  <div key={product.id} className="col-lg-4">
                    <div className="card h-100 shadow position-relative">
                      {badge && (
                        <div className="position-absolute top-0 start-0 z-3">
                          <span className={`badge ${badge.color} rounded-0 rounded-end d-flex align-items-center`}>
                            {badge.icon}
                            <span className="ms-1">{badge.text}</span>
                          </span>
                        </div>
                      )}
                      <div className="position-relative">
                        <img
                          src={getImageUrl(product)}
                          alt={product.name}
                          className="card-img-top"
                          style={{ height: '250px', objectFit: 'cover' }}
                        />
                        <div className="position-absolute bottom-0 end-0 m-3">
                          <span className="badge bg-dark bg-opacity-75 d-flex align-items-center">
                            <FaEye className="me-1" size={12} />
                            {product.viewCount || 0} views
                          </span>
                        </div>
                      </div>
                      <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text text-muted small">SKU: {product.sku}</p>
                        {product.category?.data && (
                          <span className="badge bg-light text-dark mb-2">
                            {product.category.data.attributes.name}
                          </span>
                        )}
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <strong className="text-primary h4">
                            {formatCurrency(product.price)}
                          </strong>
                          <a href={`/products/${product.id}`} className="btn btn-primary">
                            View Product
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* All Trending Products */}
      <div className="row">
        <div className="col-12">
          <h3 className="h5 mb-3">All Trending Products</h3>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-5">
              <FaEye size={48} className="text-muted mb-3" />
              <h5 className="text-muted">No products found</h5>
              <p className="text-muted">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="row g-4">
              {filteredProducts.map((product, index) => {
                const badge = getTrendingBadge(index, product.viewCount || 0);
                return (
                  <div key={product.id} className="col-lg-3 col-md-4 col-sm-6">
                    <div className="card h-100 shadow-sm position-relative">
                      {badge && (
                        <div className="position-absolute top-0 start-0 z-3">
                          <span className={`badge ${badge.color} rounded-0 rounded-end`}>
                            {badge.text}
                          </span>
                        </div>
                      )}
                      <div className="position-relative">
                        <img
                          src={getImageUrl(product)}
                          alt={product.name}
                          className="card-img-top"
                          style={{ height: '180px', objectFit: 'cover' }}
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
                          <strong className="text-primary">
                            {formatCurrency(product.price)}
                          </strong>
                          <a href={`/products/${product.id}`} className="btn btn-primary btn-sm">
                            View
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
