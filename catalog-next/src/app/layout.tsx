import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import Navigation from '@/components/Navigation';
import ThemeInitializer from '@/components/ThemeInitializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'B2B Catalog',
  description: 'Your one-stop B2B product catalog'
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
      </head>
      <body className={`d-flex flex-column min-vh-100 ${inter.className}`}>
        <ThemeInitializer />
        <Navigation  children={children} />
        <main className="flex-grow-1 py-4">
          <div className="container">
            {children}
          </div>
        </main>
          {/* Footer */}
          <footer className="bg-dark text-white py-4 mt-auto">
            <div className="container">
              <div className="row">
                <div className="col-md-4 mb-3 mb-md-0">
                  <h5>About Us</h5>
                  <p className="mb-0">Your one-stop B2B product catalog solution for all your business needs.</p>
                </div>
                <div className="col-md-4 mb-3 mb-md-0">
                  <h5>Quick Links</h5>
                  <ul className="list-unstyled">
                    <li><a href="/about" className="text-white text-decoration-none">About Us</a></li>
                    <li><a href="/products" className="text-white text-decoration-none">Products</a></li>
                    <li><a href="/categories" className="text-white text-decoration-none">Categories</a></li>
                    <li><a href="/suppliers" className="text-white text-decoration-none">Suppliers</a></li>
                  </ul>
                </div>
                <div className="col-md-4">
                  <h5>Connect With Us</h5>
                  <div className="d-flex gap-3">
                    <a href="#" className="text-white"><i className="bi bi-facebook fs-4"></i></a>
                    <a href="#" className="text-white"><i className="bi bi-twitter fs-4"></i></a>
                    <a href="#" className="text-white"><i className="bi bi-linkedin fs-4"></i></a>
                    <a href="#" className="text-white"><i className="bi bi-instagram fs-4"></i></a>
                  </div>
                </div>
              </div>
              <hr className="my-4" />
              <div className="text-center">
                <p className="mb-0">&copy; {new Date().getFullYear()} B2B Catalog. All rights reserved.</p>
              </div>
            </div>
          </footer>

          {/* Bootstrap JS Bundle with Popper */}
          <script 
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" 
            integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" 
            crossOrigin="anonymous"
            async
          />
          {/* Bootstrap Icons */}
          <link 
            rel="stylesheet" 
            href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"
          />
      </body>
    </html>
  );
}