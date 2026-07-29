import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from '../components/Reveal';
import PageHero from '../components/PageHero';
import ProductCard from '../components/ProductCard';
import Seo from '../components/Seo';
import { getStaticPageMeta } from '../lib/seoPages';
import { getCollectionProducts, getProducts, SHOP_COLLECTIONS } from '../lib/shopify';

const PRODUCT_KEY = (product) => product.id || product.handle;

function ShopSectionHeading({ id, label, blurb, to, count }) {
  return (
    <div className="shop-section-heading">
      <h2 id={id} className="eyebrow shop-section-label">
        {label}
      </h2>
      {to && (
        <Link className="shop-section-view-all" to={to}>
          View all
          {typeof count === 'number' ? ` (${count})` : ''}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      )}
      {blurb && <p className="shop-section-blurb">{blurb}</p>}
    </div>
  );
}

export default function Shop() {
  const { handle } = useParams();
  const [products, setProducts] = useState([]);
  const [collectionSections, setCollectionSections] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState('');

  const collectionMeta = SHOP_COLLECTIONS.find((item) => item.handle === handle);
  const title = collectionMeta?.label || (handle ? handle.replace(/-/g, ' ') : 'All products');
  const isEmpty = hasLoaded && !error && products.length === 0;
  const seoPath = handle ? `/shop/collections/${handle}` : '/shop';
  const seoMeta = getStaticPageMeta(seoPath);
  const seoTitle = seoMeta?.title || title;
  const seoDescription =
    seoMeta?.description ||
    `Shop ${title} from Transport Coffee Roasters — specialty coffee roasted with care.`;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setError('');
      try {
        if (handle) {
          const list = await getCollectionProducts(handle);
          if (!cancelled) {
            setProducts(list);
            setCollectionSections([]);
          }
          return;
        }

        const allProducts = await getProducts();
        const sections = await Promise.all(
          SHOP_COLLECTIONS.filter((item) => item.handle).map(async (item) => ({
            ...item,
            products: await getCollectionProducts(item.handle),
          })),
        );

        if (!cancelled) {
          setProducts(allProducts);
          setCollectionSections(sections.filter((section) => section.products.length > 0));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Could not load products.');
          setProducts([]);
          setCollectionSections([]);
        }
      } finally {
        if (!cancelled) setHasLoaded(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [handle]);

  const collectionProductKeys = new Set(
    collectionSections.flatMap((section) => section.products.map(PRODUCT_KEY)),
  );
  const uncategorizedProducts = handle
    ? products
    : products.filter((product) => !collectionProductKeys.has(PRODUCT_KEY(product)));

  return (
    <main className={`page shop-page${isEmpty ? ' shop-page-empty' : ''}`}>
      <Seo title={seoTitle} description={seoDescription} path={seoPath} />
      <div className="shop-mosaic">
        <PageHero eyebrow="Transport Coffee Roasters" title="The Shop" />

        <div className={`shop-catalog${isEmpty ? ' shop-catalog-empty' : ''}`}>
          <Reveal className="shop-catalog-toolbar" variant="fade" delaySteps={0}>
            <nav className="shop-collection-nav" aria-label="Shop collections">
              <Link to="/shop" className={!handle ? 'active' : undefined}>
                All
              </Link>
              {SHOP_COLLECTIONS.filter((item) => item.handle).map((item) => (
                <Link
                  key={item.handle}
                  to={item.to}
                  className={handle === item.handle ? 'active' : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            {error && <p className="shop-status shop-status-error">{error}</p>}
            {isEmpty && (
              <div className="shop-coming-soon">
                <p className="eyebrow">Coming soon</p>
                <h2>{title}</h2>
              </div>
            )}
          </Reveal>

          {!handle &&
            collectionSections.map((section, sectionIndex) => (
              <Reveal
                as="section"
                className={`shop-product-section${sectionIndex % 2 === 1 ? ' shop-product-section-alt' : ''}`}
                key={section.handle}
                delaySteps={sectionIndex}
                variant="up"
                aria-labelledby={`shop-section-${section.handle}`}
              >
                <ShopSectionHeading
                  id={`shop-section-${section.handle}`}
                  label={section.label}
                  blurb={section.blurb}
                  to={section.to}
                  count={section.products.length}
                />
                <div className="product-grid shop-grid">
                  {section.products.map((product, index) => (
                    <Reveal key={PRODUCT_KEY(product)} delaySteps={index} variant="up">
                      <ProductCard product={product} />
                    </Reveal>
                  ))}
                </div>
              </Reveal>
            ))}

          {handle && products.length > 0 && (
            <Reveal
              as="section"
              className="shop-product-section"
              variant="up"
              delaySteps={0}
              aria-label={title}
            >
              <ShopSectionHeading
                label={collectionMeta?.label || title}
                blurb={collectionMeta?.blurb}
              />
              <div className="product-grid shop-grid">
                {products.map((product, index) => (
                  <Reveal key={PRODUCT_KEY(product)} delaySteps={index} variant="up">
                    <ProductCard product={product} />
                  </Reveal>
                ))}
              </div>
            </Reveal>
          )}

          {uncategorizedProducts.length > 0 && !handle && (
            <Reveal
              as="section"
              className={`shop-product-section${collectionSections.length % 2 === 1 ? ' shop-product-section-alt' : ''}`}
              variant="up"
              delaySteps={collectionSections.length}
              aria-label="More products"
            >
              <ShopSectionHeading
                label="More from the shop"
                blurb="Additional pieces from the Transport catalog."
              />
              <div className="product-grid shop-grid">
                {uncategorizedProducts.map((product, index) => (
                  <Reveal key={PRODUCT_KEY(product)} delaySteps={index} variant="up">
                    <ProductCard product={product} />
                  </Reveal>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </main>
  );
}
