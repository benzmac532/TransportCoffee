import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { formatMoney, storefrontConfigHint } from '../lib/shopify';
import { useCart } from './CartContext';

export default function CartDrawer() {
  const {
    cart,
    open,
    loading,
    error,
    configured,
    closeCart,
    updateQuantity,
    removeItem,
    checkout,
  } = useCart();

  if (!open) return null;

  const lines = cart?.lines || [];
  const subtotal = cart?.cost?.subtotalAmount;

  return (
    <div className="cart-drawer-root" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button type="button" className="cart-drawer-backdrop" aria-label="Close cart" onClick={closeCart} />
      <aside className="cart-drawer">
        <header className="cart-drawer-header">
          <h2>
            <ShoppingBag size={18} aria-hidden="true" /> Your cart
          </h2>
          <button type="button" className="cart-icon-button" aria-label="Close cart" onClick={closeCart}>
            <X size={20} />
          </button>
        </header>

        {!configured && (
          <p className="cart-drawer-note">
            {storefrontConfigHint()} Product browsing still works from the live store catalog.
          </p>
        )}

        {error && <p className="cart-drawer-error">{error}</p>}

        {lines.length === 0 ? (
          <div className="cart-drawer-empty">
            <p>Your cart is empty.</p>
            <Link className="button" to="/shop" onClick={closeCart}>
              Browse coffee
            </Link>
          </div>
        ) : (
          <>
            <ul className="cart-line-list">
              {lines.map((line) => (
                <li key={line.id} className="cart-line">
                  {line.merchandise.image?.url ? (
                    <img
                      src={line.merchandise.image.url}
                      alt={line.merchandise.image.altText || line.merchandise.productTitle}
                    />
                  ) : (
                    <div className="cart-line-placeholder" />
                  )}
                  <div className="cart-line-meta">
                    <strong>{line.merchandise.productTitle}</strong>
                    {line.merchandise.title !== 'Default Title' && <span>{line.merchandise.title}</span>}
                    <span>
                      {formatMoney(line.cost?.amount || line.merchandise.price?.amount, line.cost?.currencyCode || line.merchandise.price?.currencyCode)}
                    </span>
                    <div className="cart-qty">
                      <button
                        type="button"
                        disabled={loading}
                        aria-label="Decrease quantity"
                        onClick={() => updateQuantity(line.id, line.quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span>{line.quantity}</span>
                      <button
                        type="button"
                        disabled={loading}
                        aria-label="Increase quantity"
                        onClick={() => updateQuantity(line.id, line.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        type="button"
                        className="cart-remove"
                        disabled={loading}
                        onClick={() => removeItem(line.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="cart-drawer-footer">
              <div className="cart-subtotal">
                <span>Subtotal</span>
                <strong>
                  {subtotal ? formatMoney(subtotal.amount, subtotal.currencyCode) : '-'}
                </strong>
              </div>
              <p className="cart-drawer-note">Taxes and shipping calculated at Shopify checkout.</p>
              <button type="button" className="button" disabled={loading || !cart?.checkoutUrl} onClick={checkout}>
                Checkout
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
