import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductMockup from '../components/ProductMockup';

const featuredCoffees = [
  {
    name: 'Waypoint Blend',
    notes: 'Caramel, toffee, citrus',
    price: '$18.00',
    color: 'navy',
  },
  {
    name: 'Ethiopia Kayon Mountain',
    notes: 'Jasmine, peach, honey',
    price: '$22.00',
    color: 'sage',
  },
  {
    name: 'Colombia El Paraiso',
    notes: 'Stone fruit, cocoa, brown sugar',
    price: '$20.00',
    color: 'rust',
  },
];

export default function Home() {
  return (
    <main>
      <section className="perc-hero">
        <div className="perc-hero-copy">
          <p className="eyebrow">Est. 2026</p>
          <h1>
            <span>Good Coffee.</span>
            <span>Moves You.</span>
          </h1>
          <p className="lead">
            We source thoughtful coffees and roast them with every ounce of care.
            Coffee should fuel your journey — let&apos;s move forward together.
          </p>
          <Link className="button primary" to="/subscriptions">
            Shop subscriptions
          </Link>
        </div>
        <div className="perc-hero-visual">
          <ProductMockup color="navy" />
          <div className="cup">
            <span>T</span>
            <small>To-go cup</small>
          </div>
          <ProductMockup color="sand" boxed label="Roasted" sublabel="For You" />
        </div>
      </section>

      <section className="editorial-block light">
        <div className="editorial-copy">
          <p className="eyebrow">Hey there!</p>
          <h2>
            Thoughtful coffee
            <span>for every journey.</span>
          </h2>
          <p>
            We craft coffee with intention — designed to forge the path from here
            to there. Built for momentum and grounded in quality.
          </p>
          <Link className="button outline" to="/about">
            Our story
          </Link>
        </div>
        <div className="editorial-visual cafe-photo" aria-hidden="true">
          <div className="menu-board">
            <span>Coffee</span>
            <span>Espresso</span>
            <span>Americano</span>
            <span>Latte</span>
            <span>Cold Brew</span>
          </div>
        </div>
      </section>

      <section className="editorial-block dark reverse">
        <div className="editorial-visual product-spotlight" aria-hidden="true">
          <ProductMockup color="navy" label="Waypoint" sublabel="Blend" />
        </div>
        <div className="editorial-copy">
          <p className="eyebrow">Freshly roasted</p>
          <h2>
            Super good
            <span>stuff.</span>
          </h2>
          <p>Small-batch coffees roasted for peak flavor, consistency, and momentum.</p>
          <Link className="button primary" to="/subscriptions">
            View subscriptions
          </Link>
        </div>
      </section>

      <section className="section shop-preview">
        <div className="section-heading">
          <p className="eyebrow">Featured coffees</p>
          <h2>Roasted for wherever the day takes you.</h2>
        </div>
        <div className="product-grid">
          {featuredCoffees.map((coffee) => (
            <article className="product-card" key={coffee.name}>
              <div className="product-art">
                <ProductMockup color={coffee.color} label={coffee.name.split(' ')[0]} sublabel={coffee.name.split(' ').slice(1).join(' ')} />
              </div>
              <h3>{coffee.name}</h3>
              <p>{coffee.notes}</p>
              <strong>{coffee.price}</strong>
              <Link to="/subscriptions" className="text-link">
                Subscribe <ArrowRight size={14} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-block navy">
        <div className="editorial-copy centered">
          <p className="eyebrow">Never miss a roast</p>
          <h2>
            Subscribe
            <span>&amp; save.</span>
          </h2>
          <p>
            Get fresh coffee delivered on your schedule. Save 10% on every
            subscription order and keep your daily ritual moving.
          </p>
          <Link className="button primary" to="/subscriptions">
            Explore plans
          </Link>
        </div>
      </section>

      <section className="editorial-block light">
        <div className="editorial-copy">
          <p className="eyebrow">Partnerships</p>
          <h2>
            Wholesale
            <span>inquiries.</span>
          </h2>
          <p>
            Cafés, offices, and retailers — let&apos;s build a coffee program that
            moves your business forward with quality and consistency.
          </p>
          <Link className="button outline" to="/wholesale">
            Get started
          </Link>
        </div>
        <div className="editorial-visual wholesale-visual" aria-hidden="true" />
      </section>

      <section className="editorial-block dark">
        <div className="editorial-copy centered">
          <p className="eyebrow">Say hello</p>
          <h2>
            We&apos;d love
            <span>to hear from you.</span>
          </h2>
          <p>Questions, feedback, or just want to talk coffee? Reach out anytime.</p>
          <Link className="button secondary" to="/contact">
            Contact us
          </Link>
        </div>
      </section>
    </main>
  );
}
