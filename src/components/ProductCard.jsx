import { Link } from 'react-router-dom';
import { formatMoney } from '../lib/shopify';

export default function ProductCard({ product }) {
  if (!product) return null;

  const price = product.price
    ? formatMoney(product.price.amount, product.price.currencyCode)
    : '';

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
      {product.description && <p>{product.description.slice(0, 110)}{product.description.length > 110 ? '…' : ''}</p>}
      {price && <strong>{price}</strong>}
      <Link className="button" to={`/shop/${product.handle}`}>
        View product
      </Link>
    </article>
  );
}
