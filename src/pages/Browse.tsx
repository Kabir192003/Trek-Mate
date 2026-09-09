import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES, PRODUCTS, categoryCount } from '../data/products';
import type { CategoryId } from '../data/types';
import styles from './Browse.module.css';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'rating';

const PRICE_OPTIONS: [number, string][] = [
  [9999, 'Any price'],
  [100, 'Under $100'],
  [250, 'Under $250'],
  [500, 'Under $500'],
];

export function Browse() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const cat = (params.get('cat') as CategoryId | null) ?? 'all';
  const [priceMax, setPriceMax] = useState(9999);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<SortKey>('featured');

  function setCat(id: string) {
    const next = new URLSearchParams(params);
    if (id === 'all') next.delete('cat');
    else next.set('cat', id);
    setParams(next, { replace: true });
  }

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (cat !== 'all' && p.cat !== cat) return false;
      if (q && !`${p.name} ${p.brand}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (p.price > priceMax) return false;
      if (p.rating < minRating) return false;
      return true;
    });
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [cat, q, priceMax, minRating, sort]);

  const catTabs = [{ id: 'all', name: 'All gear', count: PRODUCTS.length }, ...CATEGORIES.map((c) => ({ id: c.id, name: c.name, count: categoryCount(c.id) }))];

  return (
    <div className="tm-container" style={{ padding: '40px 40px 80px' }}>
      <div className={styles.title}>Browse gear</div>
      <div className={styles.count}>
        {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
        {q ? ` for "${q}"` : ''}
      </div>

      <div className="tm-browse-grid">
        <aside className={styles.sidebar}>
          <div>
            <div className={styles.filterHeading}>Category</div>
            <div className={styles.filterList}>
              {catTabs.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  className={styles.filterBtn}
                  data-active={cat === c.id || (cat === 'all' && c.id === 'all')}
                >
                  <span>{c.name}</span>
                  <span className={styles.filterCount}>{c.count}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className={styles.filterHeading}>Price</div>
            <div className={styles.filterList}>
              {PRICE_OPTIONS.map(([val, label]) => (
                <button key={label} onClick={() => setPriceMax(val)} className={styles.filterBtn} data-active={priceMax === val}>
                  <span className={styles.radioDot} data-active={priceMax === val} />
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className={styles.filterHeading}>Rating</div>
            <button
              onClick={() => setMinRating(minRating === 4.5 ? 0 : 4.5)}
              className={styles.filterBtn}
              data-active={minRating > 0}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <Icon name="star" size={13} color="var(--tm-accent)" /> 4.5 &amp; up
            </button>
          </div>
        </aside>

        <div>
          <div className={styles.sortRow}>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className={styles.sortSelect} aria-label="Sort products">
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to high</option>
              <option value="price-desc">Price: High to low</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyTitle}>No matches</div>
              <div className={styles.emptyBody}>Try a broader price range or a different category.</div>
            </div>
          ) : (
            <div className="tm-product-grid">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
