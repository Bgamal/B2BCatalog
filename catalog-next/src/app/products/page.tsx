'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { Card, Button, Form, Row, Col, Container, Badge, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { FaSearch, FaShoppingCart, FaFilter, FaSort, FaStar } from 'react-icons/fa';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:1337';
const API_URL = `${API_BASE}/api`;

type ImageFormat = {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  provider_metadata: {
    public_id: string;
    resource_type: string;
  };
};

type Image = {
  data: {
    id: number;
    attributes: {
      name: string;
      alternativeText: string | null;
      caption: string | null;
      width: number;
      height: number;
      formats: {
        thumbnail: ImageFormat;
        small: ImageFormat;
        medium: ImageFormat;
        large: ImageFormat;
      };
      hash: string;
      ext: string;
      mime: string;
      size: number;
      url: string;
      previewUrl: string | null;
      provider: string;
      provider_metadata: {
        public_id: string;
        resource_type: string;
      };
      createdAt: string;
      updatedAt: string;
    };
  } | null;
};

type Category = {
  id: number;
  attributes: {
    name: string;
    slug: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
};

type Supplier = {
  id: number;
  attributes: {
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
};

type Product = {
  id: number;
  attributes: {
    name: string;
    sku: string;
    description: string | null;
    price: number;
    stock: number;
    rating: number | null;
    featured: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    image: Image;
    category: {
      data: Category | null;
    };
    supplier: {
      data: Supplier | null;
    };
  };
};

type ApiResponse<T> = {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export default function ProductsPage() {
  const [products, setProducts] = useState<{ id: number; attributes: any }[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [q, setQ] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [supplierId, setSupplierId] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [apiUrl, setApiUrl] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  // Set client-side flag and log API URL on mount
  useEffect(() => {
    setIsClient(true);
    setApiUrl(API_URL);
    console.log('API URL set to:', API_URL);
  }, []);

  // Fetch data from Strapi
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Log the API URL being used
        console.log('Fetching data from API:', API_URL);
        
        // Check if API is reachable
        const isApiReachable = await fetch(API_URL, { method: 'HEAD' })
          .then(res => res.ok)
          .catch(() => false);

        if (!isApiReachable) {
          console.error('API server is not running or not reachable at', API_URL);
          setError('Unable to connect to the server. Please make sure the Strapi server is running.');
          setIsLoading(false);
          return;
        }

        // Fetch products with related data
        const endpoints = [
          { name: 'products', url: `${API_URL}/products?populate=*`, required: true },
          { name: 'categories', url: `${API_URL}/categories`, required: false },
          { name: 'suppliers', url: `${API_URL}/suppliers`, required: false }
        ];

        const responses = await Promise.allSettled(
          endpoints.map(endpoint => 
            fetch(endpoint.url)
              .then(async (res) => {
                if (!res.ok) {
                  const errorText = await res.text();
                  console.error(`Error fetching ${endpoint.name}:`, errorText);
                  if (endpoint.required) {
                    throw new Error(`Failed to fetch ${endpoint.name}: ${res.status} ${res.statusText}`);
                  }
                  return null;
                }
                return res.json();
              })
              .catch(error => {
                console.error(`Error in ${endpoint.name} fetch:`, error);
                if (endpoint.required) {
                  throw error;
                }
                return null;
              })
          )
        );

        // Process responses
        const [productsRes, categoriesRes, suppliersRes] = responses.map((result, index) => {
          if (result.status === 'fulfilled' && result.value) {
            return result.value;
          }
          console.warn(`Failed to fetch ${endpoints[index].name}`);
          return { data: [] }; // Return empty data for failed non-required endpoints
        });

        // Process products data
        const productsData = productsRes?.data || [];
        const categoriesData = categoriesRes?.data || [];
        const suppliersData = suppliersRes?.data || [];
        
        console.log('Products:', productsData);
        console.log('Categories:', categoriesData);
        console.log('Suppliers:', suppliersData);
        
        setProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setSuppliers(Array.isArray(suppliersData) ? suppliersData : []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];

    return products
      .filter(product => {
        if (!product?.attributes) return false;
        
        const searchTerm = q?.toLowerCase() || '';
        const productName = product.attributes.name?.toLowerCase() || '';
        const productSku = product.attributes.sku?.toLowerCase() || '';
        const productDescription = product.attributes.description?.toLowerCase() || '';
        
        const matchesSearch = 
          productName.includes(searchTerm) ||
          productSku.includes(searchTerm) ||
          productDescription.includes(searchTerm);
        
        const matchesCategory = !categoryId || product.attributes.category?.data?.id === categoryId;
        const matchesSupplier = !supplierId || product.attributes.supplier?.data?.id === supplierId;
        const productPrice = product.attributes.price || 0;
        const matchesPrice = productPrice >= priceRange[0] && productPrice <= priceRange[1];
        
        return matchesSearch && matchesCategory && matchesSupplier && matchesPrice;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name-asc':
            return a.attributes.name.localeCompare(b.attributes.name);
          case 'name-desc':
            return b.attributes.name.localeCompare(a.attributes.name);
          case 'price-asc':
            return a.attributes.price - b.attributes.price;
          case 'price-desc':
            return b.attributes.price - a.attributes.price;
          case 'rating-desc':
            return (b.attributes.rating || 0) - (a.attributes.rating || 0);
          default:
            return 0;
        }
      });
  }, [products, q, categoryId, supplierId, sortBy, priceRange]);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Render star rating
  const renderRating = (rating: number = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-warning" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStar key={i} className="text-warning" style={{ opacity: 0.5 }} />);
      } else {
        stars.push(<FaStar key={i} className="text-muted" style={{ opacity: 0.3 }} />);
      }
    }
    
    return <div className="d-flex">{stars}</div>;
  };

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading products...</span>
        </Spinner>
        <p className="mt-2">Loading products...</p>
      </Container>
    );
  }

  if (error && isClient) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => window.location.reload()} className="mt-2">
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="bg-primary text-white text-center py-5 mb-5">
        <Container>
          <h1 className="display-4 fw-bold mb-3">B2B Product Catalog</h1>
          <p className="lead mb-4">Discover our wide range of high-quality products for your business needs</p>
          
          {/* Search Bar */}
          <div className="row justify-content-center">
            <div className="col-md-8">
              <InputGroup className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Search products..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="py-3"
                />
                <Button variant="light" className="px-4">
                  <FaSearch />
                </Button>
              </InputGroup>
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <Row>
          {/* Filters Sidebar */}
          <Col lg={3} className="mb-4">
            <Card className="shadow-sm">
              <Card.Header className="bg-light">
                <h5 className="mb-0"><FaFilter className="me-2" /> Filters</h5>
              </Card.Header>
              <Card.Body>
                {/* Category Filter */}
                <div className="mb-4">
                  <h6>Category</h6>
                  <Form.Select 
                    value={categoryId || ''} 
                    onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : '')}
                    className="mb-3"
                  >
                    <option value="">All Categories</option>
                    {Array.isArray(categories) && categories.map(category => {
                      const categoryId = category.id;
                      const categoryName = category.attributes?.name || 'Unnamed Category';
                      return (
                        <option key={categoryId} value={categoryId}>
                          {categoryName}
                        </option>
                      );
                    })}
                  </Form.Select>
                </div>

                {/* Supplier Filter */}
                <div className="mb-4">
                  <h6>Supplier</h6>
                  <Form.Select 
                    value={supplierId || ''} 
                    onChange={(e) => setSupplierId(e.target.value ? Number(e.target.value) : '')}
                    className="mb-3"
                  >
                    <option value="">All Suppliers</option>
                    {Array.isArray(suppliers) && suppliers.map(supplier => {
                      const supplierId = supplier.id;
                      const supplierName = supplier.attributes?.name || 'Unnamed Supplier';
                      return (
                        <option key={supplierId} value={supplierId}>
                          {supplierName}
                        </option>
                      );
                    })}
                  </Form.Select>
                </div>

                {/* Price Range */}
                <div className="mb-4">
                  <h6>Price Range</h6>
                  <div className="d-flex justify-content-between mb-2">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                  <Form.Range
                    min={0}
                    max={1000}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                  />
                </div>

                {/* Reset Filters */}
                <Button 
                  variant="outline-primary" 
                  className="w-100"
                  onClick={() => {
                    setQ('');
                    setCategoryId('');
                    setSupplierId('');
                    setPriceRange([0, 1000]);
                  }}
                >
                  Reset Filters
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Products Grid */}
          <Col lg={9}>
            {/* Sorting and Results Count */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <span className="text-muted">
                  Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'}
                </span>
              </div>
              <div className="d-flex align-items-center">
                <span className="me-2 text-muted"><FaSort /></span>
                <Form.Select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-auto"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                  <option value="rating-desc">Highest Rated</option>
                </Form.Select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <Row xs={1} md={2} lg={3} className="g-4">
                {filteredProducts.map((product: Product) => (
                  <Col key={product.id}>
                    <Card className="h-100 product-card">
                      <div className="position-relative" style={{ height: '200px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="text-muted">Product Image</div>
                        {product.attributes.stock <= 0 && (
                          <div className="position-absolute top-0 end-0 m-2">
                            <Badge bg="danger">Out of Stock</Badge>
                          </div>
                        )}
                        {product.attributes.rating && product.attributes.rating >= 4.5 && (
                          <div className="position-absolute top-0 start-0 m-2">
                            <Badge bg="warning" text="dark">
                              <FaStar className="me-1" /> Top Rated
                            </Badge>
                          </div>
                        )}
                      </div>
                      <Card.Body className="d-flex flex-column">
                        <div className="mb-2">
                          <Card.Title className="h5 mb-1">{product.attributes.name}</Card.Title>
                          <Card.Subtitle className="text-muted mb-2">{product.attributes.sku}</Card.Subtitle>
                          {product.attributes.rating !== undefined && product.attributes.rating !== null && (
                            <div className="d-flex align-items-center mb-2">
                              {renderRating(product.attributes.rating)}
                              <small className="ms-2 text-muted">({product.attributes.rating?.toFixed(1)})</small>
                            </div>
                          )}
                          <div className="h4 mb-3 text-primary">{formatPrice(product.attributes.price)}</div>
                        </div>
                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              {product.attributes.stock > 0 ? (
                                <span className="text-success">In Stock ({product.attributes.stock})</span>
                              ) : (
                                <span className="text-danger">Out of Stock</span>
                              )}
                            </div>
                            <Button 
                              variant="primary" 
                              size="sm"
                              disabled={product.attributes.stock <= 0}
                            >
                              <FaShoppingCart className="me-1" /> Add to Cart
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Card className="text-center p-5">
                <Card.Body>
                  <h3 className="text-muted">No products found</h3>
                  <p className="text-muted">Try adjusting your search or filter criteria</p>
                  <Button 
                    variant="outline-primary" 
                    onClick={() => {
                      setQ('');
                      setCategoryId('');
                      setSupplierId('');
                      setPriceRange([0, 1000]);
                    }}>
                    Clear Filters
                  </Button>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
