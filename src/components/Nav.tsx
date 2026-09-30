import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from './Icon';
import { LogoMark } from './LogoMark';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { CATEGORIES } from '../data/products';
import styles from './Nav.module.css';

export function Nav() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { itemCount } = useCart();
  const { wishlist } = useWishlist();
  const [q, setQ] = useState(params.get('q') ?? '');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setQ(params.get('q') ?? '');
  }, [params]);

  useEffect(() => {
    setMobileOpen(false);
  }, [navigate]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate(q ? `/browse?q=${encodeURIComponent(q)}` : '/browse');
  }

  return (
    <header className={styles.header}>
      <div className={`tm-container ${styles.bar}`}>
        <Link to="/" className={styles.logo}>
          <LogoMark />
          Trek Mate
        </Link>

        <nav className={`${styles.links} tm-nav-links`}>
          <Link to="/" className={`tm-navlink ${styles.link}`}>
            Home
          </Link>
          <Link to="/browse" className={`tm-navlink ${styles.link}`}>
            Shop
          </Link>
          <Link to="/wishlist" className={`tm-navlink ${styles.link}`}>
            Saved gear
          </Link>
        </nav>

        <form onSubmit={submitSearch} className={styles.search}>
          <Icon name="search" size={16} color="var(--tm-text-mute)" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tents, boots, packs…"
            aria-label="Search products"
          />
        </form>

        <div className={styles.actions}>
          <Link to="/wishlist" aria-label="Saved gear" className={styles.iconBtn}>
            <Icon name="heart" size={19} color="var(--tm-text)" />
            {wishlist.length > 0 && <span className={styles.badge}>{wishlist.length}</span>}
          </Link>
          <Link to="/cart" aria-label="Cart" className={styles.iconBtn}>
            <Icon name="bag" size={19} color="var(--tm-text)" />
            {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
          </Link>
          <Link to="/profile" aria-label="Profile" className={styles.iconBtn}>
            <Icon name="user" size={19} color="var(--tm-text)" />
          </Link>
          <button
            className={`${styles.iconBtn} ${styles.menuBtn}`}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <Icon name={mobileOpen ? 'close' : 'menu'} size={20} color="var(--tm-text)" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          <form onSubmit={submitSearch} className={styles.mobileSearch}>
            <Icon name="search" size={16} color="var(--tm-text-mute)" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search gear…" aria-label="Search products" />
          </form>
          <Link to="/" onClick={() => setMobileOpen(false)}>
            Home
          </Link>
          <Link to="/browse" onClick={() => setMobileOpen(false)}>
            Shop
          </Link>
          <Link to="/wishlist" onClick={() => setMobileOpen(false)}>
            Saved gear
          </Link>
          <Link to="/profile" onClick={() => setMobileOpen(false)}>
            Profile
          </Link>
          <div className={styles.mobileCats}>
            {CATEGORIES.map((c) => (
              <Link key={c.id} to={`/browse?cat=${c.id}`} onClick={() => setMobileOpen(false)}>
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
