import s from './RangeSlider.module.css';

interface Props {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
  label: string;
  format: (n: number) => string;
  /** Optional distribution drawn behind the track (counts per bucket). */
  histogram?: number[];
}

/** Two native range inputs on one track: keyboard and screen-reader friendly. */
export function RangeSlider({ min, max, step = 1, value, onChange, label, format, histogram }: Props) {
  const [lo, hi] = value;
  const span = Math.max(1, max - min);
  const loPct = ((lo - min) / span) * 100;
  const hiPct = ((hi - min) / span) * 100;
  const peak = histogram ? Math.max(1, ...histogram) : 1;

  return (
    <div className={s.wrap}>
      {histogram && (
        <div className={s.hist} aria-hidden>
          {histogram.map((c, i) => {
            const at = ((i + 0.5) / histogram.length) * 100;
            const active = at >= loPct && at <= hiPct;
            return <span key={i} style={{ height: `${Math.max(c ? 14 : 4, (c / peak) * 100)}%` }} data-active={active} />;
          })}
        </div>
      )}
      <div className={s.track}>
        <div className={s.fill} style={{ left: `${loPct}%`, right: `${100 - hiPct}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={lo}
          aria-label={`${label} minimum`}
          aria-valuetext={format(lo)}
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi - step), hi])}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={hi}
          aria-label={`${label} maximum`}
          aria-valuetext={format(hi)}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo + step)])}
        />
      </div>
      <div className={s.values}>
        <span className="num">{format(lo)}</span>
        <span className="num">{format(hi)}</span>
      </div>
    </div>
  );
}
