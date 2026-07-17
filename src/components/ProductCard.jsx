import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatMoney } from '../lib/shopify';
import { useCart } from './CartContext';

export default function ProductCard({ product }) {
  const { addItem, loading: cartLoading, configured } = useCart();
  const [adding, setAdding] = useState(false);

  if (!product) return null;

  const price = product.price
    ? formatMoney(product.price.amount, product.price.currencyCode)
    : '';

  const variant =
    product.variants?.find((v) => v.availableForSale) || product.variants?.[0];
  const canAdd = Boolean(variant?.id && variant.availableForSale !== false);

  async function handleAddToCart() {
    if (!variant?.id) return;
    setAdding(true);
    try {
      await addItem(variant.id, 1);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  }

  return (
    <article className="product-card">
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
          {product.description.slice(0, 110)}
          {product.description.length > 110 ? '…' : ''}
        </p>
      )}
      <div className="product-card-footer">
        {price && <strong>{price}</strong>}
        <div className="product-card-actions">
          <Link className="button ghost-dark" to={`/shop/${product.handle}`}>
            Learn more
          </Link>
          <button
            type="button"
            className="button"
            disabled={adding || cartLoading || !canAdd || !configured}
            onClick={handleAddToCart}
          >
            {!canAdd ? 'Sold out' : adding ? 'Adding…' : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  );
}
