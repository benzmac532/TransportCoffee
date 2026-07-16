import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import { formatMoney, getProductByHandle, storefrontConfigHint } from '../lib/shopify';

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
      <main className="page shop-page">
        <section className="section">
          <p className="shop-status">Loading product…</p>
        </section>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="page shop-page">
        <section className="section">
          <p className="shop-status shop-status-error">{error || 'Product not found.'}</p>
          <Link className="button" to="/shop">
            Back to shop
          </Link>
        </section>
      </main>
    );
  }

  const price = selectedVariant?.price
    ? formatMoney(selectedVariant.price.amount, selectedVariant.price.currencyCode)
    : '';

  return (
    <main className="page shop-page">
      <section className="section product-detail">
        <Link className="text-link product-back" to="/shop">
          ← Back to shop
        </Link>

        <div className="product-detail-grid">
          <div className="product-detail-media">
            {product.image?.url ? (
              <img src={product.image.url} alt={product.image.altText || product.title} />
            ) : (
              <div className="product-art-placeholder" />
            )}
          </div>

          <div className="product-detail-copy">
            <p className="eyebrow">Coffee</p>
            <h1>{product.title}</h1>
            {price && <p className="product-detail-price">{price}</p>}

            {product.description && <p className="product-detail-desc">{product.description}</p>}

            {(product.options || [])
              .filter((option) => Array.isArray(option.values) && option.values.length > 1)
              .map((option) => {
                const optionName = typeof option.name === 'string' ? option.name : String(option.name || 'Option');
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

            <label className="product-option">
              <span>Quantity</span>
              <input
                type="number"
                min={1}
                max={20}
                value={quantity}
                onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
              />
            </label>

            <button
              type="button"
              className="button"
              disabled={
                adding ||
                cartLoading ||
                !selectedVariant?.availableForSale
              }
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
            {notice && <p className="shop-status">{notice}</p>}
          </div>
        </div>
      </section>
    </main>
  );
}
