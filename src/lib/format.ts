export type Units = 'metric' | 'imperial';

export const G_PER_OZ = 28.3495;
export const G_PER_LB = 453.592;
const MINUS = '−';

export function money(n: number, cents = false): string {
  const v = Math.abs(n);
  const s = v.toLocaleString('en-US', {
    minimumFractionDigits: cents ? 2 : v % 1 === 0 ? 0 : 2,
    maximumFractionDigits: cents ? 2 : v % 1 === 0 ? 0 : 2,
  });
  return `${n < 0 ? MINUS : ''}$${s}`;
}

/** Compact weight for lists and cards. */
export function weight(g: number, units: Units): string {
  if (units === 'imperial') {
    const oz = g / G_PER_OZ;
    if (oz < 16) return `${oz.toFixed(1)} oz`;
    const lb = Math.floor(oz / 16);
    const rem = oz - lb * 16;
    return `${lb} lb ${rem.toFixed(1)} oz`;
  }
  if (g < 1000) return `${Math.round(g).toLocaleString('en-US')} g`;
  return `${(g / 1000).toFixed(2)} kg`;
}

/** Large readout: value and unit separately, so the unit can be set smaller. */
export function readout(g: number, units: Units): { value: string; unit: string } {
  if (units === 'imperial') return { value: (g / G_PER_LB).toFixed(2), unit: 'lb' };
  if (g < 1000) return { value: Math.round(g).toString(), unit: 'g' };
  return { value: (g / 1000).toFixed(2), unit: 'kg' };
}

/** Signed difference, with a true minus sign. */
export function delta(g: number, units: Units): string {
  if (Math.round(g) === 0) return `±0 ${units === 'imperial' ? 'oz' : 'g'}`;
  const sign = g < 0 ? MINUS : '+';
  return `${sign}${weight(Math.abs(g), units)}`;
}

/** Cost per unit of weight saved: dollars per 100 g, or per ounce. */
export function perWeight(cost: number, savedGrams: number, units: Units): string {
  if (savedGrams <= 0) return '–';
  if (cost <= 0) return 'Free';
  if (units === 'imperial') return `${money(cost / (savedGrams / G_PER_OZ), true)}/oz`;
  return `${money(cost / (savedGrams / 100), true)}/100 g`;
}

export function perWeightLabel(units: Units): string {
  return units === 'imperial' ? 'per oz saved' : 'per 100 g saved';
}

export function tempF(f: number): string {
  return `${f}°F`;
}

export function tempC(f: number): string {
  return `${Math.round(((f - 32) * 5) / 9)}°C`;
}

export function dateShort(iso: string): string {
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function dateDay(iso: string): string {
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function plural(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}

export function pct(part: number, whole: number): number {
  return whole > 0 ? Math.round((part / whole) * 100) : 0;
}
