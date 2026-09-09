import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { TopoSvg } from '../components/Icon';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES, COLLECTIONS, PRODUCTS, categoryCount, productImg } from '../data/products';
import styles from './Home.module.css';

const VALUE_PROPS = [
  {
    icon: 'scale' as const,
    title: 'Scored on what matters',
    body: 'Every listing leads with weight, durability, and pack volume — not marketing copy. Compare gear the way you actually decide on trail.',
  },
  {
    icon: 'shield' as const,
    title: 'Field-tested, not just sold',
    body: 'Our buyers carry every SKU for at least one multi-day trip before it ships to you. No product goes live untested.',
  },
  {
    icon: 'leaf' as const,
    title: 'Independent makers only',
    body: 'We skip the big-box overstock and work directly with small workshops who obsess over the same details you do.',
  },
];

const FEATURED = PRODUCTS.slice(0, 8);

export function Home() {
  return (
    <div>
      <section className={styles.hero}>
        <img
          src={productImg('photo-1483921020237-2ff51e8e4b22', 1800, 900)}
          alt="Snow-covered trekking route through mountains"
          className={styles.heroImg}
        />
        <TopoSvg color="rgba(250,247,241,0.14)" />
        <div className={styles.heroScrim} />
        <div className={`tm-container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>Winter Capsule '26</div>
            <h1 className={styles.heroTitle}>The cold doesn't care if you're ready.</h1>
            <p className={styles.heroBody}>38 essentials for cold-weather trekking, tested down to −30°C.</p>
            <Link to="/browse?cat=winter" className={`tm-btn ${styles.heroCta}`}>
              Shop the capsule <Icon name="arrowR" size={16} color="var(--tm-forest)" />
            </Link>
          </div>
        </div>
      </section>

      <section className="tm-container" style={{ paddingTop: 64 }}>
        <div className={styles.valueGrid}>
          {VALUE_PROPS.map((v) => (
            <div key={v.title} className={styles.valueCard}>
              <div className={styles.valueIcon}>
                <Icon name={v.icon} size={20} color="var(--tm-primary)" />
              </div>
              <div className={styles.valueTitle}>{v.title}</div>
              <p className={styles.valueBody}>{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="tm-container" style={{ paddingTop: 72 }}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Shop by gear</h2>
          <Link to="/browse" className={styles.seeAll}>
            See all →
          </Link>
        </div>
        <div className="tm-cat-grid">
          {CATEGORIES.map((c) => (
            <Link key={c.id} to={`/browse?cat=${c.id}`} className={`tm-card-hover ${styles.catTile}`}>
              <div className={styles.catImage}>
                <img src={productImg(c.img, 320, 340)} alt={c.name} loading="lazy" />
              </div>
              <div className={styles.catName}>{c.name}</div>
              <div className={styles.catCount}>{categoryCount(c.id)} items</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="tm-container" style={{ paddingTop: 72 }}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Field-tested favorites</h2>
          <Link to="/browse" className={styles.seeAll}>
            See all →
          </Link>
        </div>
        <div className="tm-product-grid">
          {FEATURED.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="tm-container" style={{ paddingTop: 80, paddingBottom: 8 }}>
        <h2 className={styles.sectionTitle} style={{ marginBottom: 24 }}>
          Collections
        </h2>
        <div className="tm-collections-grid">
          {COLLECTIONS.map((c) => (
            <Link
              key={c.id}
              to={c.categoryFilter ? `/browse?cat=${c.categoryFilter}` : '/browse'}
              className={`tm-card-hover ${styles.collectionCard}`}
            >
              <img src={productImg(c.img, 500, 520)} alt={c.name} loading="lazy" />
              <div className={styles.collectionScrim} />
              <div className={styles.collectionCopy}>
                <div className={styles.collectionTag}>{c.tag}</div>
                <div className={styles.collectionName}>{c.name}</div>
                <div className={styles.collectionSub}>{c.subtitle}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
