import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from './ToastContext';

interface WishlistContextValue {
  wishlist: string[];
  toggleWish: (id: string) => void;
  isWished: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useLocalStorage<string[]>('tm.wishlist', ['p3', 'p7']);
  const { showToast } = useToast();

  const toggleWish = useCallback(
    (id: string) => {
      setWishlist((prev) => {
        const has = prev.includes(id);
        if (has) {
          showToast('Removed from saved gear');
          return prev.filter((x) => x !== id);
        }
        showToast('Saved for later');
        return [...prev, id];
      });
    },
    [setWishlist, showToast],
  );

  const isWished = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  const value = useMemo(() => ({ wishlist, toggleWish, isWished }), [wishlist, toggleWish, isWished]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
