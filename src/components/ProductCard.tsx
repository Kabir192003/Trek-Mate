import { Link } from 'react-router-dom';
import s from './ProductCard.module.css';
import { Icon } from './Icon';
import { Img, Rating, WeightBar } from './ui';
import { usePack } from '../context/PackContext';
import { usePrefs } from '../context/PrefsContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { delta, money, weight } from '../lib/format';
import { incumbent, kindRange } from '../lib/pack';
import { systemForCategory } from '../data/systems';
import type { Product } from '../data/types';

export function ProductCard({ product: p, priority }: { product: Product; priority?: boolean }) {
  const { units } = usePrefs();
  const { has, toggle } = useWishlist();
  const { add } = useCart();
  const pack = usePack();
  const saved = has(p.id);
  const inPack = pack.inPack(p.id);
  const range = kindRange(p);
  const sys = systemForCategory(p.cat);
  const current = inPack ? undefined : incumbent(pack.items, sys.id, p.kind);
  const diff = current ? p.measuredGrams - current.grams : 0;

  return (
    <article className={s.card}>
      <div className={s.mediaWrap}>
        <Link to={`/product/${p.id}`} className={s.media} aria-label={`${p.name} by ${p.brand}`}>
          <Img id={p.img} alt="" w={720} ratio="4 / 5" eager={priority} />
          {p.gallery[1] && <Img id={p.gallery[1]} alt="" w={720} ratio="4 / 5" className={s.alt} />}
        </Link>
        {p.tag && <span className={`chip chip-solid ${s.tag}`}>{p.tag}</span>}
        <button
          type="button"
          className={s.save}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${p.name} from saved gear` : `Save ${p.name}`}
          onClick={() => toggle(p.id)}
        >
          <Icon name="heart" size={18} fill={saved} />
        </button>
      </div>

      <div className={s.body}>
        <div className={s.topline}>
          <span className="eyebrow">{p.brand}</span>
          <Rating value={p.rating} />
        </div>
        <Link to={`/product/${p.id}`} className={s.name}>
          {p.name}
        </Link>

        <div className={s.metrics}>
          <div>
            <span className={`num ${s.weight}`}>{weight(p.measuredGrams, units)}</span>
            <span className={s.scaleLabel}>on our scale</span>
          </div>
          <div className={s.price}>
            {p.old && <s className="num muted">{money(p.old)}</s>}
            <span className="num">{money(p.price)}</span>
          </div>
        </div>

        {range && (
          <div className={s.range}>
            <WeightBar grams={p.measuredGrams} min={range[0]} max={range[1]} />
            <div className={s.rangeLabels}>
              <span>Lightest</span>
              <span>Heaviest</span>
            </div>
          </div>
        )}

        <p className={s.impact} data-tone={inPack ? 'in' : diff < 0 ? 'save' : 'neutral'}>
          {inPack ? (
            <>
              <Icon name="check" size={14} /> In your pack
            </>
          ) : current ? (
            <>
              <span className="num">{delta(diff, units)}</span> vs your {current.name}
            </>
          ) : (
            <>
              <Icon name="route" size={14} /> {p.fieldTest.days} field days · {p.fieldTest.testers} testers
            </>
          )}
        </p>

        <div className={s.actions}>
          {inPack ? (
            <Link to="/pack" className="btn btn-secondary btn-sm">
              View pack
            </Link>
          ) : (
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => pack.addProduct(p)}>
              <Icon name="plus" size={15} /> Add to pack
            </button>
          )}
          <button type="button" className="icon-btn" aria-label={`Add ${p.name} to cart`} title="Add to cart" onClick={() => add(p)}>
            <Icon name="bag" size={19} />
          </button>
        </div>
      </div>
    </article>
  );
}
