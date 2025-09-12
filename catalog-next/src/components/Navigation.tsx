'use client';

import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import Link from 'next/link';
import Logo from './Logo';

export default function Navigation({ children }: { children: React.ReactNode }) {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Navigation */}
      <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm" collapseOnSelect>
        <Container>
          <Navbar.Brand as="div" className="d-flex align-items-center">
            <Logo />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} href="/products">Products</Nav.Link>
              <Nav.Link as={Link} href="/categories">Categories</Nav.Link>
              <Nav.Link as={Link} href="/suppliers">Suppliers</Nav.Link>
              <Nav.Link as={Link} href="/analytics">Analytics</Nav.Link>
            </Nav>
            <Nav>
              <NavDropdown title="Account" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} href="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item as={Link} href="/settings">Settings</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} href="/logout">Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Children will be rendered by the layout */}

      {/* Footer */}
      <footer className="bg-light py-3 mt-auto">
        <Container>
          <div className="text-center text-muted">
            <p className="mb-1">© {currentYear} B2B Catalog. All rights reserved.</p>
            <div className="d-flex justify-content-center gap-3">
              <Link href="/privacy" className="text-muted">Privacy Policy</Link>
              <Link href="/terms" className="text-muted">Terms of Service</Link>
              <Link href="/contact" className="text-muted">Contact Us</Link>
            </div>
          </div>
        </Container>
      </footer>
    </>
  );
}
