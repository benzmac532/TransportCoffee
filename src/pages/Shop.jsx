import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getCollectionProducts, getProducts, SHOP_COLLECTIONS } from '../lib/shopify';

const PRODUCT_KEY = (product) => product.id || product.handle;

export default function Shop() {
  const { handle } = useParams();
  const [products, setProducts] = useState([]);
  const [collectionSections, setCollectionSections] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState('');

  const collectionMeta = SHOP_COLLECTIONS.find((item) => item.handle === handle);
  const title = collectionMeta?.label || (handle ? handle.replace(/-/g, ' ') : 'All products');
  const isEmpty = hasLoaded && !error && products.length === 0;

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
      <div className="shop-mosaic">
        <section className="page-hero">
          <p className="eyebrow">Shop</p>
          <h1>{title}</h1>
        </section>

        <section className={`shop-catalog${isEmpty ? ' shop-catalog-empty' : ''}`}>
          <div className="shop-collection-nav" aria-label="Shop collections">
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
          </div>

          {error && <p className="shop-status shop-status-error">{error}</p>}

          {isEmpty && (
            <div className="shop-coming-soon">
              <p className="eyebrow">Coming soon</p>
              <h2>{title}</h2>
            </div>
          )}

          {!handle && collectionSections.length > 0 && (
            <div className="shop-section-list">
              {collectionSections.map((section) => (
                <section className="shop-product-section" key={section.handle}>
                  <Link to={section.to} className="shop-section-title">
                    {section.label}
                  </Link>
                  <div className="product-grid shop-grid">
                    {section.products.map((product) => (
                      <ProductCard key={PRODUCT_KEY(product)} product={product} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {uncategorizedProducts.length > 0 && (
            <div className="product-grid shop-grid">
              {uncategorizedProducts.map((product) => (
                <ProductCard key={PRODUCT_KEY(product)} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
