import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getCollectionProducts, getProducts, SHOP_COLLECTIONS } from '../lib/shopify';

export default function Shop() {
  const { handle } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const collectionMeta = SHOP_COLLECTIONS.find((item) => item.handle === handle);
  const title = collectionMeta?.label || (handle ? handle.replace(/-/g, ' ') : 'All products');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const list = handle
          ? await getCollectionProducts(handle)
          : await getProducts();
        if (!cancelled) setProducts(list);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Could not load products.');
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [handle]);

  return (
    <main className="page shop-page">
      <div className="shop-mosaic">
        <section className="page-hero">
          <p className="eyebrow">Shop</p>
          <h1>{title}</h1>
        </section>

        <section className="shop-catalog">
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

          {loading && <p className="shop-status">Loading products…</p>}
          {error && <p className="shop-status shop-status-error">{error}</p>}

          {!loading && !error && products.length === 0 && (
            <p className="shop-status">No products found in this collection yet.</p>
          )}

          {!loading && products.length > 0 && (
            <div className="product-grid shop-grid">
              {products.map((product) => (
                <ProductCard key={product.id || product.handle} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
