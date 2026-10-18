import { useMemo, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import s from './Account.module.css';
import { Icon, SYSTEM_ICON, type IconName } from '../components/Icon';
import { Switch } from '../components/ui';
import { getProduct } from '../data/products';
import { img } from '../data/img';
import { KIND_LABEL, systemMeta } from '../data/systems';
import { useProfile, type NotificationSettings } from '../context/ProfileContext';
import { usePack } from '../context/PackContext';
import { usePrefs } from '../context/PrefsContext';
import { useWishlist } from '../context/WishlistContext';
import { CLASSES, toBuy, weightClass } from '../lib/pack';
import { dateDay, dateShort, delta, money, perWeight, weight, type Units } from '../lib/format';
import type { Order, OrderStatus, WeightPoint } from '../data/types';

type Tab = 'overview' | 'orders' | 'closet' | 'details' | 'addresses' | 'payment' | 'notifications';

const TABS: { id: Tab; label: string; icon: IconName }[] = [
  { id: 'overview', label: 'Overview', icon: 'home' },
  { id: 'orders', label: 'Orders', icon: 'package' },
  { id: 'closet', label: 'Gear closet', icon: 'hanger' },
  { id: 'details', label: 'Account details', icon: 'user' },
  { id: 'addresses', label: 'Addresses', icon: 'pin' },
  { id: 'payment', label: 'Payment', icon: 'card' },
  { id: 'notifications', label: 'Notifications', icon: 'bell' },
];

export function Account() {
  const [params, setParams] = useSearchParams();
  const tab = (TABS.find((t) => t.id === params.get('tab'))?.id ?? 'overview') as Tab;
  const { profile } = useProfile();
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <main id="main" className={`container ${s.page}`}>
      <header className={s.head}>
        <div>
          <p className="eyebrow">Base Camp</p>
          <h1 className="h1">
            {greet}, {profile.name.split(' ')[0]}
          </h1>
          <p className={s.sub}>
            Member since {profile.memberSince} · {profile.location}
          </p>
        </div>
      </header>

      <div className={s.layout}>
        <nav className={s.nav} aria-label="Base Camp sections">
          {TABS.map((t) => (
            <button key={t.id} type="button" aria-current={t.id === tab ? 'page' : undefined} onClick={() => setParams(t.id === 'overview' ? {} : { tab: t.id }, { replace: true })}>
              <Icon name={t.icon} size={17} />
              {t.label}
            </button>
          ))}
        </nav>
        <div className={s.content}>
          {tab === 'overview' && <Overview />}
          {tab === 'orders' && <Orders />}
          {tab === 'closet' && <Closet />}
          {tab === 'details' && <Details />}
          {tab === 'addresses' && <Addresses />}
          {tab === 'payment' && <Payment />}
          {tab === 'notifications' && <Notifications />}
        </div>
      </div>
    </main>
  );
}

/* ── Overview ─────────────────────────────────────────────── */

function Overview() {
  const pack = usePack();
  const { orders } = useProfile();
  const { ids } = useWishlist();
  const { units } = usePrefs();
  const first = pack.history[0]?.base ?? pack.totals.base;
  const change = pack.totals.base - first;
  const { cls, next } = weightClass(pack.totals.base);
  const transit = orders.filter((o) => o.status !== 'Delivered');
  const drops = ids.map((id) => getProduct(id)).filter((p) => p?.old).length;
  const gaps = pack.checks.filter((c) => c.status === 'missing' || c.status === 'warn');
  const buy = toBuy(pack.items);
  const top = pack.swaps[0];

  const todo: { icon: IconName; text: string; to: string; cta: string }[] = [
    ...gaps.slice(0, 3).map((g) => ({ icon: 'alert' as IconName, text: `${g.label}: ${g.detail}`, to: g.shop ? `/shop?sys=${g.shop}&fit=1` : g.productId ? `/product/${g.productId}` : '/pack', cta: 'Fix' })),
    ...(top ? [{ icon: 'swap' as IconName, text: `Swap ${top.item.name} for ${top.product.name}: ${delta(-top.saves, units)} at ${perWeight(top.cost, top.saves, units)}`, to: '/pack#swaps', cta: 'Review' }] : []),
    ...(buy.length ? [{ icon: 'bag' as IconName, text: `${buy.length} planned item${buy.length === 1 ? '' : 's'} not bought yet`, to: '/pack', cta: 'Buy' }] : []),
  ];

  return (
    <div className={s.stack}>
      <div className={s.tiles}>
        <Link to="/pack" className={s.tile}>
          <span className={s.tileLabel}>Base weight</span>
          <span className={`num ${s.tileValue}`}>{weight(pack.totals.base, units)}</span>
          <span className={`${s.tileMeta} ${change < 0 ? 'save' : ''}`}>
            {change < 0 ? `${delta(change, units)} since ${dateShort(pack.history[0].t)}` : cls.name}
          </span>
        </Link>
        <Link to="/pack" className={s.tile}>
          <span className={s.tileLabel}>Next trip</span>
          <span className={s.tileValueText}>{pack.trip.name}</span>
          <span className={s.tileMeta}>
            {pack.trip.nights} nights · low {pack.trip.lowF}°F
          </span>
        </Link>
        <Link to="/account?tab=orders" className={s.tile}>
          <span className={s.tileLabel}>Orders</span>
          <span className={`num ${s.tileValue}`}>{orders.length}</span>
          <span className={s.tileMeta}>{transit.length ? `${transit.length} on the way` : 'All delivered'}</span>
        </Link>
        <Link to="/saved" className={s.tile}>
          <span className={s.tileLabel}>Saved gear</span>
          <span className={`num ${s.tileValue}`}>{ids.length}</span>
          <span className={`${s.tileMeta} ${drops ? 'gain' : ''}`}>{drops ? `${drops} price drop${drops === 1 ? '' : 's'}` : 'No price changes'}</span>
        </Link>
      </div>

      <section className={`panel ${s.panel}`} aria-labelledby="chart">
        <div className="between">
          <div>
            <h2 id="chart" className="h3">
              Base weight over time
            </h2>
            <p className="muted" style={{ fontSize: 13.5 }}>
              {next ? `${weight(next.toGo, units)} to ${next.name}.` : 'Super ultralight. Nothing left to cut.'} Every change you make in the planner is recorded here.
            </p>
          </div>
          <span className="chip chip-solid">{cls.name}</span>
        </div>
        <WeightChart points={[...pack.history]} units={units} />
      </section>

      <div className={s.two}>
        <section className={`panel ${s.panel}`} aria-labelledby="todo">
          <h2 id="todo" className="h3">
            Before {pack.trip.name}
          </h2>
          {todo.length === 0 ? (
            <p className="soft" style={{ marginTop: 10 }}>
              You're packed and covered for this trip. Nothing to do.
            </p>
          ) : (
            <ul className={s.todo}>
              {todo.map((t) => (
                <li key={t.text}>
                  <Icon name={t.icon} size={16} />
                  <span>{t.text}</span>
                  <Link to={t.to} className="btn btn-xs btn-secondary">
                    {t.cta}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={`panel ${s.panel}`} aria-labelledby="recent">
          <div className="between">
            <h2 id="recent" className="h3">
              Recent orders
            </h2>
            <Link to="/account?tab=orders" className="link" style={{ fontSize: 13.5 }}>
              All orders
            </Link>
          </div>
          <ul className={s.recent}>
            {orders.slice(0, 3).map((o) => (
              <li key={o.id}>
                <span className={s.recentId}>
                  <strong className="num">{o.id}</strong>
                  <span className="muted">
                    {dateShort(o.date)} · {o.itemCount} item{o.itemCount === 1 ? '' : 's'}
                  </span>
                </span>
                <StatusChip status={o.status} />
                <span className="num">{money(o.total)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function WeightChart({ points, units }: { points: WeightPoint[]; units: Units }) {
  const W = 760;
  const H = 220;
  const pad = { l: 64, r: 16, t: 14, b: 28 };
  const data = points.length > 1 ? points : [...points, ...points];
  const vals = data.map((p) => p.base);
  // Round, readable ticks: every 2 kg, or every 4 lb.
  const step = units === 'imperial' ? 4 * 453.592 : 2000;
  const bottom = Math.max(0, Math.floor((Math.min(4536, ...vals) - step / 2) / step) * step);
  const top = Math.ceil((Math.max(9072, ...vals) + step / 2) / step) * step;
  const ticks: number[] = [];
  for (let g = bottom; g <= top + 1; g += step) ticks.push(g);
  const tick = (g: number) => (units === 'imperial' ? `${Math.round(g / 453.592)} lb` : `${Math.round(g / 1000)} kg`);
  const x = (i: number) => pad.l + (i / (data.length - 1)) * (W - pad.l - pad.r);
  const y = (g: number) => pad.t + (1 - (g - bottom) / (top - bottom)) * (H - pad.t - pad.b);
  const line = data.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.base).toFixed(1)}`).join(' ');
  const area = `${line} L${x(data.length - 1).toFixed(1)},${H - pad.b} L${x(0).toFixed(1)},${H - pad.b} Z`;
  const thresholds = CLASSES.filter((c) => Number.isFinite(c.max) && c.max > bottom && c.max < top);

  return (
    <div className={s.chart}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Base weight went from ${weight(vals[0], units)} to ${weight(vals[vals.length - 1], units)}`}>
        <defs>
          <linearGradient id="wfill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#1b3a2a" stopOpacity="0.18" />
            <stop offset="1" stopColor="#1b3a2a" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((g) => (
          <g key={g}>
            <line x1={pad.l} x2={W - pad.r} y1={y(g)} y2={y(g)} stroke="#ddd8cc" strokeWidth="1" />
            <text x={pad.l - 10} y={y(g) + 4} textAnchor="end" fontSize="11" fill="#5f665f" fontFamily="IBM Plex Mono, monospace">
              {tick(g)}
            </text>
          </g>
        ))}
        {thresholds.map((c) => (
          <g key={c.id}>
            <line x1={pad.l} x2={W - pad.r} y1={y(c.max)} y2={y(c.max)} stroke="#d9541e" strokeDasharray="4 4" strokeWidth="1" opacity="0.7" />
            <text x={W - pad.r} y={y(c.max) - 6} textAnchor="end" fontSize="11" fill="#a9410f" fontFamily="IBM Plex Mono, monospace">
              {c.name} under {weight(c.max, units)}
            </text>
          </g>
        ))}
        <path d={area} fill="url(#wfill)" />
        <path d={line} fill="none" stroke="#1b3a2a" strokeWidth="2.2" strokeLinejoin="round" />
        {data.map((p, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(p.base)} r={i === data.length - 1 ? 5 : 3.5} fill={i === data.length - 1 ? '#d9541e' : '#1b3a2a'} stroke="#fff" strokeWidth="2" />
            {(i === 0 || i === data.length - 1 || data.length <= 7) && (
              <text x={x(i)} y={H - 8} textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'} fontSize="11" fill="#5f665f" fontFamily="IBM Plex Mono, monospace">
                {dateDay(p.t)}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

const STATUS_STEPS: OrderStatus[] = ['Processing', 'Shipped', 'In transit', 'Delivered'];

function StatusChip({ status }: { status: OrderStatus }) {
  const cls = status === 'Delivered' ? 'chip-save' : status === 'Processing' ? 'chip-amber' : 'chip-ember';
  return <span className={`chip ${cls}`}>{status}</span>;
}

/* ── Orders ───────────────────────────────────────────────── */

function Orders() {
  const { orders } = useProfile();
  const [open, setOpen] = useState<string | null>(orders[0]?.id ?? null);
  return (
    <div className={s.stack}>
      <h2 className="h2">Orders</h2>
      {orders.map((o) => (
        <OrderRow key={o.id} o={o} open={open === o.id} toggle={() => setOpen(open === o.id ? null : o.id)} />
      ))}
    </div>
  );
}

function OrderRow({ o, open, toggle }: { o: Order; open: boolean; toggle: () => void }) {
  const step = STATUS_STEPS.indexOf(o.status);
  return (
    <section className={`panel ${s.order}`}>
      <button type="button" className={s.orderHead} onClick={toggle} aria-expanded={open}>
        <span className={s.recentId}>
          <strong className="num">{o.id}</strong>
          <span className="muted">
            {dateShort(o.date)} · {o.itemCount} item{o.itemCount === 1 ? '' : 's'}
          </span>
        </span>
        <StatusChip status={o.status} />
        <span className="num">{money(o.total)}</span>
        <Icon name={open ? 'chevU' : 'chevD'} size={18} />
      </button>
      {open && (
        <div className={s.orderBody}>
          <ol className={s.steps}>
            {STATUS_STEPS.map((st, i) => (
              <li key={st} data-done={i <= step}>
                <span />
                {st}
              </li>
            ))}
          </ol>
          <ul className={s.orderLines}>
            {(o.lines ?? []).map((l) => {
              const p = getProduct(l.productId);
              return (
                <li key={l.productId + (l.size ?? '')}>
                  {p && <img src={img(p.img, 96, 96)} alt="" />}
                  <span>
                    {p ? (
                      <Link to={`/product/${p.id}`} className="link">
                        {l.name}
                      </Link>
                    ) : (
                      l.name
                    )}
                    <span className="muted"> · {[l.color, l.size, `Qty ${l.qty}`].filter(Boolean).join(' · ')}</span>
                  </span>
                  <span className="num">{money(l.price * l.qty)}</span>
                </li>
              );
            })}
          </ul>
          <dl className={`kv ${s.orderKv}`}>
            <dt>Ships to</dt>
            <dd style={{ fontFamily: 'var(--font)' }}>{o.shipTo ?? '–'}</dd>
            <dt>Delivery</dt>
            <dd style={{ fontFamily: 'var(--font)' }}>{o.method ?? '–'}</dd>
            <dt>Tracking</dt>
            <dd>{o.tracking ?? '–'}</dd>
          </dl>
        </div>
      )}
    </section>
  );
}

/* ── Gear closet ──────────────────────────────────────────── */

function Closet() {
  const pack = usePack();
  const { units } = usePrefs();
  const owned = useMemo(() => [...pack.closet].sort((a, b) => a.system.localeCompare(b.system) || b.grams - a.grams), [pack.closet]);
  const total = owned.reduce((n, i) => n + i.grams * i.qty, 0);
  const inPack = owned.filter((i) => i.inPack).length;
  return (
    <div className={s.stack}>
      <div className="between" style={{ flexWrap: 'wrap' }}>
        <div>
          <h2 className="h2">Gear closet</h2>
          <p className="muted" style={{ fontSize: 14 }}>
            {owned.length} things you own · <span className="num">{weight(total, units)}</span> in total · {inPack} in the current pack
          </p>
        </div>
        <Link to="/pack" className="btn btn-secondary btn-sm">
          <Icon name="plus" size={15} /> Add gear in the planner
        </Link>
      </div>
      <div className={s.tableWrap}>
        <table className="table">
          <thead>
            <tr>
              <th>Item</th>
              <th>System</th>
              <th className="r">Weight</th>
              <th>In pack</th>
              <th>
                <span className="sr-only">Delete</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {owned.map((i) => {
              const p = i.productId ? getProduct(i.productId) : undefined;
              return (
                <tr key={i.uid}>
                  <td>
                    <span className={s.closetItem}>
                      {p ? <img src={img(p.img, 80, 80)} alt="" /> : <span className={s.ownBadge}>{i.name.slice(0, 1)}</span>}
                      <span>
                        <strong>{i.name}</strong>
                        <span className="muted">{p ? p.brand : 'Your gear'} · {KIND_LABEL[i.kind]}</span>
                      </span>
                    </span>
                  </td>
                  <td>
                    <span className={s.sys}>
                      <Icon name={SYSTEM_ICON[i.system]} size={15} /> {systemMeta(i.system).name}
                    </span>
                  </td>
                  <td className="r num">{weight(i.grams * i.qty, units)}</td>
                  <td>
                    <Switch checked={i.inPack} onChange={(v) => pack.update(i.uid, { inPack: v })} label={`${i.name} in pack`} />
                  </td>
                  <td className="r">
                    <button type="button" className="icon-btn" aria-label={`Delete ${i.name}`} onClick={() => pack.deleteForever(i.uid)}>
                      <Icon name="trash" size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Details ──────────────────────────────────────────────── */

function Details() {
  const { profile, updateProfile } = useProfile();
  const [form, setForm] = useState(profile);
  const dirty = JSON.stringify(form) !== JSON.stringify(profile);
  const save = (e: FormEvent) => {
    e.preventDefault();
    updateProfile(form);
  };
  const field = (key: keyof typeof form, label: string, type = 'text') => (
    <div className="field">
      <label className="label" htmlFor={`d-${key}`}>
        {label}
      </label>
      <input id={`d-${key}`} className="input" type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
    </div>
  );
  return (
    <form className={`panel ${s.panel} ${s.form}`} onSubmit={save}>
      <h2 className="h2">Account details</h2>
      <div className={s.formGrid}>
        {field('name', 'Full name')}
        {field('email', 'Email', 'email')}
        {field('phone', 'Phone', 'tel')}
        {field('location', 'Home base')}
      </div>
      <div className="row">
        <button type="submit" className="btn btn-primary" disabled={!dirty}>
          Save changes
        </button>
        {dirty && (
          <button type="button" className="btn btn-ghost" onClick={() => setForm(profile)}>
            Discard
          </button>
        )}
      </div>
    </form>
  );
}

/* ── Addresses ────────────────────────────────────────────── */

function Addresses() {
  const { addresses, addAddress, removeAddress, setDefaultAddress, profile } = useProfile();
  const [draft, setDraft] = useState({ label: '', name: profile.name, line: '', city: '' });
  const add = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.label || !draft.line || !draft.city) return;
    addAddress(draft);
    setDraft({ label: '', name: profile.name, line: '', city: '' });
  };
  return (
    <div className={s.stack}>
      <h2 className="h2">Addresses</h2>
      <div className={s.cards}>
        {addresses.map((a) => (
          <div key={a.id} className={`panel ${s.card}`}>
            <div className="between">
              <strong>{a.label}</strong>
              {a.isDefault ? <span className="chip chip-save">Default</span> : null}
            </div>
            <p>{a.name}</p>
            <p className="muted">
              {a.line}
              <br />
              {a.city}
            </p>
            <div className="row" style={{ marginTop: 6 }}>
              {!a.isDefault && (
                <button type="button" className="btn btn-xs btn-secondary" onClick={() => setDefaultAddress(a.id)}>
                  Make default
                </button>
              )}
              <button type="button" className="btn btn-xs btn-ghost" onClick={() => removeAddress(a.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <form className={`panel ${s.panel} ${s.form}`} onSubmit={add}>
        <h3 className="h3">Add an address</h3>
        <div className={s.formGrid}>
          {(['label', 'name', 'line', 'city'] as const).map((k) => (
            <div key={k} className="field">
              <label className="label" htmlFor={`a-${k}`}>
                {{ label: 'Label (e.g. Work)', name: 'Name', line: 'Street address', city: 'City, state and ZIP' }[k]}
              </label>
              <input id={`a-${k}`} className="input" value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} />
            </div>
          ))}
        </div>
        <div>
          <button type="submit" className="btn btn-primary">
            Add address
          </button>
        </div>
      </form>
    </div>
  );
}

/* ── Payment ──────────────────────────────────────────────── */

function Payment() {
  const { paymentMethods, removePaymentMethod, addPaymentMethod } = useProfile();
  return (
    <div className={s.stack}>
      <h2 className="h2">Payment</h2>
      <div className={s.cards}>
        {paymentMethods.map((p) => (
          <div key={p.id} className={`panel ${s.card}`}>
            <div className="row">
              <Icon name={p.kind === 'card' ? 'card' : 'lock'} size={20} />
              <strong>{p.label}</strong>
            </div>
            <p className="muted">{p.sub}</p>
            <div style={{ marginTop: 6 }}>
              <button type="button" className="btn btn-xs btn-ghost" onClick={() => removePaymentMethod(p.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="panel" style={{ padding: 18 }}>
        <p className="soft" style={{ fontSize: 14 }}>
          This is a portfolio demo store. It never asks for real card numbers.{' '}
          <button type="button" className="link" onClick={() => addPaymentMethod({ kind: 'card', label: 'Demo card ending in 0005', sub: 'Expires 12/29' })}>
            Add a demo card
          </button>
        </p>
      </div>
    </div>
  );
}

/* ── Notifications ────────────────────────────────────────── */

const NOTIFS: { key: keyof NotificationSettings; title: string; body: string }[] = [
  { key: 'orderUpdates', title: 'Order updates', body: 'Weighed, shipped and delivered, nothing else.' },
  { key: 'priceDrops', title: 'Price drops on saved gear', body: 'Only for items you saved, at most once a week.' },
  { key: 'restockAlerts', title: 'Back in stock', body: 'When a sold-out size or colour returns.' },
  { key: 'fieldNotes', title: 'Field notes', body: 'A monthly email with new gear off the scale and route reports.' },
];

function Notifications() {
  const { notifications, toggleNotification } = useProfile();
  return (
    <div className={s.stack}>
      <h2 className="h2">Notifications</h2>
      <div className={`panel ${s.notifs}`}>
        {NOTIFS.map((n) => (
          <label key={n.key} className={s.notif}>
            <span>
              <strong>{n.title}</strong>
              <span className="muted">{n.body}</span>
            </span>
            <Switch checked={notifications[n.key]} onChange={() => toggleNotification(n.key)} label={n.title} />
          </label>
        ))}
      </div>
    </div>
  );
}
