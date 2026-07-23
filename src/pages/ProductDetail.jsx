import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import Reveal from '../components/Reveal';
import Seo from '../components/Seo';
import ShopifyImage from '../components/ShopifyImage';
import { DEFAULT_DESCRIPTION } from '../lib/site';
import { formatMoney, getProductByHandle, storefrontConfigHint } from '../lib/shopify';
import NotFound from './NotFound';

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function ProductDetail() {
  const { handle } = useParams();
  const { addItem, loading: cartLoading, configured } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState('');
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const mediaRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const next = await getProductByHandle(handle);
        if (cancelled) return;
        if (!next) {
          setError('Product not found.');
          setProduct(null);
          return;
        }
        setProduct(next);
        const initial = {};
        (next.options || []).forEach((option) => {
          const name = typeof option.name === 'string' ? option.name : String(option.name || '');
          const firstValue = option.values?.[0];
          if (name && firstValue != null && typeof firstValue !== 'object') {
            initial[name] = String(firstValue);
          }
        });
        setSelectedOptions(initial);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Could not load product.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [handle]);

  const selectedVariant = useMemo(() => {
    if (!product?.variants?.length) return null;
    if (!product.options?.length) return product.variants[0];

    return (
      product.variants.find((variant) =>
        (variant.selectedOptions || []).every(
          (opt) => selectedOptions[opt.name] === opt.value,
        ),
      ) || product.variants[0]
    );
  }, [product, selectedOptions]);

  function updateZoomOrigin(event) {
    const node = mediaRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  }

  function handleMediaEnter(event) {
    if (prefersReducedMotion()) return;
    setZoomActive(true);
    updateZoomOrigin(event);
  }

  function handleMediaMove(event) {
    if (!zoomActive || prefersReducedMotion()) return;
    updateZoomOrigin(event);
  }

  function handleMediaLeave() {
    setZoomActive(false);
    setZoomOrigin({ x: 50, y: 50 });
  }

  async function handleAddToCart() {
    if (!selectedVariant?.id) return;
    setNotice('');
    setAdding(true);
    try {
      await addItem(selectedVariant.id, quantity);
      setNotice('Added to cart.');
    } catch (err) {
      setNotice(err.message || 'Could not add to cart.');
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return (
      <main className="page shop-page product-detail-page">
        <Seo
          title="Loading product"
          description={DEFAULT_DESCRIPTION}
          path={`/shop/${handle}`}
          noindex
        />
        <section className="section">
          <p className="shop-status">Loading product…</p>
        </section>
      </main>
    );
  }

  if (error || !product) {
    return (
      <NotFound
        title="Product not found"
        message={
          error && error !== 'Product not found.'
            ? error
            : "We couldn't find that product (or it may have left the catalog). Browse the shop for what's available now."
        }
        primaryTo="/shop"
        primaryLabel="Back to shop"
        secondaryTo="/"
        secondaryLabel="Back home"
        path={`/shop/${handle}`}
      />
    );
  }

  const price = selectedVariant?.price
    ? formatMoney(selectedVariant.price.amount, selectedVariant.price.currencyCode)
    : '';

  const optionFields = (product.options || []).filter(
    (option) => Array.isArray(option.values) && option.values.length > 1,
  );

  return (
    <main className="page shop-page product-detail-page">
      <Seo
        title={product.title}
        description={product.description || DEFAULT_DESCRIPTION}
        path={`/shop/${product.handle || handle}`}
        image={product.image?.url}
        imageAlt={product.image?.altText || product.title}
        type="product"
      />
      <section className="section product-detail">
        <Reveal className="product-detail-shell" variant="up">
          <Link className="text-link product-back" to="/shop">
            ← Back to shop
          </Link>

          <div className="product-detail-panel">
            <div
              className={`product-detail-media${zoomActive ? ' is-zooming' : ''}`}
              ref={mediaRef}
              onMouseEnter={handleMediaEnter}
              onMouseMove={handleMediaMove}
              onMouseLeave={handleMediaLeave}
            >
              {product.image?.url ? (
                <ShopifyImage
                  url={product.image.url}
                  alt={product.image.altText || product.title}
                  widths={[400, 640, 800, 1200, 1600]}
                  sizes="(max-width: 1040px) 100vw, 50vw"
                  width={1200}
                  loading="eager"
                  fetchPriority="high"
                  style={{
                    transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                  }}
                />
              ) : (
                <div className="product-art-placeholder" />
              )}
            </div>

            <div className="product-detail-copy">
              <div className="product-detail-intro">
                <p className="eyebrow">{product.productType || 'Product'}</p>
                <h1>{product.title}</h1>
                {price && <p className="product-detail-price">{price}</p>}
                {product.description && (
                  <p className="product-detail-desc">{product.description}</p>
                )}
              </div>

              <div className="product-detail-buybox">
                <div className="product-option-row">
                  {optionFields.map((option) => {
                    const optionName =
                      typeof option.name === 'string'
                        ? option.name
                        : String(option.name || 'Option');
                    return (
                      <label key={option.id || optionName} className="product-option">
                        <span>{optionName}</span>
                        <select
                          value={selectedOptions[optionName] || ''}
                          onChange={(event) =>
                            setSelectedOptions((prev) => ({
                              ...prev,
                              [optionName]: event.target.value,
                            }))
                          }
                        >
                          {option.values.map((value) => {
                            const label = typeof value === 'string' ? value : String(value);
                            return (
                              <option key={label} value={label}>
                                {label}
                              </option>
                            );
                          })}
                        </select>
                      </label>
                    );
                  })}

                  <label className="product-option product-option-qty">
                    <span>Quantity</span>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={quantity}
                      onChange={(event) =>
                        setQuantity(Math.max(1, Number(event.target.value) || 1))
                      }
                    />
                  </label>
                </div>

                <button
                  type="button"
                  className="button product-detail-cta"
                  disabled={adding || cartLoading || !selectedVariant?.availableForSale}
                  onClick={handleAddToCart}
                >
                  {!selectedVariant?.availableForSale
                    ? 'Sold out'
                    : adding
                      ? 'Adding…'
                      : 'Add to cart'}
                </button>

                {!configured && (
                  <p className="shop-status">{storefrontConfigHint()}</p>
                )}
                {notice && (
                  <p
                    className={`shop-status${notice === 'Added to cart.' ? '' : ' shop-status-error'}`}
                    role={notice === 'Added to cart.' ? 'status' : 'alert'}
                  >
                    {notice}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
