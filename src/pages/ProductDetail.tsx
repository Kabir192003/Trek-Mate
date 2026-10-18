import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import s from './ProductDetail.module.css';
import { Icon } from '../components/Icon';
import { Img, Rating, Sizes, Swatches, EmptyState } from '../components/ui';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS, getProduct, reviewsFor } from '../data/products';
import { getMaker } from '../data/makers';
import { img } from '../data/img';
import { KIND_LABEL, systemForCategory } from '../data/systems';
import { usePack } from '../context/PackContext';
import { usePrefs } from '../context/PrefsContext';
import { useCart, FREE_SHIPPING_AT } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { fits, incumbent, minVolumeL, type Swap } from '../lib/pack';
import { delta, money, perWeight, weight } from '../lib/format';
import type { Product, Trip } from '../data/types';

function fitWarning(p: Product, trip: Trip): string | null {
  if (fits(p, trip)) return null;
  if (p.kind === 'tent') return `Sleeps ${p.attrs.capacity}; your trip has ${trip.people} people.`;
  if (p.kind === 'sleeping-bag') return `Rated ${p.attrs.tempF}°F; your trip's low is ${trip.lowF}°F.`;
  if (p.kind === 'pack') return `${p.attrs.volumeL} L is tight for ${trip.nights} nights; ${minVolumeL(trip.nights)} L or more is easier.`;
  return null;
}

export function ProductDetail() {
  const { id } = useParams();
  const p = getProduct(id);
  if (!p)
    return (
      <main id="main" className="container section">
        <EmptyState icon="mountain" title="That gear isn't on the map" body="It may have been retired from the catalogue. Everything we carry is in the shop." actions={[{ label: 'Back to the shop', to: '/shop', primary: true }]} />
      </main>
    );
  return <ProductView key={p.id} p={p} />;
}

function ProductView({ p }: { p: Product }) {
  const pack = usePack();
  const { units } = usePrefs();
  const cart = useCart();
  const wish = useWishlist();
  const [shot, setShot] = useState(0);
  const [color, setColor] = useState(p.colors[0]?.name ?? '');
  const [size, setSize] = useState(p.sizes[0] ?? '');
  const maker = getMaker(p.makerId);
  const sys = systemForCategory(p.cat);
  const inPack = pack.inPack(p.id);
  const cur = inPack ? undefined : incumbent(pack.items, sys.id, p.kind);
  const diff = cur ? p.measuredGrams * cur.qty - cur.grams * cur.qty : 0;
  const curProduct = cur?.productId ? getProduct(cur.productId) : undefined;
  const cost = cur ? (cur.owned || !curProduct ? p.price : p.price - curProduct.price) * cur.qty : p.price;
  const warning = fitWarning(p, pack.trip);
  const reviews = reviewsFor(p.id);
  const lighter = PRODUCTS.filter((x) => x.kind === p.kind && x.id !== p.id).sort((a, b) => a.measuredGrams - b.measuredGrams);
  const related = PRODUCTS.filter((x) => systemForCategory(x.cat).id === sys.id && x.id !== p.id).slice(0, 4);
  const toFree = Math.max(0, FREE_SHIPPING_AT - cart.subtotal - p.price);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest('input, textarea, select')) return;
      if (e.key === 'ArrowRight') setShot((i) => (i + 1) % p.gallery.length);
      if (e.key === 'ArrowLeft') setShot((i) => (i - 1 + p.gallery.length) % p.gallery.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [p.gallery.length]);

  const swapNow = () => {
    if (!cur) return;
    const sw: Swap = { item: cur, product: p, saves: -diff, cost, perGram: cost > 0 ? cost / -diff : 0, reason: '' };
    pack.applySwap(sw);
  };

  return (
    <main id="main" className={s.page}>
      <div className="container">
        <nav className={s.crumbs} aria-label="Breadcrumb">
          <Link to="/shop">Shop</Link>
          <Icon name="chevR" size={14} />
          <Link to={`/shop?sys=${sys.id}`}>{sys.name}</Link>
          <Icon name="chevR" size={14} />
          <span aria-current="page">{p.name}</span>
        </nav>

        <div className={s.top}>
          <section className={s.gallery} aria-label="Photos">
            <div className={s.mainShot}>
              <Img id={p.gallery[shot] ?? p.img} alt={`${p.name}, photo ${shot + 1} of ${p.gallery.length}`} w={1200} ratio="1 / 1" eager sizes="(max-width: 960px) 100vw, 55vw" />
              {p.tag && <span className={`chip chip-solid ${s.tag}`}>{p.tag}</span>}
            </div>
            {p.gallery.length > 1 && (
              <div className={s.thumbs}>
                {p.gallery.map((g, i) => (
                  <button key={g} type="button" aria-label={`Show photo ${i + 1}`} aria-pressed={i === shot} onClick={() => setShot(i)}>
                    <img src={img(g, 160, 160)} alt="" />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className={s.info} aria-label="Product details">
            <Link to={`/makers#${p.makerId}`} className={s.maker}>
              {p.brand} · {maker?.place}
            </Link>
            <h1 className={`h1 ${s.title}`}>{p.name}</h1>
            <div className={s.ratingRow}>
              <Rating value={p.rating} count={p.reviews} />
              <span className="muted">·</span>
              <span className="muted">{KIND_LABEL[p.kind]}</span>
            </div>
            <div className={s.priceRow}>
              <span className={`num ${s.price}`}>{money(p.price)}</span>
              {p.old && (
                <>
                  <s className="num muted">{money(p.old)}</s>
                  <span className="chip chip-save">Save {money(p.old - p.price)}</span>
                </>
              )}
            </div>
            <p className={s.blurb}>{p.blurb}</p>

            <dl className={s.readings}>
              <div>
                <dt>On our scale</dt>
                <dd className="num">{weight(p.measuredGrams, units)}</dd>
              </div>
              <div>
                <dt>Maker lists</dt>
                <dd className="num">
                  {weight(p.listedGrams, units)} <em className={p.measuredGrams > p.listedGrams ? 'gain' : 'save'}>{delta(p.measuredGrams - p.listedGrams, units)}</em>
                </dd>
              </div>
              {p.attrs.volumeL ? (
                <div>
                  <dt>Volume</dt>
                  <dd className="num">{p.attrs.volumeL} L</dd>
                </div>
              ) : p.packedL ? (
                <div>
                  <dt>Packed size</dt>
                  <dd className="num">{p.packedL} L</dd>
                </div>
              ) : null}
              <div>
                <dt>Field-tested</dt>
                <dd className="num">{p.fieldTest.days} days</dd>
              </div>
            </dl>

            <div className={s.impact} data-tone={inPack ? 'in' : cur ? (diff < 0 ? 'save' : 'heavier') : 'empty'}>
              <span className={s.impactLabel}>In your pack · {pack.trip.name}</span>
              {inPack ? (
                <p>
                  <Icon name="check" size={16} /> Already packed in {sys.name.toLowerCase()}. <Link to="/pack" className="link">Open the planner</Link>
                </p>
              ) : cur ? (
                diff < 0 ? (
                  <>
                    <p className={s.impactBig}>
                      <span className="num save">{delta(diff, units)}</span> vs your {cur.name}
                    </p>
                    <p className={s.impactSub}>
                      {cost <= 0 ? 'Costs nothing extra over what you had planned.' : `${money(cost)} for ${weight(-diff, units)} saved: ${perWeight(cost, -diff, units)}.`}{' '}
                      {cur.owned ? 'Your current one stays in your gear closet.' : 'Replaces a planned purchase, so you pay the difference.'}
                    </p>
                    <button type="button" className="btn btn-primary btn-sm" onClick={swapNow}>
                      <Icon name="swap" size={15} /> Swap into my pack
                    </button>
                  </>
                ) : (
                  <p className={s.impactBig}>
                    <span className="num">{delta(diff, units)}</span> heavier than your {cur.name}
                  </p>
                )
              ) : (
                <p>
                  Your pack has no {sys.name.toLowerCase()} yet. This would add <span className="num">{weight(p.measuredGrams, units)}</span>.
                </p>
              )}
              {warning && (
                <p className={s.warn}>
                  <Icon name="alert" size={15} /> {warning}
                </p>
              )}
            </div>

            {p.colors.length > 1 && (
              <div className={s.option}>
                <span className={s.optionLabel}>
                  Colour <strong>{color}</strong>
                </span>
                <Swatches colors={p.colors} value={color} onChange={setColor} />
              </div>
            )}
            {p.sizes.length > 1 && (
              <div className={s.option}>
                <span className={s.optionLabel}>
                  Size <strong>{size}</strong>
                </span>
                <Sizes sizes={p.sizes} value={size} onChange={setSize} />
              </div>
            )}

            <div className={s.actions}>
              <button type="button" className={`btn btn-primary ${s.cta}`} onClick={() => cart.add(p, { color, size })}>
                <Icon name="bag" size={17} /> Add to cart · {money(p.price)}
              </button>
              {inPack ? (
                <Link to="/pack" className="btn btn-secondary">
                  <Icon name="check" size={16} /> In pack
                </Link>
              ) : (
                <button type="button" className="btn btn-secondary" onClick={() => pack.addProduct(p)}>
                  <Icon name="plus" size={16} /> Add to pack
                </button>
              )}
              <button type="button" className={`icon-btn ${s.heart}`} aria-pressed={wish.has(p.id)} aria-label={wish.has(p.id) ? 'Remove from saved gear' : 'Save for later'} onClick={() => wish.toggle(p.id)}>
                <Icon name="heart" fill={wish.has(p.id)} />
              </button>
            </div>

            <ul className={s.promises}>
              <li>
                <Icon name="truck" size={16} /> {toFree > 0 ? `Free shipping once your cart passes ${money(FREE_SHIPPING_AT)} (${money(toFree)} to go)` : 'Ships free with this order'}
              </li>
              <li>
                <Icon name="return" size={16} /> 60-day returns, even if it's been on a trip
              </li>
              <li>
                <Icon name="scale" size={16} /> Weighed in-house at intake
              </li>
            </ul>
          </section>
        </div>

        <div className={s.details}>
          <section className={`panel ${s.fieldTest}`} aria-labelledby="ft">
            <p className="eyebrow">Field test</p>
            <h2 id="ft" className="h2">
              {p.fieldTest.days} days, {p.fieldTest.testers} testers
            </h2>
            <blockquote>“{p.fieldTest.note}”</blockquote>
            <ul className={s.routes}>
              {p.fieldTest.routes.map((r) => (
                <li key={r}>
                  <Icon name="route" size={14} /> {r}
                </li>
              ))}
            </ul>
          </section>

          <section className={`panel ${s.specs}`} aria-labelledby="specs">
            <p className="eyebrow">Specifications</p>
            <h2 id="specs" className="h2">
              The numbers
            </h2>
            <table className="table">
              <tbody>
                <tr>
                  <td>Weight, our scale</td>
                  <td className="r num">{weight(p.measuredGrams, units)}</td>
                </tr>
                <tr>
                  <td>Weight, maker's figure</td>
                  <td className="r num">{weight(p.listedGrams, units)}</td>
                </tr>
                {p.specs.map(([k, v]) => (
                  <tr key={k}>
                    <td>{k}</td>
                    <td className="r num">{v}</td>
                  </tr>
                ))}
                {p.packedL && (
                  <tr>
                    <td>Packed size</td>
                    <td className="r num">{p.packedL} L</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </div>

        <section className={s.section} aria-labelledby="alts">
          <div className="section-head">
            <div>
              <p className="eyebrow">Same job, every weight</p>
              <h2 id="alts" className="h2">
                Every {KIND_LABEL[p.kind].toLowerCase()} we carry
              </h2>
            </div>
          </div>
          <div className={s.tableWrap}>
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th className="r">Our scale</th>
                  <th className="r">vs this</th>
                  <th className="r">Price</th>
                  <th>Fits your trip</th>
                </tr>
              </thead>
              <tbody>
                {[p, ...lighter].sort((a, b) => a.measuredGrams - b.measuredGrams).map((x) => (
                  <tr key={x.id} className={x.id === p.id ? s.thisRow : undefined}>
                    <td>
                      {x.id === p.id ? (
                        <strong>{x.name} (this)</strong>
                      ) : (
                        <Link to={`/product/${x.id}`} className="link">
                          {x.name}
                        </Link>
                      )}
                      <span className="muted"> · {x.brand}</span>
                    </td>
                    <td className="r num">{weight(x.measuredGrams, units)}</td>
                    <td className={`r num ${x.measuredGrams < p.measuredGrams ? 'save' : 'muted'}`}>{x.id === p.id ? '–' : delta(x.measuredGrams - p.measuredGrams, units)}</td>
                    <td className="r num">{money(x.price)}</td>
                    <td>{fits(x, pack.trip) ? <span className="chip chip-save">Fits</span> : <span className="chip">Check</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className={s.section} aria-labelledby="reviews">
          <div className="section-head">
            <div>
              <p className="eyebrow">From the field</p>
              <h2 id="reviews" className="h2">
                {p.reviews.toLocaleString('en-US')} reviews · {p.rating.toFixed(1)} average
              </h2>
            </div>
          </div>
          {reviews.length ? (
            <div className={s.reviews}>
              {reviews.map((r) => (
                <figure key={r.quote} className={s.review}>
                  <div className={s.reviewTop}>
                    <Rating value={r.rating} />
                    <span className={s.reviewTrip}>
                      <Icon name="route" size={13} /> {r.trip}
                    </span>
                  </div>
                  <blockquote>“{r.quote}”</blockquote>
                  <figcaption>
                    {r.author} · {r.location} · Verified purchase
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <p className="muted">No route-tagged reviews yet. Field-test notes above come from our testers.</p>
          )}
        </section>

        {maker && (
          <section className={`${s.makerCard} topo-bg`} aria-labelledby="maker">
            <div>
              <p className={s.makerEyebrow}>Made by</p>
              <h2 id="maker" className="h2">
                {maker.name}
              </h2>
              <p className={s.makerFacts}>
                {maker.place} · since {maker.founded} · {maker.team} people
              </p>
              <p className={s.makerStory}>{maker.story}</p>
            </div>
            <blockquote>“{maker.quote}”</blockquote>
          </section>
        )}

        {related.length > 0 && (
          <section className={s.section} aria-labelledby="related">
            <div className="section-head">
              <h2 id="related" className="h2">
                More {sys.name.toLowerCase()}
              </h2>
              <Link to={`/shop?sys=${sys.id}`} className="btn btn-secondary btn-sm">
                See all <Icon name="arrowR" size={15} />
              </Link>
            </div>
            <div className={s.related}>
              {related.map((r) => (
                <ProductCard key={r.id} product={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
