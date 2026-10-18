import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Units } from '../lib/format';

interface PrefsContextValue {
  units: Units;
  setUnits: (u: Units) => void;
}

const PrefsContext = createContext<PrefsContextValue | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [units, setUnits] = useLocalStorage<Units>('tm2.units', 'metric');
  const value = useMemo(() => ({ units, setUnits }), [units, setUnits]);
  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error('usePrefs must be used within PrefsProvider');
  return ctx;
}
