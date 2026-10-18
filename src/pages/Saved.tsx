import s from './Saved.module.css';
import { ProductCard } from '../components/ProductCard';
import { EmptyState } from '../components/ui';
import { Icon } from '../components/Icon';
import { getProduct } from '../data/products';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { usePrefs } from '../context/PrefsContext';
import { money, weight } from '../lib/format';

export function Saved() {
  const { ids } = useWishlist();
  const { addMany } = useCart();
  const { units } = usePrefs();
  const items = ids.map((id) => getProduct(id)!).filter(Boolean);
  const drops = items.filter((p) => p.old);
  const total = items.reduce((n, p) => n + p.price, 0);
  const grams = items.reduce((n, p) => n + p.measuredGrams, 0);

  return (
    <main id="main" className={`container ${s.page}`}>
      <div className={s.head}>
        <div>
          <p className="eyebrow">Saved gear</p>
          <h1 className="h1">Things you're weighing up</h1>
          {items.length > 0 && (
            <p className={s.sub}>
              {items.length} item{items.length === 1 ? '' : 's'} · <span className="num">{money(total)}</span> · <span className="num">{weight(grams, units)}</span> together
            </p>
          )}
        </div>
        {items.length > 0 && (
          <button type="button" className="btn btn-secondary" onClick={() => addMany(items)}>
            <Icon name="bag" size={16} /> Add all to cart
          </button>
        )}
      </div>

      {drops.length > 0 && (
        <div className={s.drops}>
          <Icon name="bell" size={18} />
          <p>
            <strong>
              {drops.length} price drop{drops.length === 1 ? '' : 's'}
            </strong>{' '}
            on gear you saved: {drops.map((p) => `${p.name} (${money(p.old! - p.price)} off)`).join(', ')}.
          </p>
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState
          icon="heart"
          title="Nothing saved yet"
          body="Tap the heart on anything you're considering. We'll keep it here with its weight and tell you if the price drops."
          actions={[{ label: 'Browse the shop', to: '/shop', primary: true }]}
        />
      ) : (
        <div className={s.grid}>
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
