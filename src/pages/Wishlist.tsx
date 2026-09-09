import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS } from '../data/products';
import { useWishlist } from '../context/WishlistContext';
import styles from './Cart.module.css';

export function Wishlist() {
  const { wishlist } = useWishlist();
  const items = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="tm-container" style={{ padding: '40px 40px 100px' }}>
      <div className={styles.title}>
        Saved gear <span className={styles.titleCount}>· {items.length}</span>
      </div>
      {items.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <Icon name="heart" size={36} color="var(--tm-text-soft)" />
          </div>
          <div className={styles.emptyTitle}>No saved gear yet.</div>
          <p className={styles.emptyBody}>Tap the heart on anything to save it for later.</p>
          <Link to="/browse" className={`tm-btn tm-btn-primary ${styles.emptyCta}`}>
            Browse gear
          </Link>
        </div>
      ) : (
        <div className="tm-product-grid">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
