import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './Overlay.module.css';
import { Icon, SYSTEM_ICON } from './Icon';
import { img } from '../data/img';
import { searchAll } from '../lib/search';
import { money, weight } from '../lib/format';
import { usePrefs } from '../context/PrefsContext';

interface Row {
  key: string;
  group: string;
  label: string;
  meta: string;
  to: string;
  thumb?: string;
  icon?: Parameters<typeof Icon>[0]['name'];
}

const QUICK: Row[] = [
  { key: 'q-pack', group: 'Jump to', label: 'Pack Planner', meta: 'Your base weight and swaps', to: '/pack', icon: 'scale' },
  { key: 'q-light', group: 'Jump to', label: 'Lightest gear first', meta: 'Shop sorted by weight', to: '/shop?sort=light', icon: 'leaf' },
  { key: 'q-makers', group: 'Jump to', label: 'The makers', meta: 'Seven independent workshops', to: '/makers', icon: 'people' },
  { key: 'q-orders', group: 'Jump to', label: 'Your orders', meta: 'Track deliveries', to: '/account?tab=orders', icon: 'truck' },
];

export function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { units } = usePrefs();

  const rows = useMemo<Row[]>(() => {
    if (!q.trim()) return QUICK;
    const r = searchAll(q);
    return [
      ...r.products.map((p) => ({
        key: p.id,
        group: 'Gear',
        label: p.name,
        meta: `${p.brand} · ${weight(p.measuredGrams, units)} · ${money(p.price)}`,
        to: `/product/${p.id}`,
        thumb: p.img,
      })),
      ...r.systems.map((sy) => ({ key: sy.id, group: 'Systems', label: sy.name, meta: sy.blurb, to: `/shop?sys=${sy.id}`, icon: SYSTEM_ICON[sy.id] })),
      ...r.makers.map((m) => ({ key: m.id, group: 'Makers', label: m.name, meta: `${m.place} · ${m.makes}`, to: `/shop?maker=${m.id}`, icon: 'people' as const })),
      { key: 'all', group: 'Search', label: `See all results for "${q}"`, meta: 'Open in the shop', to: `/shop?q=${encodeURIComponent(q)}`, icon: 'search' as const },
    ];
  }, [q, units]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => input.current?.focus(), 20);
    document.body.style.overflow = 'hidden';
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const go = (r: Row) => {
    onClose();
    navigate(r.to);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(rows.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Enter' && rows[active]) go(rows[active]);
  };

  return (
    <div className={s.root} role="dialog" aria-modal="true" aria-label="Search">
      <div className={s.backdrop} onClick={onClose} />
      <div className={s.palette} onKeyDown={onKey}>
        <div className={s.paletteInput}>
          <Icon name="search" size={20} />
          <input
            ref={input}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            placeholder="Search gear, makers or systems"
            aria-label="Search"
            aria-controls="palette-results"
            aria-activedescendant={rows[active] ? `pr-${rows[active].key}` : undefined}
          />
          <kbd className={s.kbd}>Esc</kbd>
        </div>
        <ul id="palette-results" role="listbox" className={s.results}>
          {rows.map((r, i) => {
            const head = i === 0 || rows[i - 1].group !== r.group ? r.group : null;
            return (
              <li key={r.key} role="presentation">
                {head && <div className={s.group}>{head}</div>}
                <button
                  type="button"
                  id={`pr-${r.key}`}
                  role="option"
                  aria-selected={i === active}
                  className={s.result}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(r)}
                >
                  {r.thumb ? (
                    <img src={img(r.thumb, 96, 96)} alt="" className={s.thumb} />
                  ) : (
                    <span className={s.resultIcon}>{r.icon && <Icon name={r.icon} size={18} />}</span>
                  )}
                  <span className={s.resultText}>
                    <span className={s.resultLabel}>{r.label}</span>
                    <span className={s.resultMeta}>{r.meta}</span>
                  </span>
                  <Icon name="arrowR" size={16} className={s.resultArrow} />
                </button>
              </li>
            );
          })}
          {q.trim() && rows.length === 1 && <li className={s.noResults}>No gear matches "{q}". Try a maker, a system like "shelter", or a route.</li>}
        </ul>
        <div className={s.paletteFoot}>
          <span>
            <kbd className={s.kbd}>↑</kbd> <kbd className={s.kbd}>↓</kbd> to move
          </span>
          <span>
            <kbd className={s.kbd}>Enter</kbd> to open
          </span>
        </div>
      </div>
    </div>
  );
}
