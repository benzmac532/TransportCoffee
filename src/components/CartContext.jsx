import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  addLinesToCart,
  getCart,
  isStorefrontConfigured,
  removeCartLine,
  updateCartLine,
} from '../lib/shopify';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const configured = isStorefrontConfigured();

  const refreshCart = useCallback(async () => {
    if (!configured) return null;
    try {
      const next = await getCart();
      setCart(next);
      return next;
    } catch (err) {
      console.error(err);
      return null;
    }
  }, [configured]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = useCallback(
    async (merchandiseId, quantity = 1) => {
      setLoading(true);
      setError('');
      try {
        const next = await addLinesToCart(merchandiseId, quantity);
        setCart(next);
        setOpen(true);
        return next;
      } catch (err) {
        const message = err.message || 'Could not add to cart.';
        setError(message);
        setOpen(true);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateQuantity = useCallback(async (lineId, quantity) => {
    setLoading(true);
    setError('');
    try {
      const next =
        quantity <= 0 ? await removeCartLine(lineId) : await updateCartLine(lineId, quantity);
      setCart(next);
      return next;
    } catch (err) {
      setError(err.message || 'Could not update cart.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeItem = useCallback(async (lineId) => {
    setLoading(true);
    setError('');
    try {
      const next = await removeCartLine(lineId);
      setCart(next);
      return next;
    } catch (err) {
      setError(err.message || 'Could not remove item.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkout = useCallback(() => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      open,
      loading,
      error,
      configured,
      totalQuantity: cart?.totalQuantity || 0,
      setOpen,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      addItem,
      updateQuantity,
      removeItem,
      checkout,
      refreshCart,
      clearError: () => setError(''),
    }),
    [cart, open, loading, error, configured, addItem, updateQuantity, removeItem, checkout, refreshCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
