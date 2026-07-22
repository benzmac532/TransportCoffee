import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { ChevronDown, Menu, ShoppingBag, X } from 'lucide-react';
import LogoStack from './LogoStack';
import { useCart } from './CartContext';
import { SHOP_COLLECTIONS } from '../lib/shopify';

const shopLinks = SHOP_COLLECTIONS.map((item) => ({
  label: item.label,
  to: item.to,
}));

const moreLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'Wholesale', to: '/wholesale' },
  { label: 'Where to find us', to: '/locations' },
];

function Dropdown({ label, items, open, onToggle, onClose }) {
  return (
    <div className={`nav-dropdown ${open ? 'open' : ''}`}>
      <button
        type="button"
        className="nav-dropdown-trigger"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={onToggle}
      >
        {label}
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      {open && (
        <div className="nav-dropdown-menu" role="menu">
          {items.map((item) =>
            item.external || item.href ? (
              <a
                key={item.label}
                href={item.href}
                role="menuitem"
                target={item.href?.startsWith('http') ? '_blank' : undefined}
                rel={item.href?.startsWith('http') ? 'noreferrer' : undefined}
                onClick={onClose}
              >
                {item.label}
              </a>
            ) : (
              <Link key={item.label} to={item.to} role="menuitem" onClick={onClose}>
                {item.label}
              </Link>
            ),
          )}
        </div>
      )}
    </div>
  );
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const navRef = useRef(null);
  const { totalQuantity, openCart } = useCart();

  useEffect(() => {
    function handleClick(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setShopOpen(false);
        setMoreOpen(false);
      }
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  function closeAll() {
    setMenuOpen(false);
    setShopOpen(false);
    setMoreOpen(false);
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <LogoStack />
        <nav className="desktop-nav" aria-label="Main navigation" ref={navRef}>
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Home
          </NavLink>
          <Dropdown
            label="Shop"
            items={shopLinks}
            open={shopOpen}
            onToggle={() => {
              setShopOpen((value) => !value);
              setMoreOpen(false);
            }}
            onClose={closeAll}
          />
          <Dropdown
            label="More"
            items={moreLinks}
            open={moreOpen}
            onToggle={() => {
              setMoreOpen((value) => !value);
              setShopOpen(false);
            }}
            onClose={closeAll}
          />
          <NavLink
            to="/subscriptions"
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            Subscriptions
          </NavLink>
        </nav>
        <div className="header-actions">
          <Link className="header-shop-link" to="/shop">
            Visit shop
          </Link>
          <button
            type="button"
            className="cart-icon-button header-cart-button"
            aria-label={`Open cart${totalQuantity ? `, ${totalQuantity} items` : ''}`}
            onClick={openCart}
          >
            <ShoppingBag size={20} />
            {totalQuantity > 0 && <span className="cart-count">{totalQuantity}</span>}
          </button>
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
          <NavLink to="/" end onClick={closeAll}>
            Home
          </NavLink>
          <p className="mobile-nav-label">Shop</p>
          {shopLinks.map((item) => (
            <Link key={item.label} to={item.to} onClick={closeAll}>
              {item.label}
            </Link>
          ))}
          <p className="mobile-nav-label">More</p>
          {moreLinks.map((item) => (
            <Link key={item.label} to={item.to} onClick={closeAll}>
              {item.label}
            </Link>
          ))}
          <NavLink to="/subscriptions" onClick={closeAll}>
            Subscriptions
          </NavLink>
          <button
            type="button"
            className="mobile-cart-link"
            onClick={() => {
              closeAll();
              openCart();
            }}
          >
            Cart{totalQuantity > 0 ? ` (${totalQuantity})` : ''}
          </button>
        </nav>
      )}

      <Outlet />

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-main">
            <div className="footer-brand">
              <LogoStack />
              <p>Coffee that moves you.</p>
            </div>
            <nav className="footer-explore" aria-label="Footer navigation">
              <h3>Explore</h3>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact Us</Link>
              <Link to="/subscriptions">Subscriptions</Link>
              <Link to="/wholesale">Wholesale</Link>
              <Link to="/locations">Where to find us</Link>
              <Link to="/shop">Shop coffee</Link>
            </nav>
            <div className="footer-connect">
              <h3>Connect</h3>
              <a href="mailto:transportcoffeeroasters@gmail.com">
                transportcoffeeroasters@gmail.com
              </a>
              <p className="footer-note">The Shoals, AL</p>
            </div>
          </div>
          <div className="footer-legal">
            <p>&copy; {new Date().getFullYear()} Transport Coffee Roasters</p>
            <div className="footer-links">
              <Link to="/refund-policy">Refund Policy</Link>
              <Link to="/shipping-policy">Shipping Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
