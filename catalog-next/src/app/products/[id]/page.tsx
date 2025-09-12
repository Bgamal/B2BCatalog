import { notFound } from 'next/navigation';

type Product = {
  id: number;
  name: string;
  description?: string;
  sku: string;
  price: number;
  stock: number;
  viewCount?: number;
  images?: Array<{
    id: number;
    url: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
      medium?: { url: string };
      large?: { url: string };
    };
  }>;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  supplier?: {
    id: number;
    name: string;
  };
};

const API = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:1337') + '/api';

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API}/product/${id}?populate=*`, {
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.error(`Failed to fetch product: ${res.status} ${res.statusText}`);
      if (res.status === 404) return null;
      throw new Error('Failed to fetch product');
    }
    
    const json = await res.json();
    console.log('Product API Response:', json);
    return json?.data?.attributes ? { id: json.data.id, ...json.data.attributes } : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const product = await getProduct(id);
  
  if (!product) {
    notFound();
  }

  const imageUrl = product.images?.[0]?.url 
    ? `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:1337'}${product.images[0].url}`
    : '/placeholder-product.png';

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <img 
              src={imageUrl} 
              alt={product.name}
              className="img-fluid"
              style={{ maxHeight: '500px', objectFit: 'contain' }}
            />
          </div>
        </div>
        <div className="col-md-6">
          <h1 className="mb-3">{product.name}</h1>
          <p className="text-muted mb-4">SKU: {product.sku}</p>
          
          <div className="d-flex align-items-center mb-4">
            <h3 className="mb-0 me-3">${product.price.toFixed(2)}</h3>
            <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {product.description && (
            <div className="mb-4">
              <h5>Description</h5>
              <p className="text-muted">{product.description}</p>
            </div>
          )}

          <div className="d-grid gap-2 d-md-flex">
            <button 
              className="btn btn-primary btn-lg me-md-2"
              disabled={product.stock <= 0}
            >
              Add to Cart
            </button>
            <button className="btn btn-outline-secondary btn-lg">
              Add to Wishlist
            </button>
          </div>

          <hr className="my-4" />
          
          <div className="row">
            {product.category && (
              <div className="col-6">
                <h6>Category</h6>
                <p className="mb-0">
                  <a href={`/categories/${product.category.slug}`} className="text-decoration-none">
                    {product.category.name}
                  </a>
                </p>
              </div>
            )}
            {product.supplier && (
              <div className="col-6">
                <h6>Supplier</h6>
                <p className="mb-0">{product.supplier.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params;
  const product = await getProduct(id);
  
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.'
    };
  }

  return {
    title: product.name,
    description: product.description || `Buy ${product.name} for $${product.price.toFixed(2)}`,
    openGraph: {
      images: product.images?.[0]?.url 
        ? [{
            url: `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:1337'}${product.images[0].url}`,
            width: 800,
            height: 600,
            alt: product.name,
          }]
        : [],
    },
  };
}
