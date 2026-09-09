import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useCart } from '../context/CartContext';
import { productImg } from '../data/products';
import styles from './Cart.module.css';

const FREE_SHIPPING_THRESHOLD = 150;

export function Cart() {
  const { cart, subtotal, changeQty, removeItem } = useCart();
  const navigate = useNavigate();
  const shipping = subtotal > FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 12;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="tm-container" style={{ padding: '40px 40px 100px' }}>
        <div className={styles.title}>Cart</div>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <Icon name="bag" size={38} color="var(--tm-text-soft)" />
          </div>
          <div className={styles.emptyTitle}>Your pack is empty.</div>
          <p className={styles.emptyBody}>Browse the catalog to find gear for your next trip.</p>
          <Link to="/browse" className={`tm-btn tm-btn-primary ${styles.emptyCta}`}>
            Start shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="tm-container" style={{ padding: '40px 40px 100px' }}>
      <div className={styles.title}>
        Cart <span className={styles.titleCount}>· {cart.length}</span>
      </div>
      <div className="tm-cart-grid">
        <div className={styles.itemList}>
          {cart.map((it) => (
            <div key={it.id + it.size + it.color} className={styles.item}>
              <div className={styles.itemImg}>
                <img src={productImg(it.img, 220, 240)} alt={it.name} />
              </div>
              <div className={styles.itemBody}>
                <div className={styles.itemHead}>
                  <div>
                    <div className={styles.itemBrand}>{it.brand}</div>
                    <div className={styles.itemName}>{it.name}</div>
                    <div className={styles.itemVariant}>
                      <span>{it.color}</span>
                      <span>·</span>
                      <span>Size {it.size}</span>
                    </div>
                  </div>
                  <button onClick={() => removeItem(it)} className={styles.removeBtn} aria-label={`Remove ${it.name}`}>
                    <Icon name="close" size={15} color="var(--tm-text-mute)" />
                  </button>
                </div>
                <div className={styles.itemFooter}>
                  <div className={styles.stepper}>
                    <button onClick={() => changeQty(it, -1)} aria-label="Decrease quantity">
                      <Icon name="minus" size={14} color="var(--tm-text)" />
                    </button>
                    <span>{it.qty}</span>
                    <button onClick={() => changeQty(it, 1)} aria-label="Increase quantity">
                      <Icon name="plus" size={14} color="var(--tm-text)" />
                    </button>
                  </div>
                  <span className={styles.lineTotal}>${(it.price * it.qty).toFixed(0)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.summaryCol}>
          {shipping > 0 && (
            <div className={styles.shippingBar}>
              <div>
                Add <b>${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(0)}</b> more for free shipping
              </div>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }} />
              </div>
            </div>
          )}
          <div className={styles.summaryCard}>
            <div className={styles.summaryHead}>Order summary</div>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span className={styles.mono}>${subtotal.toFixed(0)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span className={styles.mono}>{shipping ? `$${shipping}` : 'Free'}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Est. tax</span>
              <span className={styles.mono}>${tax.toFixed(2)}</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.totalRow}>
              <span>Total</span>
              <span className={styles.mono}>${total.toFixed(2)}</span>
            </div>
            <button onClick={() => navigate('/checkout')} className={`tm-btn tm-btn-primary ${styles.checkoutBtn}`}>
              Checkout <Icon name="arrowR" size={15} color="var(--tm-primary-on)" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
