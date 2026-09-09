import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { useCart } from '../context/CartContext';
import { useProfile } from '../context/ProfileContext';
import { productImg } from '../data/products';
import styles from './Checkout.module.css';

const SHIP_METHODS = [
  { id: 'standard', name: 'Standard', sub: '5–8 business days', price: 0 },
  { id: 'express', name: 'Express', sub: '2–3 business days', price: 18 },
];

export function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const { addresses, paymentMethods, profile } = useProfile();
  const navigate = useNavigate();

  const [placed, setPlaced] = useState(false);
  const [addrId, setAddrId] = useState(addresses[0]?.id ?? '');
  const [shipMethod, setShipMethod] = useState<'standard' | 'express'>('standard');
  const [payId, setPayId] = useState(paymentMethods[0]?.id ?? '');
  const [orderNo] = useState(() => `TM-${Math.floor(Math.random() * 900000 + 100000)}`);

  const shipCost = shipMethod === 'express' ? 18 : 0;
  const tax = (subtotal + shipCost) * 0.08;
  const total = subtotal + shipCost + tax;

  const deliveryEstimate = useMemo(() => {
    const start = new Date();
    const days = shipMethod === 'express' ? 3 : 6;
    const end = new Date();
    end.setDate(start.getDate() + days + 2);
    start.setDate(start.getDate() + days);
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    return `${fmt(start)} – ${fmt(end)}`;
  }, [shipMethod]);

  if (cart.length === 0 && !placed) {
    return (
      <div className="tm-container" style={{ padding: '80px 40px', textAlign: 'center' }}>
        <div className={styles.confirmTitle}>Your cart is empty</div>
        <p className={styles.confirmBody}>Add some gear before checking out.</p>
        <button onClick={() => navigate('/browse')} className={`tm-btn tm-btn-primary ${styles.backHomeBtn}`}>
          Browse gear
        </button>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="tm-container" style={{ padding: '80px 40px 100px' }}>
        <div className={styles.confirmWrap}>
          <div className={styles.confirmIcon}>
            <Icon name="check" size={38} color="var(--tm-primary-on)" />
          </div>
          <h1 className={styles.confirmTitle}>Order placed.</h1>
          <p className={styles.confirmBody}>
            We'll send a tracking link to <b style={{ color: 'var(--tm-text)' }}>{profile.email}</b>. Most orders ship within 24h.
          </p>
          <div className={styles.confirmCard}>
            <div className={styles.confirmLabel}>Order</div>
            <div className={styles.confirmOrderRow}>
              <span className={styles.mono}>#{orderNo}</span>
              <span className={`${styles.mono} ${styles.confirmTotal}`}>${total.toFixed(2)}</span>
            </div>
            <div className={styles.confirmDivider} />
            <div className={styles.confirmDelivery}>
              <Icon name="truck" size={16} color="var(--tm-text-soft)" /> Est. delivery · {deliveryEstimate}
            </div>
          </div>
          <button
            onClick={() => {
              clearCart();
              navigate('/');
            }}
            className={`tm-btn ${styles.backHomeBtn}`}
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tm-container" style={{ padding: '40px 40px 100px' }}>
      <div className={styles.title}>Checkout</div>
      <div className="tm-checkout-grid">
        <div className={styles.left}>
          <div>
            <div className={styles.sectionHead}>Deliver to</div>
            <div className={styles.optionList}>
              {addresses.map((a) => (
                <button key={a.id} onClick={() => setAddrId(a.id)} className={styles.optionCard} data-active={addrId === a.id}>
                  <Icon name="pin" size={18} color={addrId === a.id ? 'var(--tm-primary)' : 'var(--tm-text-mute)'} />
                  <div>
                    <div className={styles.optionName}>
                      {a.name} · {a.label}
                    </div>
                    <div className={styles.optionSub}>
                      {a.line}, {a.city}
                    </div>
                  </div>
                </button>
              ))}
              {addresses.length === 0 && <div className={styles.optionSub}>No saved addresses — add one from your profile.</div>}
            </div>
          </div>

          <div>
            <div className={styles.sectionHead}>Shipping method</div>
            <div className={styles.optionList}>
              {SHIP_METHODS.map((m) => (
                <button key={m.id} onClick={() => setShipMethod(m.id as 'standard' | 'express')} className={styles.optionCardRadio} data-active={shipMethod === m.id}>
                  <div className={styles.radioDot} data-active={shipMethod === m.id} />
                  <div className={styles.optionFlex}>
                    <div className={styles.optionName}>{m.name}</div>
                    <div className={styles.optionSubSmall}>{m.sub}</div>
                  </div>
                  <div className={styles.mono}>{m.price ? `$${m.price}` : 'Free'}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className={styles.sectionHead}>Payment</div>
            <div className={styles.optionList}>
              {paymentMethods.map((m) => (
                <button key={m.id} onClick={() => setPayId(m.id)} className={styles.optionCardRadio} data-active={payId === m.id}>
                  <div className={styles.radioDot} data-active={payId === m.id} />
                  <div className={styles.optionFlex}>
                    <div className={styles.optionName}>{m.label}</div>
                    <div className={styles.optionSubSmall}>{m.sub}</div>
                  </div>
                  <Icon name="card" size={20} color="var(--tm-text-soft)" />
                </button>
              ))}
              {paymentMethods.length === 0 && <div className={styles.optionSub}>No saved payment methods — add one from your profile.</div>}
            </div>
          </div>
        </div>

        <div className={styles.summaryCol}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryHead}>Order · {cart.length} items</div>
            <div className={styles.orderItems}>
              {cart.map((it) => (
                <div key={it.id + it.size + it.color} className={styles.orderItem}>
                  <div className={styles.orderItemImg}>
                    <img src={productImg(it.img, 120, 140)} alt={it.name} />
                  </div>
                  <div className={styles.orderItemBody}>
                    <div className={styles.orderItemName}>{it.name}</div>
                    <div className={styles.orderItemQty}>Qty {it.qty}</div>
                  </div>
                  <div className={styles.mono}>${(it.price * it.qty).toFixed(0)}</div>
                </div>
              ))}
            </div>
            <div className={styles.confirmDivider} style={{ margin: '0 0 14px' }} />
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span className={styles.mono}>${subtotal.toFixed(0)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span className={styles.mono}>{shipCost ? `$${shipCost}` : 'Free'}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Tax</span>
              <span className={styles.mono}>${tax.toFixed(2)}</span>
            </div>
            <div className={styles.confirmDivider} style={{ margin: '4px 0 14px' }} />
            <div className={styles.totalRow}>
              <span>Total</span>
              <span className={styles.mono}>${total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => setPlaced(true)}
              disabled={!addrId || !payId}
              className={`tm-btn tm-btn-primary ${styles.placeBtn}`}
            >
              Place order · ${total.toFixed(2)}
            </button>
            <div className={styles.terms}>By placing this order you agree to Trek Mate's terms and 30-day return policy.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
