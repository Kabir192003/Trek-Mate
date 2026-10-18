import { Link, useParams } from 'react-router-dom';
import s from './OrderConfirmation.module.css';
import { Icon } from '../components/Icon';
import { EmptyState } from '../components/ui';
import { getProduct } from '../data/products';
import { img } from '../data/img';
import { useProfile } from '../context/ProfileContext';
import { usePack } from '../context/PackContext';
import { usePrefs } from '../context/PrefsContext';
import { dateShort, money, weight } from '../lib/format';

const STEPS = ['Placed', 'Weighed and packed', 'Shipped', 'Delivered'];

export function OrderConfirmation() {
  const { id } = useParams();
  const { orders, profile } = useProfile();
  const pack = usePack();
  const { units } = usePrefs();
  const order = orders.find((o) => o.id === id);

  if (!order)
    return (
      <main id="main" className="container section">
        <EmptyState icon="package" title="We couldn't find that order" body="It may belong to another browser. Your orders live in Base Camp." actions={[{ label: 'Go to your orders', to: '/account?tab=orders', primary: true }]} />
      </main>
    );

  const grams = (order.lines ?? []).reduce((n, l) => n + (getProduct(l.productId)?.measuredGrams ?? 0) * l.qty, 0);
  const owned = (order.lines ?? []).filter((l) => pack.items.some((i) => i.productId === l.productId && i.owned));

  return (
    <main id="main" className={`container ${s.page}`}>
      <section className={s.hero}>
        <span className={s.check}>
          <Icon name="check" size={28} stroke={2.4} />
        </span>
        <p className="eyebrow">Order {order.id}</p>
        <h1 className="h1">Thanks, {profile.name.split(' ')[0]}. It's on the scale.</h1>
        <p className={s.lede}>
          We weigh every order before it ships, so what arrives matches what you planned. A confirmation is on its way to {profile.email}.
        </p>
        <ol className={s.timeline} aria-label="Order progress">
          {STEPS.map((step, i) => (
            <li key={step} data-done={i === 0}>
              <span className={s.dot} />
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className={s.grid}>
        <section className={`panel ${s.panel}`} aria-labelledby="ord-items">
          <h2 id="ord-items" className="h3">
            {order.itemCount} item{order.itemCount === 1 ? '' : 's'} · <span className="num">{weight(grams, units)}</span>
          </h2>
          <ul className={s.lines}>
            {(order.lines ?? []).map((l) => {
              const p = getProduct(l.productId);
              return (
                <li key={l.productId + (l.size ?? '')}>
                  {p && <img src={img(p.img, 120, 120)} alt="" />}
                  <span className={s.lineText}>
                    <strong>{l.name}</strong>
                    <span className="muted">{[l.color, l.size, `Qty ${l.qty}`].filter(Boolean).join(' · ')}</span>
                  </span>
                  <span className="num">{money(l.price * l.qty)}</span>
                </li>
              );
            })}
          </ul>
          <dl className="kv">
            <dt>Ships to</dt>
            <dd style={{ fontFamily: 'var(--font)' }}>{order.shipTo}</dd>
            <dt>Delivery</dt>
            <dd style={{ fontFamily: 'var(--font)' }}>{order.method}</dd>
            <dt>Placed</dt>
            <dd>{dateShort(order.date)}</dd>
            <dt>Total</dt>
            <dd style={{ fontWeight: 700 }}>{money(order.total)}</dd>
          </dl>
        </section>

        <section className={`panel ${s.panel} ${s.packPanel}`} aria-labelledby="ord-pack">
          <p className="eyebrow">Your pack is up to date</p>
          <h2 id="ord-pack" className="h3">
            {owned.length ? `${owned.length} item${owned.length === 1 ? '' : 's'} now marked as owned` : 'Nothing changed in your pack'}
          </h2>
          <p className="soft">
            {owned.length
              ? 'Future swaps price against gear you own, at full replacement cost, so the planner never suggests paying twice.'
              : 'You can mark items as owned any time from the Pack Planner.'}
          </p>
          <p className={s.base}>
            Base weight now <strong className="num">{weight(pack.totals.base, units)}</strong>
          </p>
          <div className={s.actions}>
            <Link to="/pack" className="btn btn-primary">
              Open the planner
            </Link>
            <Link to="/account?tab=orders" className="btn btn-secondary">
              Track in Base Camp
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
