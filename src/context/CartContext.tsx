import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from './ToastContext';
import type { CartItem, Product } from '../data/types';

interface CartContextValue {
  cart: CartItem[];
  addToCart: (product: Product, color: string, size: string, qty?: number) => void;
  changeQty: (item: CartItem, delta: number) => void;
  removeItem: (item: CartItem) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const key = (id: string, size: string, color: string) => `${id}__${size}__${color}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useLocalStorage<CartItem[]>('tm.cart', []);
  const { showToast } = useToast();

  const addToCart = useCallback(
    (product: Product, color: string, size: string, qty = 1) => {
      setCart((prev) => {
        const idx = prev.findIndex((x) => key(x.id, x.size, x.color) === key(product.id, size, color));
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + qty };
          return next;
        }
        return [...prev, { ...product, color, size, qty }];
      });
      showToast('Added to cart', product.name);
    },
    [setCart, showToast],
  );

  const changeQty = useCallback(
    (item: CartItem, delta: number) => {
      setCart((prev) =>
        prev.map((x) =>
          key(x.id, x.size, x.color) === key(item.id, item.size, item.color)
            ? { ...x, qty: Math.max(1, x.qty + delta) }
            : x,
        ),
      );
    },
    [setCart],
  );

  const removeItem = useCallback(
    (item: CartItem) => {
      setCart((prev) => prev.filter((x) => key(x.id, x.size, x.color) !== key(item.id, item.size, item.color)));
    },
    [setCart],
  );

  const clearCart = useCallback(() => setCart([]), [setCart]);

  const subtotal = useMemo(() => cart.reduce((s, it) => s + it.price * it.qty, 0), [cart]);
  const itemCount = useMemo(() => cart.reduce((s, it) => s + it.qty, 0), [cart]);

  const value = useMemo(
    () => ({ cart, addToCart, changeQty, removeItem, clearCart, subtotal, itemCount }),
    [cart, addToCart, changeQty, removeItem, clearCart, subtotal, itemCount],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
