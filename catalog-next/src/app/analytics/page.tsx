"use client";

import { useEffect, useState, useMemo } from 'react';
import { FaEye, FaBox, FaDollarSign, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

const API = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:1337') + '/api';

type Product = {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  viewCount?: number;
  rating?: number;
  category?: {
    data: {
      id: number;
      attributes: {
        name: string;
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

export default function AnalyticsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('viewCount');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${API}/products?populate=*&pagination[pageSize]=100`),
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
          rating: item.attributes?.rating || item.rating,
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
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const analytics = useMemo(() => {
    const filteredProducts = selectedCategory
      ? products.filter(p => p.category?.data?.attributes?.name === selectedCategory)
      : products;

    const totalProducts = filteredProducts.length;
    const totalValue = filteredProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const totalViews = filteredProducts.reduce((sum, p) => sum + (p.viewCount || 0), 0);
    const lowStockProducts = filteredProducts.filter(p => p.stock <= 5).length;
    const outOfStockProducts = filteredProducts.filter(p => p.stock === 0).length;
    const averagePrice = totalProducts > 0 ? filteredProducts.reduce((sum, p) => sum + p.price, 0) / totalProducts : 0;
    const averageRating = filteredProducts.filter(p => p.rating).length > 0
      ? filteredProducts.filter(p => p.rating).reduce((sum, p) => sum + (p.rating || 0), 0) / filteredProducts.filter(p => p.rating).length
      : 0;

    // Top performing products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case 'viewCount':
          return (b.viewCount || 0) - (a.viewCount || 0);
        case 'price':
          return b.price - a.price;
        case 'stock':
          return b.stock - a.stock;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return (b.viewCount || 0) - (a.viewCount || 0);
      }
    });

    // Category breakdown
    const categoryStats = categories.map(category => {
      const categoryProducts = filteredProducts.filter(
        p => p.category?.data?.attributes?.name === category.name
      );
      return {
        name: category.name,
        count: categoryProducts.length,
        totalValue: categoryProducts.reduce((sum, p) => sum + (p.price * p.stock), 0),
        totalViews: categoryProducts.reduce((sum, p) => sum + (p.viewCount || 0), 0)
      };
    }).filter(stat => stat.count > 0);

    return {
      totalProducts,
      totalValue,
      totalViews,
      lowStockProducts,
      outOfStockProducts,
      averagePrice,
      averageRating,
      topProducts: sortedProducts.slice(0, 10),
      categoryStats
    };
  }, [products, categories, selectedCategory, sortBy]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { variant: 'danger', text: 'Out of Stock', icon: <FaArrowDown /> };
    if (stock <= 5) return { variant: 'warning', text: 'Low Stock', icon: <FaMinus /> };
    return { variant: 'success', text: 'In Stock', icon: <FaArrowUp /> };
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading analytics...</span>
        </div>
        <p className="mt-2">Loading analytics data...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0">Product Analytics</h1>
        <div className="d-flex gap-3">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e: any) => setSelectedCategory(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            className="form-select"
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="viewCount">Most Viewed</option>
            <option value="price">Highest Price</option>
            <option value="stock">Most Stock</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <FaBox className="text-primary mb-2" size={24} />
              <h3 className="mb-1">{analytics.totalProducts}</h3>
              <p className="text-muted mb-0">Total Products</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <FaDollarSign className="text-success mb-2" size={24} />
              <h3 className="mb-1">{formatCurrency(analytics.totalValue)}</h3>
              <p className="text-muted mb-0">Inventory Value</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <FaEye className="text-info mb-2" size={24} />
              <h3 className="mb-1">{analytics.totalViews.toLocaleString()}</h3>
              <p className="text-muted mb-0">Total Views</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <FaArrowDown className="text-warning mb-2" size={24} />
              <h3 className="mb-1">{analytics.lowStockProducts}</h3>
              <p className="text-muted mb-0">Low Stock Items</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Top Products */}
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Top Performing Products</h5>
            </div>
            <div className="card-body p-0">
              <table className="table table-responsive table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Views</th>
                    <th>Rating</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topProducts.map((product) => {
                    const status = getStockStatus(product.stock);
                    return (
                      <tr key={product.id}>
                        <td>
                          <a href={`/product/${product.id}`} className="text-decoration-none fw-medium">
                            {product.name}
                          </a>
                        </td>
                        <td className="text-muted">{product.sku}</td>
                        <td>{formatCurrency(product.price)}</td>
                        <td>{product.stock}</td>
                        <td>
                          <span className="d-flex align-items-center">
                            <FaEye className="me-1 text-muted" size={12} />
                            {product.viewCount || 0}
                          </span>
                        </td>
                        <td>
                          {product.rating ? (
                            <span className="d-flex align-items-center">
                              ⭐ {product.rating.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-muted">N/A</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge bg-${status.variant} d-flex align-items-center gap-1`} style={{ width: 'fit-content' }}>
                            {status.icon}
                            {status.text}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Category Breakdown</h5>
            </div>
            <div className="card-body">
              {analytics.categoryStats.map((stat) => (
                <div key={stat.name} className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <div>
                    <h6 className="mb-1">{stat.name}</h6>
                    <small className="text-muted">{stat.count} products</small>
                  </div>
                  <div className="text-end">
                    <div className="fw-medium">{formatCurrency(stat.totalValue)}</div>
                    <small className="text-muted">{stat.totalViews} views</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card mt-3">
            <div className="card-header">
              <h5 className="mb-0">Quick Stats</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Average Price:</span>
                <strong>{formatCurrency(analytics.averagePrice)}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Average Rating:</span>
                <strong>{analytics.averageRating > 0 ? `⭐ ${analytics.averageRating.toFixed(1)}` : 'N/A'}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Out of Stock:</span>
                <span className="badge bg-danger">{analytics.outOfStockProducts}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Low Stock:</span>
                <span className="badge bg-warning">{analytics.lowStockProducts}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}