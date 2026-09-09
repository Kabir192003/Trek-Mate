import { Icon } from './Icon';
import { useToast } from '../context/ToastContext';
import styles from './Toast.module.css';

export function Toast() {
  const { toast } = useToast();
  if (!toast) return null;
  return (
    <div className={styles.toast} role="status" aria-live="polite">
      <div className={styles.iconWrap}>
        <Icon name="check" size={14} color="#0e1410" />
      </div>
      <div>
        <div className={styles.msg}>{toast.msg}</div>
        {toast.sub && <div className={styles.sub}>{toast.sub}</div>}
      </div>
    </div>
  );
}
