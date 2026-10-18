import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import s from './Pack.module.css';
import { Icon, SYSTEM_ICON } from '../components/Icon';
import { ClassScale, Segmented, StackedBar, Stepper } from '../components/ui';
import { usePack } from '../context/PackContext';
import { usePrefs } from '../context/PrefsContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useTween } from '../hooks/useTween';
import { getProduct, PRODUCTS } from '../data/products';
import { img } from '../data/img';
import { KIND_LABEL, SYSTEMS, type SystemMeta } from '../data/systems';
import { SEASON_DEFAULT_LOW, SEASON_LABEL, lineGrams, swapsFor, toBuy, weightClass, readiness, type Check } from '../lib/pack';
import { delta, money, perWeight, perWeightLabel, pct, readout, tempC, weight } from '../lib/format';
import type { Kind, PackItem, Season, SystemId } from '../data/types';

export function Pack() {
  const pack = usePack();
  const { units, setUnits } = usePrefs();
  const { trip, setTrip, totals } = pack;

  return (
    <main id="main" className={s.page}>
      <section className={`${s.hero} topo-bg`}>
        <div className="container">
          <div className={s.heroTop}>
            <span className={s.heroEyebrow}>
              <Icon name="scale" size={15} /> Pack Planner
            </span>
            <HeroActions />
          </div>
          <label className="sr-only" htmlFor="trip-name">
            Trip name
          </label>
          <input id="trip-name" className={s.tripName} value={trip.name} onChange={(e) => setTrip({ name: e.target.value })} maxLength={40} />
          <p className={s.heroSub}>
            Everything you plan to carry, weighed. Add gear from the store or anything you already own, and Trek Mate shows what to change and what it costs.
          </p>
          <div className={s.controls}>
            <Control label="Nights">
              <Stepper dark label="nights" value={trip.nights} min={1} max={14} onChange={(v) => setTrip({ nights: v })} />
            </Control>
            <Control label="People">
              <Stepper dark label="people" value={trip.people} min={1} max={4} onChange={(v) => setTrip({ people: v })} />
            </Control>
            <Control label="Season">
              <Segmented
                dark
                label="Season"
                value={trip.season}
                onChange={(v: Season) => setTrip({ season: v, lowF: SEASON_DEFAULT_LOW[v] })}
                options={(['summer', 'three-season', 'winter'] as Season[]).map((v) => ({ value: v, label: SEASON_LABEL[v] }))}
              />
            </Control>
            <Control label="Overnight low">
              <div className={s.lowCtl}>
                <Stepper dark step={5} label="overnight low in Fahrenheit" value={trip.lowF} min={-30} max={60} onChange={(v) => setTrip({ lowF: v })} />
                <span className={s.lowC}>{trip.lowF}°F · {tempC(trip.lowF)}</span>
              </div>
            </Control>
            <Control label="Units">
              <Segmented
                dark
                label="Weight units"
                value={units}
                onChange={setUnits}
                options={[
                  { value: 'metric', label: 'g / kg' },
                  { value: 'imperial', label: 'oz / lb' },
                ]}
              />
            </Control>
          </div>
        </div>
      </section>

      <div className={`container ${s.layout}`}>
        <div className={s.main}>
          {SYSTEMS.map((sys) => (
            <SystemGroup key={sys.id} sys={sys} />
          ))}
          <p className={s.footnote}>
            <Icon name="info" size={15} /> Base weight is everything you carry except what you wear, food, water and fuel. Weights come from our scale for store items, and from you for your own gear.
          </p>
        </div>

        <aside className={s.aside} aria-label="Pack summary">
          <Readout />
          <Checks />
          <Swaps />
          <ToBuy />
        </aside>
      </div>

      <MobileBar base={totals.base} />
    </main>
  );
}

function Control({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={s.control}>
      <span className={s.controlLabel}>{label}</span>
      {children}
    </div>
  );
}

function HeroActions() {
  const pack = usePack();
  const { units } = usePrefs();
  const { showToast } = useToast();
  const copy = async () => {
    const lines = [`${pack.trip.name} · ${pack.trip.nights} nights · ${SEASON_LABEL[pack.trip.season]}`, ''];
    for (const sys of SYSTEMS) {
      const its = pack.packed.filter((i) => i.system === sys.id);
      if (!its.length) continue;
      lines.push(sys.name.toUpperCase());
      its.forEach((i) => lines.push(`  ${i.name}${i.qty > 1 ? ` ×${i.qty}` : ''}  ${weight(lineGrams(i), units)}${i.worn ? ' (worn)' : ''}`));
    }
    lines.push('', `Base weight: ${weight(pack.totals.base, units)}  ·  Worn: ${weight(pack.totals.worn, units)}`, 'Planned on Trek Mate');
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      showToast('Pack list copied', { sub: 'Paste it into a note, a message or a forum shakedown' });
    } catch {
      showToast('Couldn\'t copy', { sub: 'Your browser blocked clipboard access' });
    }
  };
  return (
    <div className={s.heroActions}>
      <button type="button" className="btn btn-sm btn-outline-dark" onClick={copy}>
        <Icon name="copy" size={15} /> Copy list
      </button>
      <button type="button" className="btn btn-sm btn-outline-dark" onClick={pack.loadSample}>
        <Icon name="undo" size={15} /> Sample pack
      </button>
      <button type="button" className="btn btn-sm btn-outline-dark" onClick={pack.clearPack}>
        <Icon name="trash" size={15} /> Clear
      </button>
    </div>
  );
}

/* ── One system group: header, rows, inline add ───────────── */

function SystemGroup({ sys }: { sys: SystemMeta }) {
  const pack = usePack();
  const { units } = usePrefs();
  const [adding, setAdding] = useState(false);
  const items = pack.packed.filter((i) => i.system === sys.id);
  const grams = items.reduce((n, i) => n + lineGrams(i), 0);
  const share = sys.worn ? 0 : pct(grams, pack.totals.base);

  return (
    <section className={s.group} aria-labelledby={`g-${sys.id}`}>
      <header className={s.groupHead}>
        <span className={s.groupIcon} style={{ background: sys.color }}>
          <Icon name={SYSTEM_ICON[sys.id]} size={17} />
        </span>
        <div className={s.groupTitle}>
          <h2 id={`g-${sys.id}`}>{sys.name}</h2>
          <span>{sys.blurb}</span>
        </div>
        <div className={s.groupWeight}>
          <span className="num">{weight(grams, units)}</span>
          <span className="muted">{sys.worn ? 'worn' : `${share}% of base`}</span>
        </div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAdding((a) => !a)} aria-expanded={adding}>
          <Icon name={adding ? 'close' : 'plus'} size={15} /> {adding ? 'Close' : 'Add'}
        </button>
      </header>

      {items.length === 0 && !adding && (
        <div className={s.groupEmpty}>
          <span>No {sys.name.toLowerCase()} gear yet.</span>
          <button type="button" className="link" onClick={() => setAdding(true)}>
            Add from the store or your own kit
          </button>
        </div>
      )}

      {items.map((i) => (
        <ItemRow key={i.uid} item={i} />
      ))}

      {adding && <AddPanel sys={sys} onDone={() => setAdding(false)} />}
    </section>
  );
}

function ItemRow({ item }: { item: PackItem }) {
  const pack = usePack();
  const { units } = usePrefs();
  const [reveal, setReveal] = useState(false);
  const product = item.productId ? getProduct(item.productId) : undefined;
  const best = item.worn ? undefined : swapsFor(item, pack.trip)[0];
  // Only the three best-value swaps are shown inline; the rest are one tap away.
  const featured = !!best && pack.swaps.slice(0, 3).some((x) => x.item.uid === item.uid);
  const showSwap = !!best && (featured || reveal);

  return (
    <div className={s.row}>
      <div className={s.rowMain}>
        {product ? (
          <img className={s.thumb} src={img(product.img, 112, 112)} alt="" loading="lazy" />
        ) : (
          <span className={s.thumbOwn} aria-hidden>
            <Icon name={SYSTEM_ICON[item.system]} size={18} />
          </span>
        )}
        <div className={s.rowText}>
          {product ? (
            <Link to={`/product/${product.id}`} className={s.rowName}>
              {item.name}
            </Link>
          ) : (
            <span className={s.rowName}>{item.name}</span>
          )}
          <div className={s.rowMeta}>
            <span>{product ? product.brand : 'Your gear'}</span>
            <span aria-hidden>·</span>
            <span>{KIND_LABEL[item.kind]}</span>
            {item.source === 'catalogue' ? (
              <button
                type="button"
                className={`${s.own} ${item.owned ? s.ownYes : ''}`}
                aria-pressed={item.owned}
                onClick={() => pack.update(item.uid, { owned: !item.owned })}
                title={item.owned ? 'You own this' : 'Mark as already owned'}
              >
                {item.owned ? (
                  <>
                    <Icon name="check" size={12} /> Owned
                  </>
                ) : (
                  <>To buy · {money(product?.price ?? 0)}</>
                )}
              </button>
            ) : (
              <span className={`${s.own} ${s.ownYes}`}>
                <Icon name="check" size={12} /> Owned
              </span>
            )}
            {best && !showSwap && (
              <button type="button" className={s.hint} onClick={() => setReveal(true)}>
                See a lighter option
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={s.rowCtl}>
        <span className={s.qty} data-show={item.qty > 1}>
          <Stepper label={`quantity of ${item.name}`} value={item.qty} min={1} max={6} onChange={(v) => pack.update(item.uid, { qty: v })} />
        </span>
        <button
          type="button"
          className={`${s.worn} ${item.worn ? s.wornOn : ''}`}
          aria-pressed={item.worn}
          onClick={() => pack.update(item.uid, { worn: !item.worn })}
          title="Worn items don't count toward base weight"
        >
          Worn
        </button>
        {item.source === 'own' ? (
          <label className={s.gramsEdit}>
            <span className="sr-only">Weight of {item.name} in grams</span>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={20000}
              value={item.grams}
              onChange={(e) => pack.update(item.uid, { grams: Math.max(1, Math.min(20000, Number(e.target.value) || 1)) })}
            />
            <span>g</span>
          </label>
        ) : (
          <span className={`num ${s.rowWeight}`}>{weight(lineGrams(item), units)}</span>
        )}
        <button type="button" className={`icon-btn ${s.remove}`} onClick={() => pack.remove(item.uid)} aria-label={`Remove ${item.name}`}>
          <Icon name="close" size={16} />
        </button>
      </div>

      {best && showSwap && (
        <div className={s.swapRow}>
          <Icon name="swap" size={15} />
          <span className={s.swapText}>
            Lighter: <Link to={`/product/${best.product.id}`}>{best.product.name}</Link>
            <span className="num save"> {delta(-best.saves, units)}</span>
            <span className="muted">
              {' '}
              · {best.cost <= 0 ? (best.cost < 0 ? `saves ${money(-best.cost)}` : 'same price') : `${money(best.cost)} · ${perWeight(best.cost, best.saves, units)}`}
            </span>
          </span>
          <button type="button" className="btn btn-xs btn-secondary" onClick={() => pack.applySwap(best)}>
            Swap
          </button>
        </div>
      )}
    </div>
  );
}

function AddPanel({ sys, onDone }: { sys: SystemMeta; onDone: () => void }) {
  const pack = usePack();
  const { units } = usePrefs();
  const [tab, setTab] = useState<'store' | 'own'>('store');
  const [name, setName] = useState('');
  const [kind, setKind] = useState<Kind>(sys.kinds[0]);
  const [grams, setGrams] = useState('');
  const [extra, setExtra] = useState('');
  const options = useMemo(() => PRODUCTS.filter((p) => sys.kinds.includes(p.kind)).sort((a, b) => a.measuredGrams - b.measuredGrams), [sys]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const g = Number(grams);
    if (!name.trim() || !g) return;
    const x = Number(extra);
    const attrs = kind === 'tent' && x ? { capacity: x } : kind === 'sleeping-bag' && extra !== '' ? { tempF: x } : kind === 'pack' && x ? { volumeL: x } : undefined;
    pack.addOwn({ name: name.trim(), system: sys.id as SystemId, kind, grams: g, attrs });
    onDone();
  };

  const extraLabel = kind === 'tent' ? 'Sleeps (people)' : kind === 'sleeping-bag' ? 'Rated to (°F)' : kind === 'pack' ? 'Volume (L)' : null;

  return (
    <div className={s.add}>
      <Segmented
        label="Add from"
        value={tab}
        onChange={setTab}
        options={[
          { value: 'store', label: `From the store (${options.length})` },
          { value: 'own', label: 'Gear I already own' },
        ]}
      />
      {tab === 'store' ? (
        <ul className={s.addList}>
          {options.map((p) => {
            const already = pack.inPack(p.id);
            return (
              <li key={p.id}>
                <img src={img(p.img, 96, 96)} alt="" loading="lazy" />
                <div className={s.addText}>
                  <span className={s.addName}>{p.name}</span>
                  <span className="muted">
                    {p.brand} · {KIND_LABEL[p.kind]}
                  </span>
                </div>
                <span className="num">{weight(p.measuredGrams, units)}</span>
                <span className="num muted">{money(p.price)}</span>
                <button
                  type="button"
                  className="btn btn-xs btn-secondary"
                  disabled={!!already}
                  onClick={() => {
                    pack.addProduct(p);
                    onDone();
                  }}
                >
                  {already ? 'In pack' : 'Add'}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <form className={s.addForm} onSubmit={submit}>
          <div className="field">
            <label className="label" htmlFor={`own-name-${sys.id}`}>
              What is it?
            </label>
            <input id={`own-name-${sys.id}`} className="input" required placeholder={`e.g. My old ${KIND_LABEL[sys.kinds[0]].toLowerCase()}`} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          {sys.kinds.length > 1 && (
            <div className="field">
              <label className="label" htmlFor={`own-kind-${sys.id}`}>
                Type
              </label>
              <select id={`own-kind-${sys.id}`} className="select" value={kind} onChange={(e) => setKind(e.target.value as Kind)}>
                {sys.kinds.map((k) => (
                  <option key={k} value={k}>
                    {KIND_LABEL[k]}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="field">
            <label className="label" htmlFor={`own-g-${sys.id}`}>
              Weight (g)
            </label>
            <input id={`own-g-${sys.id}`} className="input" required type="number" inputMode="numeric" min={1} max={20000} placeholder="Weigh it if you can" value={grams} onChange={(e) => setGrams(e.target.value)} />
          </div>
          {extraLabel && (
            <div className="field">
              <label className="label" htmlFor={`own-x-${sys.id}`}>
                {extraLabel}
              </label>
              <input id={`own-x-${sys.id}`} className="input" type="number" inputMode="numeric" value={extra} onChange={(e) => setExtra(e.target.value)} />
            </div>
          )}
          <div className={s.addFormActions}>
            <button type="submit" className="btn btn-primary btn-sm">
              Add to pack
            </button>
            <span className="muted">Kitchen scales are accurate enough. Guesses are usually 10–20% light.</span>
          </div>
        </form>
      )}
    </div>
  );
}

/* ── Aside panels ─────────────────────────────────────────── */

function Readout() {
  const { totals } = usePack();
  const { units } = usePrefs();
  const shown = useTween(totals.base);
  const r = readout(shown, units);
  const { cls, next } = weightClass(totals.base);
  return (
    <div className={`panel ${s.readout}`}>
      <div className="between">
        <span className="eyebrow">Base weight</span>
        <span className="chip chip-solid">{cls.name}</span>
      </div>
      <div className={s.big} aria-live="polite">
        <span className="num">{r.value}</span>
        <small>{r.unit}</small>
      </div>
      <p className={s.next}>{next ? `${weight(next.toGo, units)} to ${next.name}` : 'The lightest class there is.'}</p>
      <ClassScale base={totals.base} />
      <div className={s.breakdown}>
        <StackedBar bySystem={totals.bySystem} base={totals.base} units={units} />
      </div>
      <dl className={`kv ${s.kv}`}>
        <dt>Worn</dt>
        <dd>{weight(totals.worn, units)}</dd>
        <dt>Base + worn</dt>
        <dd>{weight(totals.total, units)}</dd>
        <dt>Items packed</dt>
        <dd>{totals.count}</dd>
      </dl>
    </div>
  );
}

const STATUS_ICON: Record<Check['status'], Parameters<typeof Icon>[0]['name']> = { ok: 'check', warn: 'alert', missing: 'plus', optional: 'minus' };

function Checks() {
  const { checks, trip } = usePack();
  const r = readiness(checks);
  return (
    <div className={`panel ${s.panel}`}>
      <div className="between">
        <h3 className={s.panelTitle}>
          Ready for {trip.nights} night{trip.nights === 1 ? '' : 's'}?
        </h3>
        <span className={`chip ${r.missing ? 'chip-ember' : r.warn ? 'chip-amber' : 'chip-save'}`}>
          {r.ok} of {r.total} covered
        </span>
      </div>
      <ul className={s.checks}>
        {checks.map((c) => (
          <li key={c.id} data-status={c.status}>
            <span className={s.checkIcon}>
              <Icon name={STATUS_ICON[c.status]} size={13} stroke={2.4} />
            </span>
            <div>
              <span className={s.checkLabel}>{c.label}</span>
              <span className={s.checkDetail}>
                {c.detail}{' '}
                {c.status !== 'ok' && c.shop && (
                  <Link to={`/shop?sys=${c.shop}&fit=1`} className="link">
                    Find one
                  </Link>
                )}
                {c.status !== 'ok' && c.productId && (
                  <Link to={`/product/${c.productId}`} className="link">
                    See our pick
                  </Link>
                )}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Swaps() {
  const pack = usePack();
  const { units } = usePrefs();
  const top = pack.swaps.slice(0, 4);
  const three = pack.swaps.slice(0, 3);
  const threeSave = three.reduce((n, x) => n + x.saves, 0);
  const threeCost = three.reduce((n, x) => n + Math.max(0, x.cost), 0);
  return (
    <div className={`panel ${s.panel}`} id="swaps">
      <div className="between">
        <h3 className={s.panelTitle}>Best swaps</h3>
        <span className="muted" style={{ fontSize: 12.5 }}>
          Ranked by cost {perWeightLabel(units)}
        </span>
      </div>
      {top.length === 0 ? (
        <p className={s.panelEmpty}>Nothing lighter in the store fits this trip. Your pack is already lean for these conditions.</p>
      ) : (
        <>
          <ol className={s.swaps}>
            {top.map((x, i) => (
              <li key={x.item.uid}>
                <span className={s.rank}>{i + 1}</span>
                <img src={img(x.product.img, 96, 96)} alt="" loading="lazy" />
                <div className={s.swapBody}>
                  <span className={s.swapName}>
                    <Link to={`/product/${x.product.id}`}>{x.product.name}</Link>
                  </span>
                  <span className="muted">replaces {x.item.name}</span>
                  <span className={s.swapNums}>
                    <span className="num save">{delta(-x.saves, units)}</span>
                    <span className="num">{x.cost <= 0 ? (x.cost < 0 ? `saves ${money(-x.cost)}` : money(0)) : money(x.cost)}</span>
                    <span className="num muted">{perWeight(x.cost, x.saves, units)}</span>
                  </span>
                </div>
                <button type="button" className="btn btn-xs btn-secondary" onClick={() => pack.applySwap(x)}>
                  Swap
                </button>
              </li>
            ))}
          </ol>
          {three.length > 1 && (
            <button type="button" className={`btn btn-primary btn-block ${s.applyAll}`} onClick={() => pack.applySwaps(three)}>
              Apply top {three.length} · <span className="num">{delta(-threeSave, units)}</span> for <span className="num">{money(threeCost)}</span>
            </button>
          )}
          <p className={s.fine}>Like-for-like only: lighter tents still sleep your party, lighter bags are still warm enough for the low. Owned gear costs full price to replace.</p>
        </>
      )}
    </div>
  );
}

function ToBuy() {
  const pack = usePack();
  const { addMany } = useCart();
  const list = toBuy(pack.items);
  const products = list.map((i) => getProduct(i.productId)!).filter(Boolean);
  const sum = products.reduce((n, p) => n + p.price, 0);
  return (
    <div className={`panel ${s.panel}`}>
      <div className="between">
        <h3 className={s.panelTitle}>Not yet owned</h3>
        <span className="num">{money(sum)}</span>
      </div>
      {products.length === 0 ? (
        <p className={s.panelEmpty}>Everything in this pack is gear you already own.</p>
      ) : (
        <>
          <ul className={s.buyList}>
            {products.map((p) => (
              <li key={p.id}>
                <span>{p.name}</span>
                <span className="num">{money(p.price)}</span>
              </li>
            ))}
          </ul>
          <button type="button" className="btn btn-ember btn-block" onClick={() => addMany(products)}>
            <Icon name="bag" size={16} /> Add {products.length} to cart
          </button>
        </>
      )}
    </div>
  );
}

function MobileBar({ base }: { base: number }) {
  const { units } = usePrefs();
  const { swaps } = usePack();
  const shown = useTween(base);
  const r = readout(shown, units);
  const { cls } = weightClass(base);
  return (
    <div className={s.mobileBar}>
      <div>
        <span className={s.mbLabel}>Base weight</span>
        <span className={`num ${s.mbValue}`}>
          {r.value}
          <small>{r.unit}</small>
        </span>
      </div>
      <span className="chip chip-solid">{cls.short}</span>
      <a href="#swaps" className="btn btn-sm btn-on-dark">
        {swaps.length} swap{swaps.length === 1 ? '' : 's'}
      </a>
    </div>
  );
}
