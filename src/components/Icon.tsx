export type IconName =
  | 'home'
  | 'compass'
  | 'bag'
  | 'heart'
  | 'user'
  | 'search'
  | 'back'
  | 'close'
  | 'plus'
  | 'minus'
  | 'check'
  | 'star'
  | 'filter'
  | 'truck'
  | 'card'
  | 'pin'
  | 'bell'
  | 'chevR'
  | 'package'
  | 'arrowR'
  | 'edit'
  | 'trash'
  | 'menu'
  | 'leaf'
  | 'scale'
  | 'shield';

interface IconProps {
  size?: number;
  color?: string;
  fill?: boolean;
  className?: string;
}

export function Icon({ name, size = 22, color = 'currentColor', fill = false, className }: IconProps & { name: IconName }) {
  const sw = fill ? 0 : 1.7;
  const fillColor = fill ? color : 'none';
  switch (name) {
    case 'home':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fillColor} stroke={color} strokeWidth={sw || 1.7} strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M3 11.5L12 4l9 7.5V20a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1v-8.5z" />
        </svg>
      );
    case 'compass':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="9" />
          <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" fill={fill ? color : 'none'} />
        </svg>
      );
    case 'bag':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M5 8h14l-1 12.5a1 1 0 01-1 .9H7a1 1 0 01-1-.9L5 8z" fill={fill ? color : 'none'} />
          <path d="M9 8V6a3 3 0 016 0v2" />
        </svg>
      );
    case 'heart':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? color : 'none'} stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 20s-7-4.5-9.5-9A4.5 4.5 0 0112 6.5 4.5 4.5 0 0121.5 11c-2.5 4.5-9.5 9-9.5 9z" />
        </svg>
      );
    case 'user':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="8" r="4" fill={fill ? color : 'none'} />
          <path d="M3 21c1-5 5-7 9-7s8 2 9 7" />
        </svg>
      );
    case 'search':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      );
    case 'back':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M15 19l-7-7 7-7" />
        </svg>
      );
    case 'close':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M5 5l14 14M19 5L5 19" />
        </svg>
      );
    case 'plus':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" className={className}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case 'minus':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" className={className}>
          <path d="M5 12h14" />
        </svg>
      );
    case 'check':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M4 12l5 5L20 6" />
        </svg>
      );
    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
          <path d="M12 2l3 6.5 7 1-5 4.8 1.2 7L12 18l-6.2 3.3L7 14.3 2 9.5l7-1L12 2z" />
        </svg>
      );
    case 'filter':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" className={className}>
          <path d="M4 6h16M7 12h10M10 18h4" />
        </svg>
      );
    case 'truck':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M2 7h11v10H2zM13 11h5l3 3v3h-8z" />
          <circle cx="7" cy="18.5" r="1.7" />
          <circle cx="17.5" cy="18.5" r="1.7" />
        </svg>
      );
    case 'card':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <rect x="2" y="6" width="20" height="13" rx="2" />
          <path d="M2 11h20M6 15h3" />
        </svg>
      );
    case 'pin':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 22s8-7.5 8-13a8 8 0 10-16 0c0 5.5 8 13 8 13z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
      );
    case 'bell':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M6 9a6 6 0 1112 0c0 5 2 7 2 7H4s2-2 2-7z" />
          <path d="M10 20a2 2 0 004 0" />
        </svg>
      );
    case 'chevR':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M9 5l7 7-7 7" />
        </svg>
      );
    case 'package':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M3 7l9-4 9 4v10l-9 4-9-4V7z" />
          <path d="M3 7l9 4 9-4M12 11v10" />
        </svg>
      );
    case 'arrowR':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      );
    case 'edit':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      );
    case 'trash':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z" />
        </svg>
      );
    case 'menu':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" className={className}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case 'leaf':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M5 21c0-9 5-15 14-16-1 9-7 14-16 16z" />
          <path d="M8 18c3-3 6-6 9-11" />
        </svg>
      );
    case 'scale':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 3v18M5 7l-3 6a3 3 0 006 0l-3-6zM19 7l-3 6a3 3 0 006 0l-3-6zM5 7h14M8 21h8" />
        </svg>
      );
    case 'shield':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    default:
      return null;
  }
}

export function TopoSvg({ color = 'rgba(255,255,255,0.12)', style = {} }: { color?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 400 280"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...style }}
      aria-hidden="true"
    >
      <g fill="none" stroke={color} strokeWidth="1">
        <path d="M-20,180 Q60,120 150,160 T350,140 T440,170" />
        <path d="M-20,200 Q70,150 160,180 T360,165 T440,190" />
        <path d="M-20,220 Q80,180 170,200 T370,195 T440,215" />
        <path d="M-20,240 Q90,210 180,225 T380,222 T440,240" />
        <path d="M-20,80 Q90,30 200,70 T420,60" />
        <path d="M-20,100 Q100,60 210,95 T430,90" />
        <path d="M-20,120 Q110,85 220,115 T440,115" />
      </g>
    </svg>
  );
}
