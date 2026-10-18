export function LogoMark({ size = 26, onDark = false }: { size?: number; onDark?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 10 L50 46 L41 46 L32 28 L23 46 L14 46 Z" fill={onDark ? '#F3F1EB' : '#1B3A2A'} />
      <path d="M32 24 L38 36 L34 36 L32 32 L30 36 L26 36 Z" fill="#D9541E" />
    </svg>
  );
}
