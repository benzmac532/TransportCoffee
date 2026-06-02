import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight,
  Bean,
  Flame,
  Globe2,
  Leaf,
  Mail,
  MapPin,
  Menu,
  Package,
  Search,
  ShoppingBag,
  Users,
} from 'lucide-react';
import './styles.css';

const products = [
  {
    name: 'Waypoint Blend',
    notes: 'Caramel, toffee, citrus',
    price: '$18.00',
    color: 'navy',
    label: 'Daily driver',
  },
  {
    name: 'Ethiopia Kayon Mountain',
    notes: 'Jasmine, peach, honey',
    price: '$22.00',
    color: 'sage',
    label: 'Single origin',
  },
  {
    name: 'Roasted For You Box',
    notes: 'Curated seasonal coffee',
    price: '$45.00',
    color: 'sand',
    label: 'Gift box',
  },
];

const values = [
  {
    icon: Leaf,
    title: 'Quality Sourced',
    text: "Ethically sourced from growers who care about craft as much as we do.",
  },
  {
    icon: Flame,
    title: 'Expertly Roasted',
    text: 'Small-batch roasting keeps each coffee expressive, balanced, and fresh.',
  },
  {
    icon: Globe2,
    title: 'Ethically Driven',
    text: 'Thoughtful sourcing, fair partnerships, and long-term relationships.',
  },
  {
    icon: Package,
    title: 'Made To Move',
    text: 'Coffee, gear, and subscriptions built around real daily routines.',
  },
];

const origins = [
  ['Ethiopia', 'Kayon Mountain', 'Washed', 'Floral / Citrus', 'sage'],
  ['Colombia', 'Finca El Paraiso', 'Natural', 'Stone Fruit', 'rust'],
  ['Guatemala', 'La Bolsa', 'Washed', 'Chocolate', 'cobalt'],
  ['Brazil', 'Fazenda Ipe', 'Natural', 'Nutty / Cocoa', 'sand'],
];

function Logo() {
  return (
    <a href="#top" className="logo" aria-label="Transport Coffee home">
      <span className="logo-mark" aria-hidden="true">
        <span />
      </span>
      <span>
        <strong>Transport</strong>
        <small>Coffee Roasters</small>
      </span>
    </a>
  );
}

function ProductMockup({ color = 'navy', boxed = false }) {
  return (
    <div className={`mock-product ${color} ${boxed ? 'boxed' : ''}`}>
      <div className="seal">T</div>
      <div className="brand-lines">
        <span />
        <strong>Transport</strong>
        <small>Coffee Roasters</small>
      </div>
      <div className="product-label">
        <p>Waypoint</p>
        <span>Blend</span>
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-art">
        <ProductMockup color={product.color} boxed={product.color === 'sand'} />
      </div>
      <p className="eyebrow">{product.label}</p>
      <h3>{product.name}</h3>
      <p>{product.notes}</p>
      <strong>{product.price}</strong>
      <a href="#shop" className="text-link">
        Shop now <ArrowRight size={14} />
      </a>
    </article>
  );
}

function App() {
  return (
    <main id="top">
      <div className="announcement">Free shipping on orders over $75</div>

      <header className="site-header">
        <Logo />
        <nav aria-label="Main navigation">
          <a href="#shop">Shop</a>
          <a href="#subscriptions">Subscriptions</a>
          <a href="#about">About</a>
          <a href="#locations">Locations</a>
          <a href="#learn">Learn</a>
        </nav>
        <div className="header-actions">
          <Search size={20} />
          <ShoppingBag size={20} />
          <button className="menu-button" aria-label="Open navigation">
            <Menu size={22} />
          </button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="winged-t">T</div>
          <p className="eyebrow">Small batch coffee roasters</p>
          <h1>Good coffee moves you.</h1>
          <p>
            Transport Coffee is built for mornings, road trips, slow weekends,
            and every mile between. Thoughtful sourcing, honest roasting, real
            impact.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#shop">
              Shop coffee
            </a>
            <a className="button secondary" href="#about">
              Learn more
            </a>
          </div>
        </div>
        <div className="hero-visual" aria-label="Transport Coffee product set">
          <ProductMockup color="navy" />
          <div className="cup">
            <span>T</span>
            <small>To-go cup</small>
          </div>
          <ProductMockup color="sand" boxed />
        </div>
      </section>

      <section className="value-row" aria-label="Brand values">
        {values.map(({ icon: Icon, title, text }) => (
          <article key={title}>
            <Icon size={28} />
            <div>
              <h2>{title}</h2>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="shop-section section" id="shop">
        <div className="section-heading">
          <p className="eyebrow">Shop Our Coffee</p>
          <h2>Roasted for wherever the day takes you.</h2>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
          <aside className="subscribe-card" id="subscriptions">
            <Bean size={34} />
            <h3>Subscribe & Save</h3>
            <p>Save 10% on every delivery and never run out of the coffee you love.</p>
            <a href="#signup">Start a subscription</a>
          </aside>
        </div>
      </section>

      <section className="story-section" id="about">
        <div className="cafe-photo">
          <div className="menu-board">
            <span>Coffee</span>
            <span>Espresso</span>
            <span>Americano</span>
            <span>Latte</span>
            <span>Cold Brew</span>
          </div>
        </div>
        <div className="story-copy">
          <p className="eyebrow">Thoughtful Coffee</p>
          <h2>For every journey.</h2>
          <p>
            We roast coffee with movement in mind: meaningful connections,
            dependable quality, and momentum that carries you forward.
          </p>
          <a className="button outline" href="#learn">
            Our story
          </a>
        </div>
      </section>

      <section className="origin-section section" id="learn">
        <div className="section-heading">
          <p className="eyebrow">Origin Label System</p>
          <h2>Clear labels for coffees with a sense of place.</h2>
        </div>
        <div className="origin-grid">
          {origins.map(([country, farm, process, notes, color]) => (
            <article className={`origin-card ${color}`} key={`${country}-${farm}`}>
              <span>{country}</span>
              <h3>{farm}</h3>
              <p>{process}</p>
              <small>{notes}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="brand-board section">
        <div>
          <p className="eyebrow">Brand Essence</p>
          <h2>Coffee that moves with people.</h2>
          <p>
            A warm industrial identity, crisp type, copper marks, and a quiet
            outdoor spirit inspired by the supplied direction.
          </p>
        </div>
        <div className="palette" aria-label="Brand color palette">
          {['bone', 'oatmeal', 'charcoal', 'navy', 'sand', 'sage', 'copper', 'rust'].map(
            (color) => (
              <span key={color} className={color}>
                {color}
              </span>
            ),
          )}
        </div>
      </section>

      <footer className="site-footer" id="locations">
        <div className="footer-brand">
          <Logo />
          <p>Good coffee. Moves you.</p>
          <div className="socials">
            <Users size={18} />
            <MapPin size={18} />
            <Mail size={18} />
          </div>
        </div>
        <div>
          <h3>Shop</h3>
          <a href="#shop">All Coffee</a>
          <a href="#subscriptions">Subscriptions</a>
          <a href="#shop">Merchandise</a>
          <a href="#shop">Gift Cards</a>
        </div>
        <div>
          <h3>About</h3>
          <a href="#about">Our Story</a>
          <a href="#learn">Sourcing</a>
          <a href="#learn">Roasting</a>
          <a href="#locations">Cafes</a>
        </div>
        <form className="signup" id="signup">
          <h3>Stay in the know</h3>
          <p>Get updates on new coffees, events, and more.</p>
          <label>
            <span>Email address</span>
            <input type="email" placeholder="Enter your email" />
          </label>
          <button type="submit">Subscribe</button>
        </form>
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
