import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

export interface ToastAction {
  label: string;
  run: () => void;
}

export interface ToastData {
  id: number;
  title: string;
  sub?: string;
  action?: ToastAction;
}

interface ToastContextValue {
  toast: ToastData | null;
  showToast: (title: string, opts?: { sub?: string; action?: ToastAction }) => void;
  dismiss: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);
  const timer = useRef<number | null>(null);
  const seq = useRef(0);

  const dismiss = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    setToast(null);
  }, []);

  const showToast = useCallback((title: string, opts?: { sub?: string; action?: ToastAction }) => {
    seq.current += 1;
    setToast({ id: seq.current, title, sub: opts?.sub, action: opts?.action });
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), opts?.action ? 5200 : 3200);
  }, []);

  return <ToastContext.Provider value={{ toast, showToast, dismiss }}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
