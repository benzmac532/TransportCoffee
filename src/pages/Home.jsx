import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FEATURED_HANDLES, formatMoney, getProductsByHandles } from '../lib/shopify';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadingFeatured(true);
      try {
        const products = await getProductsByHandles(FEATURED_HANDLES);
        if (!cancelled) setFeatured(products);
      } catch (err) {
        console.error(err);
        if (!cancelled) setFeatured([]);
      } finally {
        if (!cancelled) setLoadingFeatured(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main>
      <section className="home-quad">
        <div className="perc-hero-copy">
          <div className="perc-hero-media" aria-hidden="true">
            <video
              className="perc-hero-video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/open-roaster.png"
            >
              <source src="/roaster.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="perc-hero-content">
            <p className="eyebrow">Est. 2026</p>
            <h1>
              <span>Coffee that</span>
              <span>moves you.</span>
            </h1>
            <p className="lead">
              We source thoughtful coffees and roast them with every ounce of care.
              Coffee should fuel your journey. Let&apos;s move forward together.
            </p>
            <div className="hero-actions">
              <Link className="button" to="/subscriptions">
                Shop subscriptions
              </Link>
              <Link className="button ghost" to="/shop">
                Shop coffee
              </Link>
            </div>
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
            We craft coffee with intention, designed to forge the path from here
            to there. Built for momentum and grounded in quality.
          </p>
          <Link className="button" to="/about">
            Our story
          </Link>
        </div>
      </section>

      <section className="section shop-preview">
        <div className="section-heading">
          <h2>Coffee for the journey.</h2>
          <Link className="text-link shop-preview-all" to="/shop">
            View all products <ArrowRight size={14} />
          </Link>
        </div>
        {loadingFeatured && <p className="shop-status">Loading featured coffees…</p>}
        {!loadingFeatured && featured.length === 0 && (
          <p className="shop-status">
            Featured coffees will appear here once the Shopify catalog is reachable.
          </p>
        )}
        {featured.length > 0 && (
          <div className="product-grid">
            {featured.map((product) => (
              <article className="product-card" key={product.handle}>
                <Link className="product-art" to={`/shop/${product.handle}`}>
                  {product.image?.url ? (
                    <img src={product.image.url} alt={product.image.altText || product.title} />
                  ) : (
                    <div className="product-art-placeholder" aria-hidden="true" />
                  )}
                </Link>
                <h3>
                  <Link to={`/shop/${product.handle}`}>{product.title}</Link>
                </h3>
                {product.description && (
                  <p>
                    {product.description.slice(0, 90)}
                    {product.description.length > 90 ? '…' : ''}
                  </p>
                )}
                <div className="product-card-footer">
                  {product.price && (
                    <strong>
                      {formatMoney(product.price.amount, product.price.currencyCode)}
                    </strong>
                  )}
                  <Link className="button" to={`/shop/${product.handle}`}>
                    Shop now <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
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
            Cafés, offices, and retailers. Let&apos;s build a coffee program that
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
