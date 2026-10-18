import { useEffect, useState } from 'react';

/** State that persists to localStorage. `initial` may be a lazy factory. */
export function useLocalStorage<T>(key: string, initial: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    const fallback = () => (typeof initial === 'function' ? (initial as () => T)() : initial);
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback();
    } catch {
      return fallback();
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable (private mode): keep working in memory */
    }
  }, [key, value]);

  return [value, setValue] as const;
}
