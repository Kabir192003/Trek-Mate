import { Link } from 'react-router-dom';
import s from './Home.module.css';
import { Icon, SYSTEM_ICON } from '../components/Icon';
import { Img, StackedBar } from '../components/ui';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS, REVIEWS, TOTAL_FIELD_DAYS, getProduct } from '../data/products';
import { MAKERS } from '../data/makers';
import { SYSTEMS } from '../data/systems';
import { usePack } from '../context/PackContext';
import { usePrefs } from '../context/PrefsContext';
import { useTween } from '../hooks/useTween';
import { SEASON_LABEL, weightClass } from '../lib/pack';
import { delta, money, perWeight, readout, weight } from '../lib/format';

const FEATURED = ['p10', 'p1', 'p14', 'p20', 'p5', 'p21', 'p4', 'p19'];

export function Home() {
  return (
    <main id="main" className="flush">
      <Hero />
      <Different />
      <Systems />
      <Featured />
      <Makers />
      <Field />
      <Closing />
    </main>
  );
}

function Hero() {
  const pack = usePack();
  const { units } = usePrefs();
  const shown = useTween(pack.totals.base);
  const r = readout(shown, units);
  const { cls } = weightClass(pack.totals.base);
  const two = pack.swaps.slice(0, 2);
  const saves = two.reduce((n, x) => n + x.saves, 0);
  const cost = two.reduce((n, x) => n + Math.max(0, x.cost), 0);

  return (
    <section className={s.hero}>
      <div className={`container ${s.heroGrid}`}>
        <div className={s.heroCopy}>
          <p className="eyebrow">Independent makers · Weighed in-house · Planned as a pack</p>
          <h1 className={`display ${s.heroTitle}`}>
            Carry less.
            <br />
            Know exactly why.
          </h1>
          <p className={s.heroLede}>
            Gear from {MAKERS.length} independent makers, weighed on our own scale and planned as a whole pack, not sold one box at a time.
          </p>
          <div className={s.heroCtas}>
            <Link to="/pack" className="btn btn-primary">
              Plan your pack <Icon name="arrowR" size={16} />
            </Link>
            <Link to="/shop" className="btn btn-secondary">
              Shop the gear
            </Link>
          </div>
          <dl className={s.heroStats}>
            <div>
              <dt>Products</dt>
              <dd className="num">{PRODUCTS.length}</dd>
            </div>
            <div>
              <dt>Makers</dt>
              <dd className="num">{MAKERS.length}</dd>
            </div>
            <div>
              <dt>Field-test days</dt>
              <dd className="num">{TOTAL_FIELD_DAYS.toLocaleString('en-US')}</dd>
            </div>
          </dl>
        </div>

        <div className={s.heroVisual}>
          <Img id="photo-1551632811-561732d1e306" alt="Two backpackers walking a mountain trail under heavy packs" w={1400} ratio="4 / 4.6" eager sizes="(max-width: 960px) 100vw, 50vw" />
          <Link to="/pack" className={s.readout} aria-label="Open your pack in the Pack Planner">
            <div className="between">
              <span className="eyebrow">Your pack</span>
              <span className={s.readoutTrip}>
                {pack.trip.nights} nights · {SEASON_LABEL[pack.trip.season]}
              </span>
            </div>
            <span className={s.readoutName}>{pack.trip.name}</span>
            <div className={s.readoutRow}>
              <span className={`num ${s.readoutBig}`}>
                {r.value}
                <small>{r.unit}</small>
              </span>
              <span className="chip chip-solid">{cls.name}</span>
            </div>
            <StackedBar bySystem={pack.totals.bySystem} base={pack.totals.base} units={units} legend={false} />
            {two.length > 0 ? (
              <p className={s.readoutSwap}>
                <Icon name="swap" size={15} />
                <span>
                  {two.length} swap{two.length === 1 ? '' : 's'}: <strong className="num save">{delta(-saves, units)}</strong> for <strong className="num">{money(cost)}</strong>
                </span>
                <Icon name="arrowR" size={15} />
              </p>
            ) : (
              <p className={s.readoutSwap}>Already as light as the store allows.</p>
            )}
          </Link>
        </div>
      </div>
    </section>
  );
}

function Different() {
  const pack = usePack();
  const { units } = usePrefs();
  const fp = getProduct('p10')!;
  const top = pack.swaps[0];
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Why Trek Mate</p>
            <h2 className="h1">A store that helps you decide what to carry</h2>
            <p>Most stores sell one product at a time and quote the maker's weight. Pack apps know your kit but sell nothing. Trek Mate does both, honestly.</p>
          </div>
        </div>
        <div className={s.diffGrid}>
          <article className={s.diff}>
            <span className={s.diffNum}>01</span>
            <h3>Weighed, not quoted</h3>
            <p>Every item goes on our scale when it arrives. You plan with the number that will actually be on your back.</p>
            <div className={s.diffDemo}>
              <div className={s.scaleRow}>
                <span className="muted">Maker lists</span>
                <span className="num">{weight(fp.listedGrams, units)}</span>
              </div>
              <div className={s.scaleRow}>
                <span>Our scale</span>
                <span className="num">
                  {weight(fp.measuredGrams, units)} <em className="gain">{delta(fp.measuredGrams - fp.listedGrams, units)}</em>
                </span>
              </div>
              <span className={s.demoCaption}>{fp.name}</span>
            </div>
          </article>
          <article className={s.diff}>
            <span className={s.diffNum}>02</span>
            <h3>Planned as a pack</h3>
            <p>See your base weight live, where it sits by system, and what's missing for the trip you're actually taking.</p>
            <div className={s.diffDemo}>
              <StackedBar bySystem={pack.totals.bySystem} base={pack.totals.base} units={units} compact />
            </div>
          </article>
          <article className={s.diff}>
            <span className={s.diffNum}>03</span>
            <h3>Swaps ranked by value</h3>
            <p>Every lighter option is like-for-like, priced against what you already own, and ranked by what each gram saved costs you.</p>
            <div className={s.diffDemo}>
              {top ? (
                <>
                  <div className={s.scaleRow}>
                    <span className="muted">Replace</span>
                    <span>{top.item.name}</span>
                  </div>
                  <div className={s.scaleRow}>
                    <span className="muted">With</span>
                    <Link to={`/product/${top.product.id}`} className="link">
                      {top.product.name}
                    </Link>
                  </div>
                  <div className={s.scaleRow}>
                    <span className="num save">{delta(-top.saves, units)}</span>
                    <span className="num">{perWeight(top.cost, top.saves, units)}</span>
                  </div>
                </>
              ) : (
                <span className={s.demoCaption}>Your pack is already as light as the store allows.</span>
              )}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function Systems() {
  const { units } = usePrefs();
  return (
    <section className={`section ${s.systems}`}>
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Shop by system</p>
            <h2 className="h1">Think in systems, not aisles</h2>
          </div>
          <Link to="/shop" className="btn btn-secondary btn-sm">
            All gear <Icon name="arrowR" size={15} />
          </Link>
        </div>
        <div className={s.sysGrid}>
          {SYSTEMS.map((sy) => {
            const items = PRODUCTS.filter((p) => sy.kinds.includes(p.kind));
            const ws = items.map((p) => p.measuredGrams);
            const lightest = items.reduce((a, b) => (b.measuredGrams < a.measuredGrams ? b : a), items[0]);
            return (
              <Link key={sy.id} to={`/shop?sys=${sy.id}`} className={s.sysCard}>
                <Img id={lightest.img} alt="" w={560} ratio="16 / 10" sizes="(max-width: 720px) 50vw, 25vw" />
                <div className={s.sysBody}>
                  <div className="between">
                    <span className={s.sysName}>
                      <Icon name={SYSTEM_ICON[sy.id]} size={16} /> {sy.name}
                    </span>
                    <span className="num muted">{items.length}</span>
                  </div>
                  <span className={`num ${s.sysRange}`}>
                    {weight(Math.min(...ws), units)} – {weight(Math.max(...ws), units)}
                  </span>
                  <span className={s.sysLight}>Lightest: {lightest.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Featured() {
  const items = FEATURED.map((id) => getProduct(id)!).filter(Boolean);
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Off the scale this season</p>
            <h2 className="h1">Field-tested favourites</h2>
          </div>
          <Link to="/shop?sort=light" className="btn btn-secondary btn-sm">
            Lightest first <Icon name="arrowR" size={15} />
          </Link>
        </div>
        <div className={s.productGrid}>
          {items.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 4} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Makers() {
  return (
    <section className={`section ${s.makers}`}>
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">The makers</p>
            <h2 className="h1">Seven workshops. No warehouses.</h2>
            <p>Small teams who design, test and repair what they make. We pick them for the numbers, then hold them to them.</p>
          </div>
          <Link to="/makers" className="btn btn-secondary btn-sm">
            Meet them <Icon name="arrowR" size={15} />
          </Link>
        </div>
        <div className={s.makerGrid}>
          {MAKERS.map((m) => {
            const n = PRODUCTS.filter((p) => p.makerId === m.id).length;
            return (
              <Link key={m.id} to={`/makers#${m.id}`} className={s.maker}>
                <span className={s.makerName}>{m.name}</span>
                <span className={s.makerPlace}>
                  <Icon name="pin" size={13} /> {m.place}
                </span>
                <span className={s.makerMakes}>{m.makes}</span>
                <span className={s.makerMeta}>
                  <span className="num">Est. {m.founded}</span>
                  <span className="num">{m.team} people</span>
                  <span className="num">{n} products</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Field() {
  const picks = [REVIEWS[3], REVIEWS[7], REVIEWS[9]];
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">From the field</p>
            <h2 className="h1">Reviews with a route attached</h2>
            <p>Every review says where the gear went and for how long, so you can weigh it against your own trip.</p>
          </div>
        </div>
        <div className={s.fieldGrid}>
          {picks.map((r) => {
            const p = getProduct(r.productId)!;
            return (
              <figure key={r.quote} className={s.review}>
                <div className={s.reviewTrip}>
                  <Icon name="route" size={14} /> {r.trip}
                </div>
                <blockquote>“{r.quote}”</blockquote>
                <figcaption>
                  <span>
                    {r.author} · {r.location}
                  </span>
                  <Link to={`/product/${p.id}`} className="link">
                    {p.name}
                  </Link>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className={`${s.closing} topo-bg`}>
      <div className={`container ${s.closingInner}`}>
        <div>
          <h2 className="h1">Start with what you already own.</h2>
          <p>Add your current kit to the planner. We'll show what to change, what it saves, and exactly what it costs. Buy only the pieces that move the number.</p>
        </div>
        <Link to="/pack" className="btn btn-on-dark">
          Open the Pack Planner <Icon name="arrowR" size={16} />
        </Link>
      </div>
    </section>
  );
}
