import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import s from './Shop.module.css';
import { Icon, SYSTEM_ICON } from '../components/Icon';
import { ProductCard } from '../components/ProductCard';
import { RangeSlider } from '../components/RangeSlider';
import { Drawer } from '../components/Drawer';
import { EmptyState, Rating, Segmented, Switch, WeightBar } from '../components/ui';
import { PRODUCTS } from '../data/products';
import { MAKERS, getMaker } from '../data/makers';
import { SYSTEMS, systemForCategory, systemMeta } from '../data/systems';
import { img } from '../data/img';
import { searchProducts } from '../lib/search';
import { fits, incumbent } from '../lib/pack';
import { delta, money, weight } from '../lib/format';
import { usePack } from '../context/PackContext';
import { usePrefs } from '../context/PrefsContext';
import type { Product, SystemId } from '../data/types';

type Sort = 'featured' | 'light' | 'price-asc' | 'price-desc' | 'rating' | 'tested';

const SORTS: { value: Sort; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'light', label: 'Lightest first' },
  { value: 'price-asc', label: 'Price, low to high' },
  { value: 'price-desc', label: 'Price, high to low' },
  { value: 'rating', label: 'Top rated' },
  { value: 'tested', label: 'Most field-tested' },
];

function bounds(ps: Product[], f: (p: Product) => number): [number, number] {
  if (!ps.length) return [0, 1];
  const v = ps.map(f);
  return [Math.min(...v), Math.max(...v)];
}

export function Shop() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const pack = usePack();
  const { units } = usePrefs();

  const q = params.get('q') ?? '';
  const sys = (params.get('sys') as SystemId | null) ?? null;
  const makers = (params.get('maker') ?? '').split(',').filter(Boolean);
  const sort = (params.get('sort') as Sort) ?? 'featured';
  const minRating = Number(params.get('rating') ?? 0);
  const lighter = params.get('lighter') === '1';
  const fit = params.get('fit') === '1';
  const view = params.get('view') === 'table' ? 'table' : 'grid';

  const set = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v === null || v === '' ? next.delete(k) : next.set(k, v)));
    setParams(next, { replace: true });
  };

  const sysPool = useMemo(() => (sys ? PRODUCTS.filter((p) => systemMeta(sys).kinds.includes(p.kind)) : PRODUCTS), [sys]);
  const wB = bounds(sysPool, (p) => p.measuredGrams);
  const pB = bounds(sysPool, (p) => p.price);
  const wMin = Number(params.get('wmin') ?? wB[0]);
  const wMax = Number(params.get('wmax') ?? wB[1]);
  const pMin = Number(params.get('pmin') ?? pB[0]);
  const pMax = Number(params.get('pmax') ?? pB[1]);
  const wRange: [number, number] = [wMin, wMax];
  const pRange: [number, number] = [pMin, pMax];
  const makerKey = makers.join(',');
  const { items: packItems, trip } = pack;

  const results = useMemo(() => {
    const picked = makerKey ? makerKey.split(',') : [];
    let list = searchProducts(q, sysPool);
    list = list.filter(
      (p) =>
        p.measuredGrams >= wMin &&
        p.measuredGrams <= wMax &&
        p.price >= pMin &&
        p.price <= pMax &&
        p.rating >= minRating &&
        (!picked.length || picked.includes(p.makerId)),
    );
    if (fit) list = list.filter((p) => fits(p, trip));
    if (lighter)
      list = list.filter((p) => {
        const cur = incumbent(packItems, systemForCategory(p.cat).id, p.kind);
        return !!cur && cur.productId !== p.id && p.measuredGrams < cur.grams;
      });
    const sorted = [...list];
    if (sort === 'light') sorted.sort((a, b) => a.measuredGrams - b.measuredGrams);
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    if (sort === 'tested') sorted.sort((a, b) => b.fieldTest.days - a.fieldTest.days);
    return sorted;
  }, [q, sysPool, wMin, wMax, pMin, pMax, minRating, makerKey, fit, lighter, sort, packItems, trip]);

  // 12-bucket weight histogram for the current system
  const hist = useMemo(() => {
    const [lo, hi] = bounds(sysPool, (p) => p.measuredGrams);
    const b = new Array(12).fill(0) as number[];
    const span = Math.max(1, hi - lo);
    sysPool.forEach((p) => b[Math.min(11, Math.floor(((p.measuredGrams - lo) / span) * 12))]++);
    return b;
  }, [sysPool]);

  const chips: { label: string; clear: Record<string, null> }[] = [];
  if (q) chips.push({ label: `“${q}”`, clear: { q: null } });
  makers.forEach((m) => chips.push({ label: getMaker(m)?.name ?? m, clear: { maker: makers.filter((x) => x !== m).join(',') || null } as Record<string, null> }));
  if (params.get('wmin') || params.get('wmax')) chips.push({ label: `${weight(wRange[0], units)} to ${weight(wRange[1], units)}`, clear: { wmin: null, wmax: null } });
  if (params.get('pmin') || params.get('pmax')) chips.push({ label: `${money(pRange[0])} to ${money(pRange[1])}`, clear: { pmin: null, pmax: null } });
  if (minRating) chips.push({ label: `${minRating}+ stars`, clear: { rating: null } });
  if (lighter) chips.push({ label: 'Lighter than my pack', clear: { lighter: null } });
  if (fit) chips.push({ label: 'Fits my trip', clear: { fit: null } });

  const clearAll = () => setParams(sys ? { sys } : {}, { replace: true });

  const rail = (
    <div className={s.rail}>
      <div className={s.block}>
        <span className={s.blockTitle}>Your pack</span>
        <label className={s.switchRow}>
          <span>
            <strong>Lighter than what I carry</strong>
            <span className="muted">Only gear that beats the item in your pack</span>
          </span>
          <Switch checked={lighter} onChange={(v) => set({ lighter: v ? '1' : null })} label="Lighter than what I carry" />
        </label>
        <label className={s.switchRow}>
          <span>
            <strong>Fits my trip</strong>
            <span className="muted">
              {pack.trip.people} {pack.trip.people === 1 ? 'person' : 'people'} · low {pack.trip.lowF}°F · {pack.trip.nights} nights
            </span>
          </span>
          <Switch checked={fit} onChange={(v) => set({ fit: v ? '1' : null })} label="Fits my trip" />
        </label>
      </div>

      <div className={s.block}>
        <span className={s.blockTitle}>Weight on our scale</span>
        <RangeSlider
          min={wB[0]}
          max={wB[1]}
          step={1}
          value={wRange}
          histogram={hist}
          label="Weight"
          format={(n) => weight(n, units)}
          onChange={([a, b]) => set({ wmin: a === wB[0] ? null : String(a), wmax: b === wB[1] ? null : String(b) })}
        />
      </div>

      <div className={s.block}>
        <span className={s.blockTitle}>Price</span>
        <RangeSlider
          min={pB[0]}
          max={pB[1]}
          step={1}
          value={pRange}
          label="Price"
          format={(n) => money(n)}
          onChange={([a, b]) => set({ pmin: a === pB[0] ? null : String(a), pmax: b === pB[1] ? null : String(b) })}
        />
      </div>

      <div className={s.block}>
        <span className={s.blockTitle}>Maker</span>
        <ul className={s.makerList}>
          {MAKERS.map((m) => {
            const n = sysPool.filter((p) => p.makerId === m.id).length;
            if (!n) return null;
            const on = makers.includes(m.id);
            return (
              <li key={m.id}>
                <label>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={on}
                    onChange={() => set({ maker: (on ? makers.filter((x) => x !== m.id) : [...makers, m.id]).join(',') || null })}
                  />
                  <span>{m.name}</span>
                  <span className="num muted">{n}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={s.block}>
        <span className={s.blockTitle}>Rating</span>
        <Segmented
          label="Minimum rating"
          value={String(minRating)}
          onChange={(v) => set({ rating: v === '0' ? null : v })}
          options={[
            { value: '0', label: 'Any' },
            { value: '4.5', label: '4.5+' },
            { value: '4.7', label: '4.7+' },
          ]}
        />
      </div>
    </div>
  );

  return (
    <main id="main" className={s.page}>
      <div className="container">
        <header className={s.head}>
          <div>
            <p className="eyebrow">{sys ? `Shop · ${systemMeta(sys).name}` : 'Shop'}</p>
            <h1 className="h1">{sys ? systemMeta(sys).name : 'All gear'}</h1>
            <p className={s.sub}>
              {sysPool.length} products · {weight(wB[0], units)} to {weight(wB[1], units)} · every weight from our scale
            </p>
          </div>
          <div className={s.search}>
            <Icon name="search" size={18} />
            <input type="search" placeholder="Search by name, maker or route" value={q} onChange={(e) => set({ q: e.target.value })} aria-label="Search gear" />
            {q && (
              <button type="button" onClick={() => set({ q: null })} aria-label="Clear search">
                <Icon name="close" size={16} />
              </button>
            )}
          </div>
        </header>

        <nav className={s.tabs} aria-label="Systems">
          <button type="button" aria-pressed={!sys} onClick={() => setParams(q ? { q } : {}, { replace: true })}>
            All <span className="num">{PRODUCTS.length}</span>
          </button>
          {SYSTEMS.map((sy) => (
            <button key={sy.id} type="button" aria-pressed={sys === sy.id} onClick={() => setParams({ sys: sy.id, ...(q ? { q } : {}) }, { replace: true })}>
              <Icon name={SYSTEM_ICON[sy.id]} size={15} /> {sy.name} <span className="num">{PRODUCTS.filter((p) => sy.kinds.includes(p.kind)).length}</span>
            </button>
          ))}
        </nav>

        <div className={s.layout}>
          <aside className={s.desktopRail} aria-label="Filters">
            {rail}
          </aside>

          <section className={s.results} aria-label="Results">
            <div className={s.toolbar}>
              <button type="button" className={`btn btn-secondary btn-sm ${s.filterBtn}`} onClick={() => setFiltersOpen(true)}>
                <Icon name="sliders" size={16} /> Filters{chips.length ? ` (${chips.length})` : ''}
              </button>
              <p className={s.count} aria-live="polite">
                <strong className="num">{results.length}</strong> {results.length === 1 ? 'result' : 'results'}
              </p>
              <div className={s.toolRight}>
                <label className="sr-only" htmlFor="sort">
                  Sort
                </label>
                <select id="sort" className={`select ${s.sort}`} value={sort} onChange={(e) => set({ sort: e.target.value === 'featured' ? null : e.target.value })}>
                  {SORTS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <div className={s.viewToggle} role="group" aria-label="View">
                  <button type="button" aria-pressed={view === 'grid'} onClick={() => set({ view: null })} aria-label="Grid view">
                    <Icon name="grid" size={17} />
                  </button>
                  <button type="button" aria-pressed={view === 'table'} onClick={() => set({ view: 'table' })} aria-label="Compare table view">
                    <Icon name="list" size={17} />
                  </button>
                </div>
              </div>
            </div>

            {chips.length > 0 && (
              <div className={s.chips}>
                {chips.map((c) => (
                  <button key={c.label} type="button" className={s.activeChip} onClick={() => set(c.clear)}>
                    {c.label} <Icon name="close" size={13} />
                  </button>
                ))}
                <button type="button" className={`link ${s.clearAll}`} onClick={clearAll}>
                  Clear all
                </button>
              </div>
            )}

            {results.length === 0 ? (
              <EmptyState
                icon="search"
                title="Nothing matches all of that"
                body={
                  lighter
                    ? 'Nothing in the store beats what is already in your pack for this system. That is a good sign.'
                    : `Try widening the weight or price range. The lightest ${sys ? systemMeta(sys).name.toLowerCase() : 'item'} we carry is ${weight(wB[0], units)}.`
                }
              />
            ) : view === 'grid' ? (
              <div className={s.grid}>
                {results.map((p, i) => (
                  <ProductCard key={p.id} product={p} priority={i < 6} />
                ))}
              </div>
            ) : (
              <CompareTable products={results} />
            )}
          </section>
        </div>
      </div>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        footer={
          <div className="between">
            <button type="button" className="btn btn-ghost" onClick={clearAll}>
              Clear all
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setFiltersOpen(false)}>
              Show {results.length} results
            </button>
          </div>
        }
      >
        {rail}
      </Drawer>
    </main>
  );
}

function CompareTable({ products }: { products: Product[] }) {
  const pack = usePack();
  const { units } = usePrefs();
  const [lo, hi] = bounds(products, (p) => p.measuredGrams);
  return (
    <div className={s.tableWrap}>
      <table className="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Weight, our scale</th>
            <th className="r">Maker lists</th>
            <th className="r">vs your pack</th>
            <th className="r">Price</th>
            <th>Rating</th>
            <th className="r">Field days</th>
            <th>
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const cur = incumbent(pack.items, systemForCategory(p.cat).id, p.kind);
            const inPack = pack.inPack(p.id);
            const d = cur && !inPack ? p.measuredGrams - cur.grams : null;
            return (
              <tr key={p.id}>
                <td>
                  <Link to={`/product/${p.id}`} className={s.tProduct}>
                    <img src={img(p.img, 96, 96)} alt="" loading="lazy" />
                    <span>
                      <strong>{p.name}</strong>
                      <span className="muted">{p.brand}</span>
                    </span>
                  </Link>
                </td>
                <td style={{ minWidth: 150 }}>
                  <span className="num" style={{ fontWeight: 600 }}>
                    {weight(p.measuredGrams, units)}
                  </span>
                  <div style={{ marginTop: 6 }}>
                    <WeightBar grams={p.measuredGrams} min={lo} max={hi} />
                  </div>
                </td>
                <td className="r num muted">{weight(p.listedGrams, units)}</td>
                <td className={`r num ${d !== null && d < 0 ? 'save' : 'muted'}`}>{inPack ? 'In pack' : d === null ? '–' : delta(d, units)}</td>
                <td className="r num">{money(p.price)}</td>
                <td>
                  <Rating value={p.rating} />
                </td>
                <td className="r num">{p.fieldTest.days}</td>
                <td className="r">
                  {inPack ? (
                    <Link to="/pack" className="btn btn-xs btn-secondary">
                      View
                    </Link>
                  ) : (
                    <button type="button" className="btn btn-xs btn-secondary" onClick={() => pack.addProduct(p)}>
                      <Icon name="plus" size={13} /> Pack
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
