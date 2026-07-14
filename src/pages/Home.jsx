import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const SHOP_BASE = 'https://transportcoffeeroasters.com';

const featuredCoffees = [
  {
    name: 'Frequent Flyer',
    notes: 'House blend (Brazil + Peru) · Medium roast · 12 oz',
    price: '$18.00',
    image: 'https://cdn.shopify.com/s/files/1/0963/8179/6639/files/858B0F21-B0FD-41DC-B409-129676FF9578.png?v=1782582557',
    href: `${SHOP_BASE}/products/frequent-flyer`,
  },
  {
    name: 'Ethiopia Danbi Udo',
    notes: 'Natural process · Light roast · 12 oz',
    price: '$21.00',
    image: 'https://cdn.shopify.com/s/files/1/0963/8179/6639/files/IMG-1995.png?v=1782606822',
    href: `${SHOP_BASE}/products/ethiopia-danbi-udo`,
  },
  {
    name: 'Peru Minca Organic',
    notes: 'Washed process · Light roast · 12 oz',
    price: '$20.00',
    image: 'https://cdn.shopify.com/s/files/1/0963/8179/6639/files/IMG-1994.png?v=1782606426',
    href: `${SHOP_BASE}/products/peru-minca-organic`,
  },
];

export default function Home() {
  return (
    <main>
      <section className="home-quad">
        <div className="perc-hero-copy">
          <p className="eyebrow">Est. 2026</p>
          <h1>
            <span>Coffee that</span>
            <span>moves you</span>
          </h1>
          <p className="lead">
            We source thoughtful coffees and roast them with every ounce of care.
            Coffee should fuel your journey — let&apos;s move forward together.
          </p>
          <div className="hero-actions">
            <Link className="button" to="/subscriptions">
              Shop subscriptions
            </Link>
            <a className="button ghost" href={`${SHOP_BASE}/collections/all`} target="_blank" rel="noreferrer">
              Shop coffee
            </a>
          </div>
        </div>
        <div className="perc-hero-visual">
          <img
            className="hero-photo"
            src="/hero-field.png"
            alt="Terraced coffee hills with a winding mountain road"
          />
        </div>
        <div className="editorial-visual">
          <img
            className="editorial-photo"
            src="/pour-over-bloom.png"
            alt="Pour-over coffee blooming in a Chemex filter"
          />
        </div>
        <div className="editorial-copy story-copy">
          <p className="eyebrow">Hey there!</p>
          <h2>
            Thoughtful coffee
            <span>for every journey.</span>
          </h2>
          <p>
            We craft coffee with intention — designed to forge the path from here
            to there. Built for momentum and grounded in quality.
          </p>
          <Link className="button" to="/about">
            Our story
          </Link>
        </div>
      </section>

      <section className="section shop-preview">
        <div className="section-heading">
          <p className="eyebrow">From the shop</p>
          <h2>Coffee for the journey.</h2>
        </div>
        <div className="product-grid">
          {featuredCoffees.map((coffee) => (
            <article className="product-card" key={coffee.name}>
              <a className="product-art" href={coffee.href} target="_blank" rel="noreferrer">
                <img src={coffee.image} alt={coffee.name} />
              </a>
              <h3>{coffee.name}</h3>
              <p>{coffee.notes}</p>
              <strong>{coffee.price}</strong>
              <a className="button" href={coffee.href} target="_blank" rel="noreferrer">
                Shop now <ArrowRight size={14} />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="home-cta-mosaic" aria-label="Subscriptions, wholesale, and contact">
        <div className="dual-cta-panel subscribe-panel">
          <div
            className="dual-cta-bg"
            style={{
              backgroundImage:
                'linear-gradient(rgba(7, 22, 35, 0.78), rgba(7, 22, 35, 0.82)), url(/beans-and-fern.png)',
            }}
            aria-hidden="true"
          />
          <p className="eyebrow">Never miss a roast</p>
          <h2>
            Subscribe
            <span>&amp; save.</span>
          </h2>
          <p>
            Get fresh coffee delivered on your schedule. $5 flat-rate shipping on
            every subscription order.
          </p>
          <Link className="button" to="/subscriptions">
            Explore plans
          </Link>
        </div>
        <div className="dual-cta-panel wholesale-panel">
          <div
            className="dual-cta-bg"
            style={{
              backgroundImage:
                'linear-gradient(rgba(42, 24, 16, 0.82), rgba(42, 24, 16, 0.88)), url(/open-roaster.png)',
            }}
            aria-hidden="true"
          />
          <p className="eyebrow">Partnerships</p>
          <h2>
            Wholesale
            <span>inquiries.</span>
          </h2>
          <p>
            Cafés, offices, and retailers — let&apos;s build a coffee program that
            moves your business forward with quality and consistency.
          </p>
          <Link className="button" to="/wholesale">
            Get started
          </Link>
        </div>
        <div className="home-cta-photo">
          <img
            src="/plant-coffee.png"
            alt="Pour-over dripper blooming on a wooden tray with plants"
          />
        </div>
        <div className="home-cta-contact editorial-copy">
          <p className="eyebrow">Say hello</p>
          <h2>
            We&apos;d love
            <span>to hear from you.</span>
          </h2>
          <p>Questions, feedback, or just want to talk coffee? Reach out anytime.</p>
          <Link className="button" to="/contact">
            Contact us
          </Link>
        </div>
      </section>
    </main>
  );
}
