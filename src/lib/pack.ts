// Pack Planner logic. Pure functions only, so every number the UI shows can be
// traced back to one place.
import { PRODUCTS, getProduct } from '../data/products';
import { KIND_LABEL, SYSTEMS, systemForCategory } from '../data/systems';
import type { Kind, PackItem, Product, Season, SystemId, Trip } from '../data/types';

/* ── Weight classes ───────────────────────────────────────── */
// Community conventions for base weight: super ultralight under 5 lb,
// ultralight under 10 lb, lightweight under 20 lb.
export const CLASSES = [
  { id: 'sul', name: 'Super ultralight', short: 'SUL', max: 2268 },
  { id: 'ul', name: 'Ultralight', short: 'UL', max: 4536 },
  { id: 'lw', name: 'Lightweight', short: 'LW', max: 9072 },
  { id: 'trad', name: 'Traditional', short: 'TRAD', max: Number.POSITIVE_INFINITY },
] as const;

export type WeightClass = (typeof CLASSES)[number];

export function weightClass(base: number): { cls: WeightClass; next: { name: string; toGo: number } | null } {
  const idx = CLASSES.findIndex((c) => base < c.max);
  const cls = CLASSES[idx];
  const lighter = idx > 0 ? CLASSES[idx - 1] : null;
  return { cls, next: lighter ? { name: lighter.name, toGo: base - lighter.max + 1 } : null };
}

/* ── Totals ───────────────────────────────────────────────── */

export function lineGrams(i: PackItem): number {
  return i.grams * i.qty;
}

export interface Totals {
  base: number;
  worn: number;
  total: number;
  count: number;
  bySystem: Record<SystemId, number>;
}

export function totals(items: PackItem[]): Totals {
  const bySystem = Object.fromEntries(SYSTEMS.map((s) => [s.id, 0])) as Record<SystemId, number>;
  let base = 0;
  let worn = 0;
  let count = 0;
  for (const i of items) {
    if (!i.inPack) continue;
    count += i.qty;
    const g = lineGrams(i);
    if (i.worn) worn += g;
    else {
      base += g;
      bySystem[i.system] += g;
    }
  }
  return { base, worn, total: base + worn, count, bySystem };
}

/* ── Trip rules ───────────────────────────────────────────── */

export const SEASON_LABEL: Record<Season, string> = {
  summer: 'Summer',
  'three-season': '3-season',
  winter: 'Winter',
};

export const SEASON_DEFAULT_LOW: Record<Season, number> = {
  summer: 45,
  'three-season': 30,
  winter: 10,
};

/** Smallest sensible pack volume for the trip length. */
export function minVolumeL(nights: number): number {
  if (nights <= 1) return 30;
  if (nights <= 4) return 40;
  return 50;
}

/* ── Swaps ────────────────────────────────────────────────── */

export interface Swap {
  item: PackItem;
  product: Product;
  /** Grams removed from the pack (positive). */
  saves: number;
  /** What the swap costs you, based on what you already own. */
  cost: number;
  /** Cost per gram saved; 0 when the swap is free or saves money. */
  perGram: number;
  reason: string;
}

export function fits(p: Product, trip: Trip): boolean {
  if (p.kind === 'tent') return (p.attrs.capacity ?? 1) >= trip.people;
  if (p.kind === 'sleeping-bag') return (p.attrs.tempF ?? 99) <= trip.lowF;
  if (p.kind === 'pack') return (p.attrs.volumeL ?? 0) >= minVolumeL(trip.nights);
  return true;
}

function fitReason(p: Product, trip: Trip): string {
  if (p.kind === 'tent') return `Sleeps ${p.attrs.capacity}, trip has ${trip.people}`;
  if (p.kind === 'sleeping-bag') return `Rated ${p.attrs.tempF}°F, trip low ${trip.lowF}°F`;
  if (p.kind === 'pack') return `${p.attrs.volumeL} L, enough for ${trip.nights} night${trip.nights === 1 ? '' : 's'}`;
  return `Like-for-like ${KIND_LABEL[p.kind].toLowerCase()}`;
}

export function swapsFor(item: PackItem, trip: Trip): Swap[] {
  const current = item.productId ? getProduct(item.productId) : undefined;
  const ownsIt = item.owned || item.source === 'own';
  return PRODUCTS.filter((p) => p.kind === item.kind && p.id !== item.productId && p.measuredGrams < item.grams && fits(p, trip))
    .map((p) => {
      const saves = (item.grams - p.measuredGrams) * item.qty;
      const cost = (ownsIt || !current ? p.price : p.price - current.price) * item.qty;
      const perGram = cost <= 0 ? 0 : cost / saves;
      return { item, product: p, saves, cost, perGram, reason: fitReason(p, trip) };
    })
    .sort((a, b) => a.perGram - b.perGram || b.saves - a.saves);
}

/** The single best-value swap for each carried item, best value first. */
export function bestSwaps(items: PackItem[], trip: Trip): Swap[] {
  const out: Swap[] = [];
  for (const i of items) {
    if (!i.inPack || i.worn) continue;
    const s = swapsFor(i, trip)[0];
    if (s) out.push(s);
  }
  return out.sort((a, b) => a.perGram - b.perGram || b.saves - a.saves);
}

/* ── Readiness checks ─────────────────────────────────────── */

export type CheckStatus = 'ok' | 'warn' | 'missing' | 'optional';

export interface Check {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
  shop?: SystemId;
  productId?: string;
}

export function tripChecks(items: PackItem[], trip: Trip): Check[] {
  const packed = items.filter((i) => i.inPack);
  const ofKind = (...k: Kind[]) => packed.filter((i) => k.includes(i.kind));
  const checks: Check[] = [];

  const tents = ofKind('tent');
  if (!tents.length) checks.push({ id: 'shelter', label: 'Shelter', status: 'missing', detail: 'No shelter in the pack yet.', shop: 'shelter' });
  else {
    const cap = Math.max(...tents.map((t) => t.attrs?.capacity ?? trip.people));
    checks.push(
      cap < trip.people
        ? { id: 'shelter', label: 'Shelter', status: 'warn', detail: `Sleeps ${cap}, but the trip has ${trip.people}.`, shop: 'shelter' }
        : { id: 'shelter', label: 'Shelter', status: 'ok', detail: `${tents[0].name}, sleeps ${cap}.` },
    );
  }

  const bags = ofKind('sleeping-bag');
  if (!bags.length) checks.push({ id: 'sleep', label: 'Sleep', status: 'missing', detail: 'No sleeping bag yet.', shop: 'sleep' });
  else {
    const rated = bags.filter((b) => b.attrs?.tempF !== undefined);
    if (!rated.length) checks.push({ id: 'sleep', label: 'Sleep', status: 'ok', detail: 'Check your bag is rated for the night\'s low.' });
    else {
      const warmest = Math.min(...rated.map((b) => b.attrs!.tempF!));
      checks.push(
        warmest > trip.lowF
          ? { id: 'sleep', label: 'Sleep', status: 'warn', detail: `Rated ${warmest}°F, but the low is ${trip.lowF}°F.`, shop: 'sleep' }
          : { id: 'sleep', label: 'Sleep', status: 'ok', detail: `Rated ${warmest}°F for a ${trip.lowF}°F low.` },
      );
    }
  }

  const packs = ofKind('pack');
  const need = minVolumeL(trip.nights);
  if (!packs.length) checks.push({ id: 'carry', label: 'Carry', status: 'missing', detail: 'No pack to carry it all in.', shop: 'carry' });
  else {
    const vol = Math.max(...packs.map((p) => p.attrs?.volumeL ?? need));
    checks.push(
      vol < need
        ? { id: 'carry', label: 'Carry', status: 'warn', detail: `${vol} L is tight for ${trip.nights} nights; ${need} L or more is easier.`, shop: 'carry' }
        : { id: 'carry', label: 'Carry', status: 'ok', detail: `${vol} L for ${trip.nights} night${trip.nights === 1 ? '' : 's'}.` },
    );
  }

  const carriers = ofKind('bottle', 'filter');
  checks.push(
    carriers.length
      ? { id: 'water', label: 'Water', status: 'ok', detail: `${carriers.reduce((n, c) => n + c.qty, 0)} to carry it in.` }
      : { id: 'water', label: 'Water', status: 'missing', detail: 'Nothing to carry water in.', shop: 'water' },
  );
  if (trip.nights >= 1) {
    checks.push(
      ofKind('filter').length
        ? { id: 'treat', label: 'Treatment', status: 'ok', detail: 'Filter packed.' }
        : { id: 'treat', label: 'Treatment', status: 'warn', detail: 'No water treatment. Worth it on any overnight.', productId: 'p19' },
    );
  }

  const shells = ofKind('shell');
  if (!shells.length) {
    checks.push(
      trip.season === 'summer'
        ? { id: 'shell', label: 'Rain shell', status: 'optional', detail: 'Optional in summer if the forecast is dry.', shop: 'layers' }
        : { id: 'shell', label: 'Rain shell', status: 'missing', detail: 'No rain shell for a shoulder-season trip.', shop: 'layers' },
    );
  } else checks.push({ id: 'shell', label: 'Rain shell', status: 'ok', detail: shells[0].name + '.' });

  const warm = ofKind('insulation', 'fleece');
  const puffy = ofKind('insulation');
  if (trip.season === 'winter') {
    checks.push(
      puffy.length
        ? { id: 'warm', label: 'Warm layer', status: 'ok', detail: `${puffy[0].name}.` }
        : warm.length
          ? { id: 'warm', label: 'Warm layer', status: 'warn', detail: `Fleece alone is thin for a ${trip.lowF}°F camp.`, shop: 'layers' }
          : { id: 'warm', label: 'Warm layer', status: 'missing', detail: 'No insulation for a winter camp.', shop: 'layers' },
    );
    checks.push(
      ofKind('gloves').length
        ? { id: 'gloves', label: 'Gloves', status: 'ok', detail: 'Packed.' }
        : { id: 'gloves', label: 'Gloves', status: 'warn', detail: 'Cold hands end winter trips early.', productId: 'p8' },
    );
    checks.push(
      ofKind('sunglasses', 'goggles').length
        ? { id: 'eyes', label: 'Eyes', status: 'ok', detail: 'Glare covered.' }
        : { id: 'eyes', label: 'Eyes', status: 'warn', detail: 'Snow glare needs category 3 lenses or goggles.', shop: 'optics' },
    );
  } else {
    checks.push(
      warm.length
        ? { id: 'warm', label: 'Warm layer', status: 'ok', detail: `${warm[0].name}.` }
        : {
            id: 'warm',
            label: 'Warm layer',
            status: trip.season === 'summer' ? 'optional' : 'warn',
            detail: trip.season === 'summer' ? 'Optional for warm nights.' : 'Nights near freezing call for a warm layer.',
            shop: 'layers',
          },
    );
  }

  checks.push(
    ofKind('stove', 'cookware').length
      ? { id: 'kitchen', label: 'Kitchen', status: 'ok', detail: `${ofKind('stove', 'cookware').length} item${ofKind('stove', 'cookware').length === 1 ? '' : 's'}.` }
      : { id: 'kitchen', label: 'Kitchen', status: 'optional', detail: 'Optional. Cold-soaking works on short trips.', shop: 'kitchen' },
  );

  return checks;
}

export function readiness(checks: Check[]) {
  return {
    ok: checks.filter((c) => c.status === 'ok').length,
    warn: checks.filter((c) => c.status === 'warn').length,
    missing: checks.filter((c) => c.status === 'missing').length,
    total: checks.filter((c) => c.status !== 'optional').length,
  };
}

/* ── Items ────────────────────────────────────────────────── */

export function newUid(): string {
  return `pi_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export function itemFromProduct(p: Product, owned = false): PackItem {
  return {
    uid: newUid(),
    source: 'catalogue',
    productId: p.id,
    name: p.name,
    brand: p.brand,
    system: systemForCategory(p.cat).id,
    kind: p.kind,
    grams: p.measuredGrams,
    qty: 1,
    worn: !!p.wornByDefault,
    owned,
    inPack: true,
    attrs: { ...p.attrs },
  };
}

export function toBuy(items: PackItem[]): PackItem[] {
  return items.filter((i) => i.inPack && i.source === 'catalogue' && !i.owned);
}

export function packedProductIds(items: PackItem[]): Set<string> {
  return new Set(items.filter((i) => i.inPack && i.productId).map((i) => i.productId!));
}

/** The heaviest carried item in a system: what a new product there would replace. */
export function incumbent(items: PackItem[], system: SystemId, kind?: Kind): PackItem | undefined {
  return items
    .filter((i) => i.inPack && i.system === system && (!kind || i.kind === kind))
    .sort((a, b) => b.grams - a.grams)[0];
}

/** Lightest and heaviest measured weight among like-for-like products. */
export function kindRange(p: Product): [number, number] | null {
  const peers = PRODUCTS.filter((x) => x.kind === p.kind).map((x) => x.measuredGrams);
  if (peers.length < 2) return null;
  return [Math.min(...peers), Math.max(...peers)];
}

/* ── Sample pack ──────────────────────────────────────────── */

export const SAMPLE_TRIP: Trip = { name: 'Three Sisters loop', nights: 3, people: 1, season: 'three-season', lowF: 30 };

export function samplePack(): PackItem[] {
  const own = (name: string, system: SystemId, kind: Kind, grams: number, attrs?: PackItem['attrs']): PackItem => ({
    uid: newUid(),
    source: 'own',
    name,
    system,
    kind,
    grams,
    qty: 1,
    worn: false,
    owned: true,
    inPack: true,
    attrs,
  });
  const cat = (id: string, owned = true): PackItem => itemFromProduct(getProduct(id)!, owned);
  return [
    own('Old 2P dome tent', 'shelter', 'tent', 2350, { capacity: 2 }),
    cat('p15'),
    cat('p3'),
    own('Canister stove', 'kitchen', 'stove', 210),
    own('Steel pot, 1 L', 'kitchen', 'cookware', 430),
    cat('p6'),
    cat('p22'),
    own('Rain jacket (2019)', 'layers', 'shell', 640),
    cat('p2'),
    cat('p23'),
  ];
}
