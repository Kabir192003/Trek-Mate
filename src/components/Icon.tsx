// One consistent icon family: 24px grid, 1.7 stroke, round joins.
const PATHS = {
  home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  bag: (
    <>
      <path d="M5 8h14l-1 12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  back: <path d="m15 18-6-6 6-6" />,
  chevR: <path d="m9 18 6-6-6-6" />,
  chevD: <path d="m6 9 6 6 6-6" />,
  chevU: <path d="m18 15-6-6-6 6" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  sliders: (
    <>
      <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="10" cy="12" r="2" />
      <circle cx="18" cy="18" r="2" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18M7 15h4" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  bell: (
    <>
      <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" />
      <path d="M10 20.5a2 2 0 0 0 4 0" />
    </>
  ),
  package: (
    <>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
    </>
  ),
  arrowR: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowUR: <path d="M7 17 17 7M9 7h8v8" />,
  edit: <path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />,
  trash: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  leaf: <path d="M5 19C5 10 10 5 20 4c0 10-5 15-14 15zM5 19l8-8" />,
  scale: (
    <>
      <path d="M12 4v16M6 20h12M5 8h14" />
      <path d="m5 8-3 6a3 3 0 0 0 6 0zM19 8l-3 6a3 3 0 0 0 6 0z" />
    </>
  ),
  shield: <path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z" />,
  tent: <path d="M3 20 12 4l9 16zM12 4v16M8.5 20 12 13l3.5 7" />,
  sleep: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="7" />
      <path d="M8 8h8M4.5 14h15" />
    </>
  ),
  pack: (
    <>
      <path d="M7 7a5 5 0 0 1 10 0v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z" />
      <path d="M10 3h4M9 13h6v4H9z" />
    </>
  ),
  flame: <path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-4 2.5-5 .3 1.5 1 2.5 2 2.5 0-3 .5-5 .5-7.5z" />,
  drop: <path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11z" />,
  layers: <path d="M8 3 4 6v5l2 1v9h12v-9l2-1V6l-4-3c-1 1.5-2.4 2.2-4 2.2S9 4.5 8 3z" />,
  boot: <path d="M6 3h6v8l6 3a3 3 0 0 1 3 3v3H4v-6c1-1 2-2 2-4z" />,
  glasses: (
    <>
      <circle cx="6.5" cy="14" r="3.5" />
      <circle cx="17.5" cy="14" r="3.5" />
      <path d="M10 14h4M3 13l2-6M21 13l-2-6" />
    </>
  ),
  swap: <path d="M7 7h12l-3-3M17 17H5l3 3" />,
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" />
      <rect x="13" y="4" width="7" height="7" />
      <rect x="4" y="13" width="7" height="7" />
      <rect x="13" y="13" width="7" height="7" />
    </>
  ),
  list: <path d="M9 6h11M9 12h11M9 18h11M4 6h1M4 12h1M4 18h1" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5v.5" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4 2.8 19.5h18.4z" />
      <path d="M12 10v4.5M12 17v.5" />
    </>
  ),
  dot: <circle cx="12" cy="12" r="3" />,
  mountain: <path d="m2 20 7-12 4 6 3-4 6 10zM9 8l2 3" />,
  route: (
    <>
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="1.5" />
      <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
    </>
  ),
  hanger: <path d="M12 8a2 2 0 1 0-2-2M12 8v1.5L3 16a1.5 1.5 0 0 0 1 2.5h16a1.5 1.5 0 0 0 1-2.5l-9-6.5" />,
  chart: <path d="M4 4v16h16M8 15l3-4 3 2 5-6" />,
  thermo: (
    <>
      <path d="M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0z" />
      <path d="M12 9v7" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />,
  undo: <path d="M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3" />,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="1.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  return: <path d="M4 9h11a5 5 0 0 1 0 10h-4M4 9l4-4M4 9l4 4" />,
  ruler: <path d="m3 16 13-13 5 5L8 21zM7 12l2 2M10 9l2 2M13 6l2 2" />,
} as const;

export type IconName = keyof typeof PATHS;

interface IconProps {
  name: IconName;
  size?: number;
  stroke?: number;
  fill?: boolean;
  className?: string;
  title?: string;
}

export function Icon({ name, size = 20, stroke = 1.7, fill = false, className, title }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={fill ? 0 : stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title && <title>{title}</title>}
      {PATHS[name]}
    </svg>
  );
}

export const SYSTEM_ICON: Record<string, IconName> = {
  shelter: 'tent',
  sleep: 'sleep',
  carry: 'pack',
  kitchen: 'flame',
  water: 'drop',
  layers: 'layers',
  footwear: 'boot',
  optics: 'glasses',
};
