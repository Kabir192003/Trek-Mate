import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

export interface ToastData {
  msg: string;
  sub?: string;
}

interface ToastContextValue {
  toast: ToastData | null;
  showToast: (msg: string, sub?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);
  const timer = useRef<number | null>(null);

  const showToast = useCallback((msg: string, sub?: string) => {
    setToast({ msg, sub });
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2200);
  }, []);

  return <ToastContext.Provider value={{ toast, showToast }}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
