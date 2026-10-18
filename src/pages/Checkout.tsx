import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import s from './Checkout.module.css';
import { Icon } from '../components/Icon';
import { EmptyState } from '../components/ui';
import { img } from '../data/img';
import { useCart, FREE_SHIPPING_AT, SHIPPING_FLAT, EXPRESS_FEE } from '../context/CartContext';
import { useProfile } from '../context/ProfileContext';
import { usePack } from '../context/PackContext';
import { usePrefs } from '../context/PrefsContext';
import { money, weight } from '../lib/format';
import type { Order } from '../data/types';

type Method = 'standard' | 'express';

export function Checkout() {
  const cart = useCart();
  const profile = useProfile();
  const pack = usePack();
  const { units } = usePrefs();
  const navigate = useNavigate();
  const [email, setEmail] = useState(profile.profile.email);
  const [addressId, setAddressId] = useState(profile.addresses.find((a) => a.isDefault)?.id ?? profile.addresses[0]?.id ?? '');
  const [method, setMethod] = useState<Method>('standard');
  const [payId, setPayId] = useState(profile.paymentMethods[0]?.id ?? '');
  const [adding, setAdding] = useState(profile.addresses.length === 0);
  const [draft, setDraft] = useState({ label: 'Home', name: profile.profile.name, line: '', city: '' });
  const [markOwned, setMarkOwned] = useState(true);
  const [placing, setPlacing] = useState(false);

  if (!cart.entries.length) {
    return (
      <main id="main" className={`container ${s.page}`}>
        <EmptyState icon="bag" title="Nothing to check out" body="Your cart is empty. Plan your pack, then come back with only what you need." actions={[{ label: 'Plan your pack', to: '/pack', primary: true }, { label: 'Shop the gear', to: '/shop' }]} />
      </main>
    );
  }

  const standard = cart.subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_FLAT;
  const shipping = method === 'express' ? EXPRESS_FEE : standard;
  const total = cart.subtotal + shipping;
  const address = profile.addresses.find((a) => a.id === addressId);
  const pay = profile.paymentMethods.find((p) => p.id === payId);
  const ready = !!address && !!pay && email.includes('@');

  const saveAddress = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.line.trim() || !draft.city.trim()) return;
    profile.addAddress({ ...draft, isDefault: profile.addresses.length === 0 });
    setAdding(false);
  };

  const place = () => {
    if (!ready || placing) return;
    setPlacing(true);
    const id = `TM-${Math.floor(500000 + Math.random() * 400000)}`;
    const order: Order = {
      id,
      date: new Date().toISOString().slice(0, 10),
      itemCount: cart.count,
      status: 'Processing',
      total,
      lines: cart.entries.map((e) => ({ productId: e.productId, name: e.product.name, qty: e.qty, price: e.product.price, color: e.color, size: e.size })),
      shipTo: `${address!.label} · ${address!.city}`,
      method: method === 'express' ? `Express · ${money(EXPRESS_FEE)}` : `Standard · ${standard ? money(standard) : 'free'}`,
      tracking: `TM 7731 ${id.slice(3, 7)} ${id.slice(7)}0`,
    };
    profile.addOrder(order);
    if (markOwned) pack.markOwned(cart.entries.map((e) => e.productId));
    cart.clear();
    navigate(`/order/${id}`, { replace: true });
  };

  return (
    <main id="main" className={`container ${s.page}`}>
      <Link to="/cart" className={s.back}>
        <Icon name="back" size={16} /> Back to cart
      </Link>
      <h1 className="h1">Checkout</h1>

      <div className={s.layout}>
        <div className={s.steps}>
          <section className={`panel ${s.step}`} aria-labelledby="st-1">
            <h2 id="st-1" className={s.stepTitle}>
              <span>1</span> Contact
            </h2>
            <div className="field">
              <label className="label" htmlFor="co-email">
                Email for order updates
              </label>
              <input id="co-email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </section>

          <section className={`panel ${s.step}`} aria-labelledby="st-2">
            <h2 id="st-2" className={s.stepTitle}>
              <span>2</span> Delivery address
            </h2>
            <div className={s.options} role="radiogroup" aria-label="Delivery address">
              {profile.addresses.map((a) => (
                <label key={a.id} className={s.option} data-on={a.id === addressId}>
                  <input type="radio" name="address" checked={a.id === addressId} onChange={() => setAddressId(a.id)} />
                  <span className={s.optionBody}>
                    <strong>
                      {a.label}
                      {a.isDefault && <span className="chip" style={{ marginLeft: 8 }}>Default</span>}
                    </strong>
                    <span>{a.name}</span>
                    <span className="muted">
                      {a.line}, {a.city}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            {adding ? (
              <form className={s.addForm} onSubmit={saveAddress}>
                <div className="field">
                  <label className="label" htmlFor="na-label">
                    Label
                  </label>
                  <input id="na-label" className="input" value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
                </div>
                <div className="field">
                  <label className="label" htmlFor="na-name">
                    Name
                  </label>
                  <input id="na-name" className="input" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                </div>
                <div className={`field ${s.wide}`}>
                  <label className="label" htmlFor="na-line">
                    Street address
                  </label>
                  <input id="na-line" className="input" required value={draft.line} onChange={(e) => setDraft({ ...draft, line: e.target.value })} />
                </div>
                <div className={`field ${s.wide}`}>
                  <label className="label" htmlFor="na-city">
                    City, state and ZIP
                  </label>
                  <input id="na-city" className="input" required placeholder="Portland, OR 97211" value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} />
                </div>
                <div className={s.wide}>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Save address
                  </button>
                </div>
              </form>
            ) : (
              <button type="button" className={`link ${s.addLink}`} onClick={() => setAdding(true)}>
                + Add a new address
              </button>
            )}
          </section>

          <section className={`panel ${s.step}`} aria-labelledby="st-3">
            <h2 id="st-3" className={s.stepTitle}>
              <span>3</span> Delivery speed
            </h2>
            <div className={s.options} role="radiogroup" aria-label="Delivery speed">
              <label className={s.option} data-on={method === 'standard'}>
                <input type="radio" name="method" checked={method === 'standard'} onChange={() => setMethod('standard')} />
                <span className={s.optionBody}>
                  <strong>Standard · 3 to 5 business days</strong>
                  <span className="muted">Weighed and packed in Portland the day you order</span>
                </span>
                <span className="num">{standard ? money(standard) : 'Free'}</span>
              </label>
              <label className={s.option} data-on={method === 'express'}>
                <input type="radio" name="method" checked={method === 'express'} onChange={() => setMethod('express')} />
                <span className={s.optionBody}>
                  <strong>Express · 1 to 2 business days</strong>
                  <span className="muted">For trips that start this weekend</span>
                </span>
                <span className="num">{money(EXPRESS_FEE)}</span>
              </label>
            </div>
          </section>

          <section className={`panel ${s.step}`} aria-labelledby="st-4">
            <h2 id="st-4" className={s.stepTitle}>
              <span>4</span> Payment
            </h2>
            <div className={s.options} role="radiogroup" aria-label="Payment method">
              {profile.paymentMethods.map((p) => (
                <label key={p.id} className={s.option} data-on={p.id === payId}>
                  <input type="radio" name="pay" checked={p.id === payId} onChange={() => setPayId(p.id)} />
                  <Icon name={p.kind === 'card' ? 'card' : 'lock'} size={18} />
                  <span className={s.optionBody}>
                    <strong>{p.label}</strong>
                    <span className="muted">{p.sub}</span>
                  </span>
                </label>
              ))}
            </div>
            <p className={s.demo}>
              <Icon name="info" size={15} /> This is a portfolio demo store. No payment is taken and nothing ships.
            </p>
          </section>
        </div>

        <aside className={`panel ${s.summary}`} aria-label="Order summary">
          <h2 className="h3">Your order</h2>
          <ul className={s.items}>
            {cart.entries.map((e) => (
              <li key={e.key}>
                <span className={s.itemImg}>
                  <img src={img(e.product.img, 120, 120)} alt="" />
                  <span className={s.qty}>{e.qty}</span>
                </span>
                <span className={s.itemText}>
                  <strong>{e.product.name}</strong>
                  <span className="muted">{[e.color, e.size].filter(Boolean).join(' · ')}</span>
                </span>
                <span className="num">{money(e.product.price * e.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="kv">
            <dt>Subtotal</dt>
            <dd>{money(cart.subtotal)}</dd>
            <dt>Shipping</dt>
            <dd>{shipping ? money(shipping) : 'Free'}</dd>
            <dt>Sales tax</dt>
            <dd>$0 · Oregon</dd>
            <dt>Parcel weight</dt>
            <dd>{weight(cart.grams, units)}</dd>
          </dl>
          <div className={s.total}>
            <span>Total</span>
            <span className="num">{money(total)}</span>
          </div>
          <label className={s.ownRow}>
            <input type="checkbox" className="checkbox" checked={markOwned} onChange={(e) => setMarkOwned(e.target.checked)} />
            <span>Mark these as owned in my pack, so swaps price against them</span>
          </label>
          <button type="button" className="btn btn-primary btn-block" style={{ height: 52 }} disabled={!ready || placing} onClick={place}>
            <Icon name="lock" size={16} /> Place order · {money(total)}
          </button>
          {!ready && <p className={s.fine}>Add a delivery address and payment method to continue.</p>}
        </aside>
      </div>
    </main>
  );
}
