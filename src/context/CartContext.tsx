import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from './ToastContext';
import { getProduct } from '../data/products';
import type { Product } from '../data/types';

export interface CartLine {
  productId: string;
  color: string;
  size: string;
  qty: number;
}

export interface CartEntry extends CartLine {
  product: Product;
  key: string;
}

interface CartContextValue {
  entries: CartEntry[];
  add: (p: Product, opts?: { color?: string; size?: string; qty?: number; quiet?: boolean }) => void;
  addMany: (ps: Product[]) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  subtotal: number;
  count: number;
  grams: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const keyOf = (l: Pick<CartLine, 'productId' | 'size' | 'color'>) => `${l.productId}__${l.size}__${l.color}`;

export const FREE_SHIPPING_AT = 150;
export const SHIPPING_FLAT = 8;
export const EXPRESS_FEE = 18;

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useLocalStorage<CartLine[]>('tm2.cart', []);
  const { showToast } = useToast();

  const upsert = useCallback(
    (l: CartLine) =>
      setLines((prev) => {
        const k = keyOf(l);
        const i = prev.findIndex((x) => keyOf(x) === k);
        if (i < 0) return [...prev, l];
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + l.qty };
        return next;
      }),
    [setLines],
  );

  const add = useCallback<CartContextValue['add']>(
    (p, opts) => {
      upsert({ productId: p.id, color: opts?.color ?? p.colors[0]?.name ?? '', size: opts?.size ?? p.sizes[0] ?? '', qty: opts?.qty ?? 1 });
      if (!opts?.quiet) showToast('Added to cart', { sub: p.name });
    },
    [upsert, showToast],
  );

  const addMany = useCallback(
    (ps: Product[]) => {
      ps.forEach((p) => upsert({ productId: p.id, color: p.colors[0]?.name ?? '', size: p.sizes[0] ?? '', qty: 1 }));
      showToast(`${ps.length} item${ps.length === 1 ? '' : 's'} added to cart`, { sub: 'Only what your pack is missing' });
    },
    [upsert, showToast],
  );

  const setQty = useCallback(
    (key: string, qty: number) => setLines((prev) => prev.map((l) => (keyOf(l) === key ? { ...l, qty: Math.max(1, Math.min(9, qty)) } : l))),
    [setLines],
  );

  const remove = useCallback(
    (key: string) => {
      const removed = lines.find((l) => keyOf(l) === key);
      setLines((prev) => prev.filter((l) => keyOf(l) !== key));
      if (!removed) return;
      showToast('Removed from cart', {
        sub: getProduct(removed.productId)?.name,
        action: { label: 'Undo', run: () => upsert(removed) },
      });
    },
    [lines, setLines, showToast, upsert],
  );

  const clear = useCallback(() => setLines([]), [setLines]);

  const entries = useMemo<CartEntry[]>(
    () =>
      lines.flatMap((l) => {
        const product = getProduct(l.productId);
        return product ? [{ ...l, product, key: keyOf(l) }] : [];
      }),
    [lines],
  );

  const subtotal = useMemo(() => entries.reduce((s, e) => s + e.product.price * e.qty, 0), [entries]);
  const count = useMemo(() => entries.reduce((s, e) => s + e.qty, 0), [entries]);
  const grams = useMemo(() => entries.reduce((s, e) => s + e.product.measuredGrams * e.qty, 0), [entries]);

  const value = useMemo(
    () => ({ entries, add, addMany, setQty, remove, clear, subtotal, count, grams }),
    [entries, add, addMany, setQty, remove, clear, subtotal, count, grams],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
