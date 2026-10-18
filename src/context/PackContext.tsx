import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from './ToastContext';
import { getProduct } from '../data/products';
import {
  SAMPLE_TRIP,
  bestSwaps,
  itemFromProduct,
  newUid,
  samplePack,
  totals as computeTotals,
  tripChecks,
  type Check,
  type Swap,
  type Totals,
} from '../lib/pack';
import type { Kind, PackItem, Product, ProductAttrs, SystemId, Trip, WeightPoint } from '../data/types';

interface PackContextValue {
  trip: Trip;
  setTrip: (patch: Partial<Trip>) => void;
  /** Everything you own or plan to carry: the pack plus the gear closet. */
  items: PackItem[];
  packed: PackItem[];
  closet: PackItem[];
  totals: Totals;
  checks: Check[];
  swaps: Swap[];
  history: WeightPoint[];
  inPack: (productId: string) => PackItem | undefined;
  addProduct: (p: Product, opts?: { owned?: boolean; quiet?: boolean }) => void;
  addOwn: (input: { name: string; system: SystemId; kind: Kind; grams: number; attrs?: ProductAttrs }) => void;
  update: (uid: string, patch: Partial<PackItem>) => void;
  remove: (uid: string) => void;
  deleteForever: (uid: string) => void;
  applySwap: (s: Swap, quiet?: boolean) => void;
  applySwaps: (s: Swap[]) => void;
  markOwned: (productIds: string[]) => void;
  loadSample: () => void;
  clearPack: () => void;
}

const PackContext = createContext<PackContextValue | null>(null);

// A believable trail of past base weights, so the dashboard has history on day one.
const SEED_HISTORY: WeightPoint[] = [
  { t: '2026-04-12T09:00:00Z', base: 10120 },
  { t: '2026-05-03T09:00:00Z', base: 9380 },
  { t: '2026-06-21T09:00:00Z', base: 8960 },
  { t: '2026-08-14T09:00:00Z', base: 8410 },
  { t: '2026-09-29T09:00:00Z', base: 8190 },
];

export function PackProvider({ children }: { children: ReactNode }) {
  const [trip, setTripState] = useLocalStorage<Trip>('tm2.trip', SAMPLE_TRIP);
  const [items, setItems] = useLocalStorage<PackItem[]>('tm2.pack', samplePack);
  const [history, setHistory] = useLocalStorage<WeightPoint[]>('tm2.history', SEED_HISTORY);
  const { showToast } = useToast();

  const packed = useMemo(() => items.filter((i) => i.inPack), [items]);
  const closet = useMemo(() => items.filter((i) => i.owned), [items]);
  const totals = useMemo(() => computeTotals(items), [items]);
  const checks = useMemo(() => tripChecks(items, trip), [items, trip]);
  const swaps = useMemo(() => bestSwaps(items, trip), [items, trip]);

  // Record base weight over time (debounced, one point per settled change).
  const timer = useRef<number | null>(null);
  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setHistory((prev) => {
        const last = prev[prev.length - 1];
        if (last && Math.abs(last.base - totals.base) < 1) return prev;
        return [...prev, { t: new Date().toISOString(), base: totals.base }].slice(-60);
      });
    }, 1200);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [totals.base, setHistory]);

  const setTrip = useCallback((patch: Partial<Trip>) => setTripState((prev) => ({ ...prev, ...patch })), [setTripState]);

  const inPack = useCallback((productId: string) => items.find((i) => i.inPack && i.productId === productId), [items]);

  const addProduct = useCallback<PackContextValue['addProduct']>(
    (p, opts) => {
      const existing = items.find((i) => i.productId === p.id);
      if (existing?.inPack) {
        if (!opts?.quiet) showToast('Already in your pack', { sub: p.name });
        return;
      }
      if (existing) setItems((prev) => prev.map((i) => (i.uid === existing.uid ? { ...i, inPack: true } : i)));
      else setItems((prev) => [...prev, itemFromProduct(p, !!opts?.owned)]);
      if (!opts?.quiet) showToast('Added to your pack', { sub: `${p.name} · ${p.measuredGrams.toLocaleString('en-US')} g` });
    },
    [items, setItems, showToast],
  );

  const addOwn = useCallback<PackContextValue['addOwn']>(
    (input) => {
      setItems((prev) => [
        ...prev,
        { uid: newUid(), source: 'own', name: input.name, system: input.system, kind: input.kind, grams: input.grams, qty: 1, worn: input.system === 'footwear', owned: true, inPack: true, attrs: input.attrs },
      ]);
      showToast('Added your gear', { sub: input.name });
    },
    [setItems, showToast],
  );

  const update = useCallback(
    (uid: string, patch: Partial<PackItem>) => setItems((prev) => prev.map((i) => (i.uid === uid ? { ...i, ...patch } : i))),
    [setItems],
  );

  const remove = useCallback(
    (uid: string) => {
      const item = items.find((i) => i.uid === uid);
      if (!item) return;
      const snapshot = items;
      // Owned gear goes back to the closet; planned purchases simply leave the plan.
      setItems((prev) => (item.owned ? prev.map((i) => (i.uid === uid ? { ...i, inPack: false } : i)) : prev.filter((i) => i.uid !== uid)));
      showToast(item.owned ? 'Moved to your gear closet' : 'Removed from your pack', {
        sub: item.name,
        action: { label: 'Undo', run: () => setItems(snapshot) },
      });
    },
    [items, setItems, showToast],
  );

  const deleteForever = useCallback(
    (uid: string) => {
      const snapshot = items;
      const item = items.find((i) => i.uid === uid);
      setItems((prev) => prev.filter((i) => i.uid !== uid));
      showToast('Deleted from your closet', { sub: item?.name, action: { label: 'Undo', run: () => setItems(snapshot) } });
    },
    [items, setItems, showToast],
  );

  const swapIn = (prev: PackItem[], s: Swap): PackItem[] => {
    const out = prev.map((i) => (i.uid === s.item.uid ? (i.owned ? { ...i, inPack: false } : null) : i)).filter((i): i is PackItem => i !== null);
    const existing = out.find((i) => i.productId === s.product.id);
    if (existing) return out.map((i) => (i.uid === existing.uid ? { ...i, inPack: true, qty: s.item.qty } : i));
    return [...out, { ...itemFromProduct(s.product, false), qty: s.item.qty }];
  };

  const applySwap = useCallback(
    (s: Swap, quiet = false) => {
      const snapshot = items;
      setItems((prev) => swapIn(prev, s));
      if (!quiet)
        showToast(`Swapped in ${s.product.name}`, {
          sub: `${Math.round(s.saves).toLocaleString('en-US')} g lighter${s.item.owned ? ' · old one kept in your closet' : ''}`,
          action: { label: 'Undo', run: () => setItems(snapshot) },
        });
    },
    [items, setItems, showToast],
  );

  const applySwaps = useCallback(
    (list: Swap[]) => {
      if (!list.length) return;
      const snapshot = items;
      setItems((prev) => list.reduce((acc, s) => swapIn(acc, s), prev));
      const saved = list.reduce((n, s) => n + s.saves, 0);
      showToast(`${list.length} swaps applied`, {
        sub: `${Math.round(saved).toLocaleString('en-US')} g lighter`,
        action: { label: 'Undo', run: () => setItems(snapshot) },
      });
    },
    [items, setItems, showToast],
  );

  const markOwned = useCallback(
    (productIds: string[]) =>
      setItems((prev) => {
        let next = prev.map((i) => (i.productId && productIds.includes(i.productId) ? { ...i, owned: true } : i));
        for (const id of productIds) {
          if (next.some((i) => i.productId === id)) continue;
          const p = getProduct(id);
          if (p) next = [...next, { ...itemFromProduct(p, true), inPack: false }];
        }
        return next;
      }),
    [setItems],
  );

  const loadSample = useCallback(() => {
    const snapshot = items;
    const tripSnap = trip;
    setItems(samplePack());
    setTripState(SAMPLE_TRIP);
    showToast('Loaded the sample pack', {
      sub: 'Three Sisters loop · 3 nights',
      action: {
        label: 'Undo',
        run: () => {
          setItems(snapshot);
          setTripState(tripSnap);
        },
      },
    });
  }, [items, trip, setItems, setTripState, showToast]);

  const clearPack = useCallback(() => {
    const snapshot = items;
    setItems((prev) => prev.filter((i) => i.owned).map((i) => ({ ...i, inPack: false })));
    showToast('Pack cleared', { sub: 'Your owned gear is still in the closet', action: { label: 'Undo', run: () => setItems(snapshot) } });
  }, [items, setItems, showToast]);

  const value = useMemo(
    () => ({
      trip,
      setTrip,
      items,
      packed,
      closet,
      totals,
      checks,
      swaps,
      history,
      inPack,
      addProduct,
      addOwn,
      update,
      remove,
      deleteForever,
      applySwap,
      applySwaps,
      markOwned,
      loadSample,
      clearPack,
    }),
    [trip, setTrip, items, packed, closet, totals, checks, swaps, history, inPack, addProduct, addOwn, update, remove, deleteForever, applySwap, applySwaps, markOwned, loadSample, clearPack],
  );

  return <PackContext.Provider value={value}>{children}</PackContext.Provider>;
}

export function usePack() {
  const ctx = useContext(PackContext);
  if (!ctx) throw new Error('usePack must be used within PackProvider');
  return ctx;
}
