import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from './ToastContext';
import { getProduct } from '../data/products';

interface WishlistContextValue {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useLocalStorage<string[]>('tm2.saved', ['p10', 'p4', 'p7']);
  const { showToast } = useToast();

  const toggle = useCallback(
    (id: string) => {
      const name = getProduct(id)?.name;
      const had = ids.includes(id);
      setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
      showToast(had ? 'Removed from saved gear' : 'Saved for later', {
        sub: name,
        action: had ? { label: 'Undo', run: () => setIds((prev) => (prev.includes(id) ? prev : [...prev, id])) } : undefined,
      });
    },
    [ids, setIds, showToast],
  );

  const has = useCallback((id: string) => ids.includes(id), [ids]);
  const value = useMemo(() => ({ ids, toggle, has }), [ids, toggle, has]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
