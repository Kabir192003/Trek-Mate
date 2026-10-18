import s from './Overlay.module.css';
import { Icon } from './Icon';
import { useToast } from '../context/ToastContext';

export function Toast() {
  const { toast, dismiss } = useToast();
  return (
    <div className={s.toastRegion} role="status" aria-live="polite">
      {toast && (
        <div key={toast.id} className={s.toast}>
          <span className={s.toastIcon}>
            <Icon name="check" size={16} />
          </span>
          <div className={s.toastText}>
            <strong>{toast.title}</strong>
            {toast.sub && <span>{toast.sub}</span>}
          </div>
          {toast.action && (
            <button
              type="button"
              className={s.toastAction}
              onClick={() => {
                toast.action?.run();
                dismiss();
              }}
            >
              {toast.action.label}
            </button>
          )}
          <button type="button" className={s.toastClose} onClick={dismiss} aria-label="Dismiss">
            <Icon name="close" size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
