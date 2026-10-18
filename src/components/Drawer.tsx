import { useEffect, useRef, type ReactNode } from 'react';
import s from './Overlay.module.css';
import { Icon } from './Icon';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  side?: 'left' | 'right';
  children: ReactNode;
  footer?: ReactNode;
}

/** Slide-over panel: closes on Escape and backdrop click, returns focus on close. */
export function Drawer({ open, onClose, title, side = 'right', children, footer }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => panel.current?.querySelector<HTMLElement>('button, a, input')?.focus(), 30);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      lastFocus.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className={s.root} role="dialog" aria-modal="true" aria-label={title}>
      <div className={s.backdrop} onClick={onClose} />
      <div ref={panel} className={`${s.drawer} ${side === 'left' ? s.left : s.right}`}>
        <div className={s.drawerHead}>
          <h2 className="h3">{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </div>
        <div className={s.drawerBody}>{children}</div>
        {footer && <div className={s.drawerFoot}>{footer}</div>}
      </div>
    </div>
  );
}
