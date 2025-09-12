'use client';

import MostViewedProducts from '@/components/MostViewedProducts';
import { FaBox, FaEye, FaChartLine, FaArrowRight } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="container py-4">
      {/* Hero Section */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="bg-primary text-white rounded-3 p-5 text-center">
            <h1 className="display-4 fw-bold mb-3">Welcome to B2B Catalog</h1>
            <p className="lead mb-4">Your one-stop solution for all business procurement needs</p>
            <div className="d-flex justify-content-center gap-3">
              <a href="/products" className="btn btn-light btn-lg">
                <FaBox className="me-2" />
                Browse Products
              </a>
              <a href="/trending" className="btn btn-outline-light btn-lg">
                <FaChartLine className="me-2" />
                View Trending
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row mb-5">
        <div className="col-md-4">
          <div className="card text-center h-100">
            <div className="card-body">
              <FaBox className="text-primary mb-3" size={32} />
              <h5 className="card-title">Extensive Catalog</h5>
              <p className="card-text text-muted">Browse thousands of products across multiple categories</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center h-100">
            <div className="card-body">
              <FaEye className="text-info mb-3" size={32} />
              <h5 className="card-title">Trending Insights</h5>
              <p className="card-text text-muted">Discover what other businesses are viewing and purchasing</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center h-100">
            <div className="card-body">
              <FaChartLine className="text-success mb-3" size={32} />
              <h5 className="card-title">Analytics Dashboard</h5>
              <p className="card-text text-muted">Track product performance and inventory insights</p>
            </div>
          </div>
        </div>
      </div>

      {/* Most Viewed Products Section */}
      <div className="row mb-5">
        <div className="col-12">
          <MostViewedProducts limit={6} showTitle={true} layout="grid" />
        </div>
      </div>

      {/* Call to Action */}
      <div className="row">
        <div className="col-12">
          <div className="card bg-light">
            <div className="card-body text-center py-5">
              <h3 className="mb-3">Ready to explore our full catalog?</h3>
              <p className="text-muted mb-4">Discover thousands of products tailored for your business needs</p>
              <div className="d-flex justify-content-center gap-3">
                <a href="/products" className="btn btn-primary btn-lg">
                  View All Products
                  <FaArrowRight className="ms-2" />
                </a>
                <a href="/categories" className="btn btn-outline-primary btn-lg">
                  Browse Categories
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
