import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/products';
import styles from './Footer.module.css';

export function Footer() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <footer className={styles.footer}>
      <div className={`tm-container tm-footer-grid ${styles.grid}`}>
        <div>
          <div className={styles.brand}>Trek Mate</div>
          <p className={styles.blurb}>
            Field-tested gear from independent makers, scored on weight, durability, and pack volume — so you spend
            less time guessing and more time on trail.
          </p>
        </div>
        <div>
          <div className={styles.heading}>Shop</div>
          <div className={styles.linkList}>
            {CATEGORIES.slice(0, 6).map((c) => (
              <Link key={c.id} to={`/browse?cat=${c.id}`}>
                {c.name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className={styles.heading}>Support</div>
          <div className={styles.linkList}>
            <span>Shipping &amp; returns</span>
            <span>Size guides</span>
            <span>Contact us</span>
          </div>
        </div>
        <div>
          <div className={styles.heading}>Field notes</div>
          <p className={styles.newsletterCopy}>Trail dispatches and gear reviews, once a month.</p>
          {sent ? (
            <div className={styles.subscribed}>Subscribed — welcome aboard.</div>
          ) : (
            <form
              className={styles.newsletterForm}
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setSent(true);
              }}
            >
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="you@email.com"
                aria-label="Email address"
              />
              <button type="submit" className="tm-btn">
                Join
              </button>
            </form>
          )}
        </div>
      </div>
      <div className={`tm-container ${styles.bottomBar}`}>
        <span>© 2026 Trek Mate. All rights reserved.</span>
        <span>Portland, OR</span>
      </div>
    </footer>
  );
}
