import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { productImg } from '../data/products';
import type { Product } from '../data/types';
import { useWishlist } from '../context/WishlistContext';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  variant?: 'detailed' | 'minimal';
}

export function ProductCard({ product: p, variant = 'detailed' }: ProductCardProps) {
  const navigate = useNavigate();
  const { isWished, toggleWish } = useWishlist();
  const wished = isWished(p.id);

  if (variant === 'minimal') {
    return (
      <button className={styles.minimalCard} onClick={() => navigate(`/product/${p.id}`)}>
        <div className={styles.imageWrap}>
          <img src={productImg(p.img, 400)} alt={p.name} loading="lazy" />
        </div>
        <div className={styles.minimalBody}>
          <div className={styles.name}>{p.name}</div>
          <div className={styles.price}>${p.price}</div>
        </div>
      </button>
    );
  }

  return (
    <div className={`${styles.card} tm-card-hover`}>
      <button className={styles.imageBtn} onClick={() => navigate(`/product/${p.id}`)} aria-label={`View ${p.name}`}>
        <div className={styles.imageWrap}>
          <img src={productImg(p.img, 400)} alt={p.name} loading="lazy" />
          {p.tag && <div className={styles.tag}>{p.tag}</div>}
        </div>
      </button>
      <button
        className={styles.wishBtn}
        onClick={(e) => {
          e.stopPropagation();
          toggleWish(p.id);
        }}
        aria-label={wished ? `Remove ${p.name} from saved gear` : `Save ${p.name}`}
        aria-pressed={wished}
      >
        <Icon name="heart" size={16} color={wished ? 'var(--tm-accent)' : '#333'} fill={wished} />
      </button>
      <button className={styles.body} onClick={() => navigate(`/product/${p.id}`)}>
        <div className={styles.brand}>{p.brand}</div>
        <div className={styles.name}>{p.name}</div>
        <div className={styles.priceRow}>
          <span className={styles.price}>${p.price}</span>
          {p.old && <span className={styles.oldPrice}>${p.old}</span>}
          <span className={styles.rating}>
            <Icon name="star" size={11} color="var(--tm-accent)" />
            <span>{p.rating}</span>
          </span>
        </div>
      </button>
    </div>
  );
}
