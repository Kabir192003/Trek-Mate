import { Link, useNavigate } from 'react-router-dom';
import s from './Cart.module.css';
import { Icon } from '../components/Icon';
import { EmptyState, Stepper } from '../components/ui';
import { img } from '../data/img';
import { systemForCategory } from '../data/systems';
import { useCart, FREE_SHIPPING_AT, SHIPPING_FLAT } from '../context/CartContext';
import { usePack } from '../context/PackContext';
import { usePrefs } from '../context/PrefsContext';
import { useWishlist } from '../context/WishlistContext';
import { incumbent } from '../lib/pack';
import { delta, money, weight } from '../lib/format';

export function Cart() {
  const cart = useCart();
  const pack = usePack();
  const wish = useWishlist();
  const { units } = usePrefs();
  const navigate = useNavigate();

  if (!cart.entries.length) {
    return (
      <main id="main" className={`container ${s.page}`}>
        <h1 className="h1">Cart</h1>
        <div style={{ marginTop: 24 }}>
          <EmptyState
            icon="pack"
            title="Your pack is empty"
            body="Plan your pack first, then buy only the pieces that move the number. Everything you add here shows what it does to your base weight."
            actions={[
              { label: 'Plan your pack', to: '/pack', primary: true },
              { label: 'Shop the gear', to: '/shop' },
            ]}
          />
        </div>
      </main>
    );
  }

  const shipping = cart.subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_FLAT;
  const toFree = Math.max(0, FREE_SHIPPING_AT - cart.subtotal);
  const total = cart.subtotal + shipping;

  // What each line does to the planned pack; `base` is the change to base weight (worn items excluded).
  const impacts = cart.entries.map((e) => {
    if (pack.inPack(e.productId)) return { key: e.key, text: 'Already in your pack plan', tone: 'in' as const, g: 0, base: 0 };
    const cur = incumbent(pack.items, systemForCategory(e.product.cat).id, e.product.kind);
    if (cur) {
      const d = (e.product.measuredGrams - cur.grams) * Math.min(e.qty, cur.qty);
      return { key: e.key, text: `${d < 0 ? 'Replaces' : 'Heavier than'} your ${cur.name}`, tone: d < 0 ? ('save' as const) : ('neutral' as const), g: d, base: cur.worn ? 0 : d };
    }
    const add = e.product.measuredGrams * e.qty;
    return { key: e.key, text: `New to your ${systemForCategory(e.product.cat).name.toLowerCase()} system`, tone: 'neutral' as const, g: add, base: e.product.wornByDefault ? 0 : add };
  });
  const packChange = impacts.reduce((n, i) => n + i.base, 0);

  return (
    <main id="main" className={`container ${s.page}`}>
      <div className={s.head}>
        <h1 className="h1">Cart</h1>
        <span className="muted">
          {cart.count} item{cart.count === 1 ? '' : 's'} · <span className="num">{weight(cart.grams, units)}</span>
        </span>
      </div>

      <div className={s.layout}>
        <section aria-label="Items">
          <ul className={s.lines}>
            {cart.entries.map((e, i) => {
              const imp = impacts[i];
              return (
                <li key={e.key} className={s.line}>
                  <Link to={`/product/${e.productId}`} className={s.thumb}>
                    <img src={img(e.product.img, 200, 240)} alt="" />
                  </Link>
                  <div className={s.lineMain}>
                    <span className="eyebrow">{e.product.brand}</span>
                    <Link to={`/product/${e.productId}`} className={s.name}>
                      {e.product.name}
                    </Link>
                    <span className={s.opts}>
                      {[e.color, e.size].filter(Boolean).join(' · ')} · <span className="num">{weight(e.product.measuredGrams, units)}</span> each
                    </span>
                    <span className={s.impact} data-tone={imp.tone}>
                      {imp.tone === 'in' ? <Icon name="check" size={14} /> : <Icon name="scale" size={14} />}
                      {imp.text}
                      {imp.tone !== 'in' && <span className="num"> {delta(imp.g, units)}</span>}
                    </span>
                    <div className={s.lineActions}>
                      <Stepper label={`quantity of ${e.product.name}`} value={e.qty} min={1} max={9} onChange={(v) => cart.setQty(e.key, v)} />
                      <button
                        type="button"
                        className="link"
                        onClick={() => {
                          if (!wish.has(e.productId)) wish.toggle(e.productId);
                          cart.remove(e.key);
                        }}
                      >
                        Save for later
                      </button>
                      <button type="button" className="link" onClick={() => cart.remove(e.key)}>
                        Remove
                      </button>
                    </div>
                  </div>
                  <span className={`num ${s.lineTotal}`}>{money(e.product.price * e.qty)}</span>
                </li>
              );
            })}
          </ul>

          <div className={`panel ${s.packPanel}`}>
            <div>
              <span className="eyebrow">Pack impact · {pack.trip.name}</span>
              {impacts.every((i) => i.tone === 'in') ? (
                <p>
                  Everything here is already in your pack plan, so the planned base weight stays at <strong className="num">{weight(pack.totals.base, units)}</strong>. Buying it just makes the plan real.
                </p>
              ) : (
                <p>
                  Swapping these in takes your base weight from <strong className="num">{weight(pack.totals.base, units)}</strong> to{' '}
                  <strong className="num">{weight(pack.totals.base + packChange, units)}</strong>.
                </p>
              )}
            </div>
            <span className={`num ${s.packDelta} ${packChange < 0 ? 'save' : ''}`}>{impacts.every((i) => i.tone === 'in') ? <Icon name="check" size={22} /> : delta(packChange, units)}</span>
          </div>
        </section>

        <aside className={`panel ${s.summary}`} aria-label="Order summary">
          <h2 className="h3">Summary</h2>
          {toFree > 0 ? (
            <div className={s.ship}>
              <p>
                <strong className="num">{money(toFree)}</strong> from free shipping
              </p>
              <div className={s.shipBar}>
                <span style={{ width: `${Math.min(100, (cart.subtotal / FREE_SHIPPING_AT) * 100)}%` }} />
              </div>
            </div>
          ) : (
            <p className={s.shipFree}>
              <Icon name="truck" size={16} /> Shipping is free on this order
            </p>
          )}
          <dl className="kv">
            <dt>Subtotal</dt>
            <dd>{money(cart.subtotal)}</dd>
            <dt>Shipping</dt>
            <dd>{shipping ? money(shipping) : 'Free'}</dd>
            <dt>Sales tax</dt>
            <dd>$0 · Oregon</dd>
          </dl>
          <div className={s.total}>
            <span>Total</span>
            <span className="num">{money(total)}</span>
          </div>
          <button type="button" className="btn btn-primary btn-block" style={{ height: 50 }} onClick={() => navigate('/checkout')}>
            <Icon name="lock" size={16} /> Check out
          </button>
          <p className={s.fine}>60-day returns, including gear that has been on a trip. Prices in USD.</p>
        </aside>
      </div>
    </main>
  );
}
