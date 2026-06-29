import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import Logo from './Logo';

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About Us' },
  { to: '/subscriptions', label: 'Subscriptions' },
  { to: '/wholesale', label: 'Wholesale' },
  { to: '/contact', label: 'Contact Us' },
];

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="announcement">Free shipping on orders over $75</div>

      <header className="site-header">
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <Search size={20} aria-hidden="true" />
          <ShoppingBag size={20} aria-hidden="true" />
          <button
            type="button"
            className="menu-button"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      )}

      <Outlet />

      <footer className="site-footer">
        <div className="footer-brand">
          <Logo />
          <p>Good coffee. Moves you.</p>
        </div>
        <div>
          <h3>Explore</h3>
          <Link to="/about">About Us</Link>
          <Link to="/subscriptions">Subscriptions</Link>
          <Link to="/wholesale">Wholesale</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
        <div>
          <h3>Connect</h3>
          <a href="mailto:hello@transportcoffee.com">hello@transportcoffee.com</a>
          <a href="tel:+15551234567">(555) 123-4567</a>
          <p className="footer-note">Savannah, Georgia</p>
        </div>
        <div className="footer-legal">
          <p>&copy; {new Date().getFullYear()} Transport Coffee Roasters</p>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </footer>
    </>
  );
}
