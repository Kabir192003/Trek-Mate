import { useCallback, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import s from './Nav.module.css';
import { Icon } from './Icon';
import { LogoMark } from './LogoMark';
import { Drawer } from './Drawer';
import { SearchPalette } from './SearchPalette';
import { usePack } from '../context/PackContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useProfile } from '../context/ProfileContext';
import { usePrefs } from '../context/PrefsContext';
import { useTween } from '../hooks/useTween';
import { readout } from '../lib/format';
import { weightClass } from '../lib/pack';

const LINKS = [
  { to: '/shop', label: 'Shop' },
  { to: '/pack', label: 'Pack Planner' },
  { to: '/makers', label: 'Makers' },
];

export function PackChip({ onNavigate }: { onNavigate?: () => void }) {
  const { totals } = usePack();
  const { units } = usePrefs();
  const shown = useTween(totals.base);
  const r = readout(shown, units);
  const { cls } = weightClass(totals.base);
  return (
    <Link to="/pack" className={s.packChip} onClick={onNavigate} aria-label={`Your pack: base weight ${readout(totals.base, units).value} ${r.unit}, ${cls.name}. Open the Pack Planner.`}>
      <Icon name="scale" size={16} />
      <span className={s.packLabel}>Pack</span>
      <span className={`num ${s.packValue}`}>
        {r.value}
        <small>{r.unit}</small>
      </span>
      <span className={s.packClass} data-cls={cls.id}>
        {cls.short}
      </span>
    </Link>
  );
}

export function Nav() {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const { count } = useCart();
  const { ids } = useWishlist();
  const { profile } = useProfile();
  const initials = profile.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest?.('input, textarea, select, [contenteditable]');
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        setSearch(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const closeSearch = useCallback(() => setSearch(false), []);
  const closeMenu = useCallback(() => setMenu(false), []);

  return (
    <header className={s.nav}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className={`container ${s.inner}`}>
        <Link to="/" className={s.brand} aria-label="Trek Mate home">
          <LogoMark size={28} />
          <span>Trek Mate</span>
        </Link>

        <nav aria-label="Primary" className={s.links}>
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `${s.link} ${isActive ? s.active : ''}`}>
              {l.label}
              {l.to === '/pack' && <span className={s.new}>New</span>}
            </NavLink>
          ))}
        </nav>

        <button type="button" className={s.searchTrigger} onClick={() => setSearch(true)} aria-label="Search">
          <Icon name="search" size={18} />
          <span className={s.searchText}>Search gear, makers, routes</span>
          <kbd>⌘K</kbd>
        </button>

        <div className={s.right}>
          <div className={s.packWrap}>
            <PackChip />
          </div>
          <Link to="/saved" className={`icon-btn ${s.hideSm}`} aria-label={`Saved gear, ${ids.length} items`}>
            <Icon name="heart" />
            {ids.length > 0 && <span className="badge">{ids.length}</span>}
          </Link>
          <Link to="/cart" className="icon-btn" aria-label={`Cart, ${count} items`}>
            <Icon name="bag" />
            {count > 0 && <span className="badge">{count}</span>}
          </Link>
          <Link to="/account" className={`${s.avatar} ${s.hideSm}`} aria-label="Your account, Base Camp">
            {initials}
          </Link>
          <button type="button" className={`icon-btn ${s.menuBtn}`} onClick={() => setMenu(true)} aria-label="Open menu">
            <Icon name="menu" />
          </button>
        </div>
      </div>

      <Drawer open={menu} onClose={closeMenu} title="Menu" side="right">
        <div className={s.mobileStack}>
          <PackChip onNavigate={closeMenu} />
          <button type="button" className={`btn btn-secondary btn-block ${s.mobileSearch}`} onClick={() => { setMenu(false); setSearch(true); }}>
            <Icon name="search" size={18} /> Search gear
          </button>
          <nav aria-label="Mobile" className={s.mobileLinks}>
            {[...LINKS, { to: '/saved', label: `Saved gear (${ids.length})` }, { to: '/cart', label: `Cart (${count})` }, { to: '/account', label: 'Base Camp' }].map((l) => (
              <NavLink key={l.to} to={l.to} onClick={closeMenu} className={({ isActive }) => (isActive ? s.mobileActive : '')}>
                {l.label}
                <Icon name="chevR" size={18} />
              </NavLink>
            ))}
          </nav>
        </div>
      </Drawer>
      {search && <SearchPalette open onClose={closeSearch} />}
    </header>
  );
}
