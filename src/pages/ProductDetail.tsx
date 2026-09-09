import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { ProductCard } from '../components/ProductCard';
import { PRODUCTS, REVIEWS, productImg } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import styles from './ProductDetail.module.css';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];
  const { addToCart } = useCart();
  const { isWished, toggleWish } = useWishlist();

  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[Math.min(1, product.sizes.length - 1)]);
  const [imgIdx, setImgIdx] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setColor(product.colors[0]);
    setSize(product.sizes[Math.min(1, product.sizes.length - 1)]);
    setImgIdx(0);
    setAdded(false);
  }, [product]);

  const wished = isWished(product.id);
  const related = PRODUCTS.filter((x) => x.cat === product.cat && x.id !== product.id).slice(0, 4);
  const reviews = REVIEWS[product.id] ?? REVIEWS.default;

  if (!id || !PRODUCTS.some((p) => p.id === id)) {
    return (
      <div className="tm-container" style={{ padding: '80px 40px', textAlign: 'center' }}>
        <div className={styles.title}>Product not found</div>
        <Link to="/browse" className="tm-btn tm-btn-primary" style={{ display: 'inline-block', marginTop: 20, padding: '13px 24px', borderRadius: 99 }}>
          Back to gear
        </Link>
      </div>
    );
  }

  return (
    <div className="tm-container" style={{ padding: '32px 40px 80px' }}>
      <button onClick={() => navigate(-1)} className={styles.backBtn}>
        <Icon name="back" size={14} color="var(--tm-text-soft)" /> Back to gear
      </button>

      <div className="tm-pdp-grid">
        <div>
          <div className={styles.mainImage}>
            <img src={productImg(product.gallery[imgIdx] ?? product.img, 900, 900)} alt={product.name} />
            {product.tag && <div className={styles.pdpTag}>{product.tag}</div>}
          </div>
          {product.gallery.length > 1 && (
            <div className={styles.thumbRow}>
              {product.gallery.map((g, i) => (
                <button key={g + i} onClick={() => setImgIdx(i)} className={styles.thumb} data-active={i === imgIdx}>
                  <img src={productImg(g, 160, 160)} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className={styles.brand}>{product.brand}</div>
          <h1 className={styles.name}>{product.name}</h1>
          <div className={styles.metaRow}>
            <div className={styles.ratingRow}>
              <Icon name="star" size={14} color="var(--tm-accent)" />
              <span className={styles.ratingNum}>{product.rating}</span>
              <span className={styles.reviewCount}>({product.reviews} reviews)</span>
            </div>
            <div className={styles.dot} />
            <span className={styles.reviewCount}>Free shipping over $150</span>
          </div>

          <div className={styles.priceRow}>
            <span className={styles.price}>${product.price}</span>
            {product.old && (
              <>
                <span className={styles.oldPrice}>${product.old}</span>
                <span className={styles.savePill}>Save ${product.old - product.price}</span>
              </>
            )}
          </div>

          <p className={styles.blurb}>{product.blurb}</p>

          <div className={styles.optionBlock}>
            <div className={styles.optionHead}>
              <span>Color</span>
              <span className={styles.optionValue}>{color.name}</span>
            </div>
            <div className={styles.colorRow}>
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c)}
                  className={styles.colorSwatch}
                  data-active={color.name === c.name}
                  style={{ background: c.hex }}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>

          <div className={styles.optionBlock}>
            <div className={styles.optionHead}>
              <span>Size</span>
              <span className={styles.optionValue}>{product.cat === 'boots' ? 'US sizing' : ''}</span>
            </div>
            <div className={styles.sizeRow}>
              {product.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} className={styles.sizeBtn} data-active={size === s}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.ctaRow}>
            <button
              className={`tm-btn tm-btn-primary ${styles.addBtn}`}
              onClick={() => {
                addToCart(product, color.name, size, 1);
                setAdded(true);
                setTimeout(() => setAdded(false), 1600);
              }}
            >
              {added ? 'Added ✓' : 'Add to cart'} {!added && <Icon name="bag" size={16} color="var(--tm-primary-on)" />}
            </button>
            <button onClick={() => toggleWish(product.id)} aria-label="Save" className={styles.wishBtn}>
              <Icon name="heart" size={19} color={wished ? 'var(--tm-accent)' : 'var(--tm-text)'} fill={wished} />
            </button>
          </div>

          <div className={styles.specs}>
            <div className={styles.specsHead}>Specifications</div>
            {product.specs.map(([k, v], i) => (
              <div key={k} className={styles.specRow} style={{ borderTop: i === 0 ? 'none' : '0.5px solid var(--tm-line-c)' }}>
                <span className={styles.specKey}>{k}</span>
                <span className={styles.specValue}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.reviewSection}>
        <div className={styles.reviewHead}>
          <h2 className={styles.reviewTitle}>From the field</h2>
          <span className={styles.reviewCount}>{product.reviews} reviews</span>
        </div>
        <div className={styles.reviewList}>
          {reviews.map((r) => (
            <div key={r.quote} className={styles.reviewCard}>
              <div className={styles.reviewStars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} name="star" size={13} color={i < r.rating ? 'var(--tm-accent)' : 'var(--tm-line-c)'} />
                ))}
              </div>
              <div className={styles.reviewQuote}>"{r.quote}"</div>
              <div className={styles.reviewAuthor}>
                {r.author} · Verified purchase · {r.location}
              </div>
            </div>
          ))}
        </div>
      </div>

      {related.length > 0 && (
        <div className={styles.related}>
          <h2 className={styles.reviewTitle}>You may also like</h2>
          <div className="tm-product-grid" style={{ marginTop: 20 }}>
            {related.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
