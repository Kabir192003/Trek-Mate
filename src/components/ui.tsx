import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import s from './ui.module.css';
import { Icon, type IconName } from './Icon';
import { img } from '../data/img';
import { CLASSES } from '../lib/pack';
import { SYSTEMS } from '../data/systems';
import { pct, weight, type Units } from '../lib/format';
import type { SystemId } from '../data/types';

/* ── Image with fade-in and a reserved box (no layout shift) ── */
export function Img({
  id,
  w = 800,
  h,
  alt,
  ratio = '4 / 5',
  className,
  eager,
  sizes,
}: {
  id: string;
  w?: number;
  h?: number;
  alt: string;
  ratio?: string;
  className?: string;
  eager?: boolean;
  sizes?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const src = img(id, w, h);
  const srcSet = `${img(id, Math.round(w / 2), h ? Math.round(h / 2) : undefined)} ${Math.round(w / 2)}w, ${src} ${w}w`;
  return (
    <div className={`img-wrap ${className ?? ''}`} style={{ aspectRatio: ratio }}>
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes ?? '(max-width: 720px) 50vw, 25vw'}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={loaded ? 'is-loaded' : ''}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

/* ── Where a weight sits within a range (lightest → heaviest) ── */
export function WeightBar({ grams, min, max, label }: { grams: number; min: number; max: number; label?: string }) {
  const span = Math.max(1, max - min);
  const at = Math.min(100, Math.max(0, ((grams - min) / span) * 100));
  return (
    <div className={s.wbar} role="img" aria-label={label ?? `Weight position: ${Math.round(at)}% of the way from lightest to heaviest`}>
      <div className={s.wbarFill} style={{ width: `${Math.max(4, at)}%` }} />
    </div>
  );
}

/* ── Base weight class scale ── */
const SCALE_MAX = 12672;
export function ClassScale({ base, dark }: { base: number; dark?: boolean }) {
  const idx = CLASSES.findIndex((c) => base < c.max);
  const left = (Math.min(base, SCALE_MAX) / SCALE_MAX) * 100;
  return (
    <div className={`${s.scale} ${dark ? s.scaleOnDark : ''}`}>
      <div className={s.scaleTrack} aria-hidden>
        {CLASSES.map((c, i) => (
          <div key={c.id} className={s.scaleSeg} data-active={i === idx} />
        ))}
        <div className={s.scaleMarker} style={{ left: `${left}%` }} />
      </div>
      <div className={s.scaleLabels} aria-hidden>
        <span>SUL</span>
        <span>UL</span>
        <span>Lightweight</span>
        <span>Trad</span>
      </div>
    </div>
  );
}

/* ── Stacked breakdown by system ── */
export function StackedBar({
  bySystem,
  base,
  units,
  legend = true,
  compact,
}: {
  bySystem: Record<SystemId, number>;
  base: number;
  units: Units;
  legend?: boolean;
  compact?: boolean;
}) {
  const rows = SYSTEMS.filter((sy) => !sy.worn && bySystem[sy.id] > 0).sort((a, b) => bySystem[b.id] - bySystem[a.id]);
  return (
    <div>
      <div className={s.stack} role="img" aria-label="Base weight by system">
        {rows.map((r) => (
          <div key={r.id} className={s.stackSeg} style={{ flexGrow: bySystem[r.id], background: r.color }} title={`${r.name}: ${weight(bySystem[r.id], units)}`} />
        ))}
      </div>
      {legend && (
        <div className={s.legend} style={compact ? { gap: 6 } : undefined}>
          {rows.map((r) => (
            <div key={r.id} className={s.legendRow}>
              <span className={s.legendDot} style={{ background: r.color }} />
              <span>{r.name}</span>
              <span className="num">{weight(bySystem[r.id], units)}</span>
              <span className="num muted" style={{ textAlign: 'right' }}>
                {pct(bySystem[r.id], base)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Number stepper ── */
export function Stepper({
  value,
  min = 1,
  max = 9,
  step = 1,
  onChange,
  label,
  dark,
}: {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
  label: string;
  dark?: boolean;
}) {
  return (
    <div className={`${s.stepper} ${dark ? s.stepperDark : ''}`} role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(Math.max(min, value - step))} disabled={value <= min} aria-label={`Decrease ${label}`}>
        <Icon name="minus" size={16} />
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(Math.min(max, value + step))} disabled={value >= max} aria-label={`Increase ${label}`}>
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}

/* ── Segmented control ── */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
  dark,
}: {
  value: T;
  options: { value: T; label: ReactNode }[];
  onChange: (v: T) => void;
  label: string;
  dark?: boolean;
}) {
  return (
    <div className={`${s.seg} ${dark ? s.segDark : ''}`} role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ── Rating ── */
export function Rating({ value, count }: { value: number; count?: number }) {
  return (
    <span className={s.rating} aria-label={`Rated ${value} out of 5${count ? ` from ${count} reviews` : ''}`}>
      <Icon name="star" size={13} fill />
      {value.toFixed(1)}
      {count !== undefined && <span className="muted">({count.toLocaleString('en-US')})</span>}
    </span>
  );
}

/* ── Switch ── */
export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} className={s.switch} onClick={() => onChange(!checked)} />;
}

/* ── Colour swatches and size pickers ── */
export function Swatches({ colors, value, onChange }: { colors: { name: string; hex: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className={s.swatches} role="group" aria-label="Colour">
      {colors.map((c) => (
        <button key={c.name} type="button" className={s.swatch} style={{ background: c.hex }} aria-pressed={c.name === value} aria-label={c.name} title={c.name} onClick={() => onChange(c.name)} />
      ))}
    </div>
  );
}

export function Sizes({ sizes, value, onChange }: { sizes: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className={s.sizes} role="group" aria-label="Size">
      {sizes.map((z) => (
        <button key={z} type="button" className={s.size} aria-pressed={z === value} onClick={() => onChange(z)}>
          {z}
        </button>
      ))}
    </div>
  );
}

/* ── Empty state ── */
export function EmptyState({
  icon,
  title,
  body,
  actions,
}: {
  icon: IconName;
  title: string;
  body: string;
  actions?: { label: string; to: string; primary?: boolean }[];
}) {
  return (
    <div className={s.empty}>
      <div className={s.emptyIcon}>
        <Icon name={icon} size={24} />
      </div>
      <h2>{title}</h2>
      <p>{body}</p>
      {actions && (
        <div className={s.emptyActions}>
          {actions.map((a) => (
            <Link key={a.label} to={a.to} className={`btn ${a.primary ? 'btn-primary' : 'btn-secondary'}`}>
              {a.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
