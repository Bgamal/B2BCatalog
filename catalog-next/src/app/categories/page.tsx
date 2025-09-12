"use client";
import { useEffect, useState } from 'react';
import { Container, Spinner, Alert, Card, Row, Col, Button } from 'react-bootstrap';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:1337';
const API_URL = `${API_BASE}/api`;

type Category = {
  id: number;
    name: string;
    slug: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
 
};

type ApiResponse = {
  data: Category[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${API_URL}/categories?populate=*&pagination[pageSize]=100`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();
        
        if (!data?.data) {
          throw new Error('Invalid response format from server');
        }
        
        setCategories(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isClient) {
      fetchCategories();
    }
  }, [isClient]);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show loading state on server and initial client render
  if (!isMounted || isLoading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading categories...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <Button 
            variant="outline-danger" 
            onClick={() => window.location.reload()}
            className="mt-2"
          >
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="mb-4">Product Categories</h1>
      {!categories || categories.length === 0 ? (
        <Alert variant="info">No categories found.</Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {categories.map((category) => (
            <Col key={category?.id}>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{category?.name || 'Unnamed Category'}</Card.Title>
                  {category?.description && (
                    <Card.Text className="text-muted">
                      {category.description}
                    </Card.Text>
                  )}
                  <Card.Text>
                    <small className="text-muted">
                      Slug: {category?.slug || 'no-slug'}
                    </small>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}