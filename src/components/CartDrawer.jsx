import { useEffect, useId, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { formatMoney, storefrontConfigHint } from '../lib/shopify';
import { useCart } from './CartContext';
import ShopifyImage from './ShopifyImage';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusable(container) {
  if (!container) return [];
  return [...container.querySelectorAll(FOCUSABLE_SELECTOR)].filter(
    (node) => !node.hasAttribute('disabled') && node.getAttribute('aria-hidden') !== 'true',
  );
}

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

  const titleId = useId();
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    previouslyFocusedRef.current = document.activeElement;
    const panel = panelRef.current;
    const closeButton = closeButtonRef.current;
    const focusables = getFocusable(panel);
    (closeButton || focusables[0] || panel)?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeCart();
        return;
      }

      if (event.key !== 'Tab' || !panel) return;

      const items = getFocusable(panel);
      if (items.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && (active === last || !panel.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      const previous = previouslyFocusedRef.current;
      if (previous && typeof previous.focus === 'function') {
        previous.focus();
      }
    };
  }, [open, closeCart]);

  if (!open) return null;

  const lines = cart?.lines || [];
  const subtotal = cart?.cost?.subtotalAmount;

  return (
    <div
      ref={rootRef}
      className="cart-drawer-root"
      role="presentation"
    >
      <button
        type="button"
        className="cart-drawer-backdrop"
        aria-label="Close cart"
        onClick={closeCart}
      />
      <aside
        ref={panelRef}
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <header className="cart-drawer-header">
          <h2 id={titleId}>
            <ShoppingBag size={18} aria-hidden="true" /> Your cart
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="cart-icon-button"
            aria-label="Close cart"
            onClick={closeCart}
          >
            <X size={20} />
          </button>
        </header>

        {!configured && (
          <p className="cart-drawer-note">
            {storefrontConfigHint()} Product browsing still works from the live store catalog.
          </p>
        )}

        {error && (
          <p className="cart-drawer-error" role="alert">
            {error}
          </p>
        )}

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
                    <ShopifyImage
                      url={line.merchandise.image.url}
                      alt={line.merchandise.image.altText || line.merchandise.productTitle}
                      widths={[120, 200, 320]}
                      sizes="72px"
                      width={200}
                    />
                  ) : (
                    <div className="cart-line-placeholder" />
                  )}
                  <div className="cart-line-meta">
                    <strong>{line.merchandise.productTitle}</strong>
                    {line.merchandise.title !== 'Default Title' && <span>{line.merchandise.title}</span>}
                    <span>
                      {formatMoney(
                        line.cost?.amount || line.merchandise.price?.amount,
                        line.cost?.currencyCode || line.merchandise.price?.currencyCode,
                      )}
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
              <button
                type="button"
                className="button"
                disabled={loading || !cart?.checkoutUrl}
                onClick={checkout}
              >
                Checkout
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
