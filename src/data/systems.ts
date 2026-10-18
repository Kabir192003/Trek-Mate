import type { CategoryId, Kind, SystemId } from './types';

export interface SystemMeta {
  id: SystemId;
  name: string;
  /** The catalogue category that sells this system. */
  cat: CategoryId;
  color: string;
  /** Usually worn rather than carried, so excluded from base weight. */
  worn?: boolean;
  kinds: Kind[];
  blurb: string;
}

export const SYSTEMS: SystemMeta[] = [
  { id: 'shelter', name: 'Shelter', cat: 'tents', color: 'var(--sys-shelter)', kinds: ['tent'], blurb: 'Tents and trekking-pole shelters' },
  { id: 'sleep', name: 'Sleep', cat: 'sleep', color: 'var(--sys-sleep)', kinds: ['sleeping-bag'], blurb: 'Bags rated for the night\'s low' },
  { id: 'carry', name: 'Carry', cat: 'backpacks', color: 'var(--sys-carry)', kinds: ['pack'], blurb: 'Packs sized for the trip' },
  { id: 'kitchen', name: 'Kitchen', cat: 'stoves', color: 'var(--sys-kitchen)', kinds: ['stove', 'cookware'], blurb: 'Stoves and cookware' },
  { id: 'water', name: 'Water', cat: 'bottles', color: 'var(--sys-water)', kinds: ['bottle', 'filter'], blurb: 'Carry and treatment' },
  { id: 'layers', name: 'Layers', cat: 'winter', color: 'var(--sys-layers)', kinds: ['shell', 'insulation', 'fleece', 'gloves'], blurb: 'Shell, warmth and hands' },
  { id: 'footwear', name: 'Footwear', cat: 'boots', color: 'var(--sys-footwear)', worn: true, kinds: ['boot'], blurb: 'Worn, not carried' },
  { id: 'optics', name: 'Optics', cat: 'optics', color: 'var(--sys-optics)', kinds: ['sunglasses', 'goggles', 'binoculars'], blurb: 'Eyes on the route' },
];

export const KIND_LABEL: Record<Kind, string> = {
  tent: 'Tent',
  'sleeping-bag': 'Sleeping bag',
  pack: 'Pack',
  stove: 'Stove',
  cookware: 'Cookware',
  bottle: 'Bottle',
  filter: 'Water filter',
  shell: 'Rain shell',
  insulation: 'Insulated jacket',
  fleece: 'Fleece',
  gloves: 'Gloves',
  boot: 'Boots',
  sunglasses: 'Sunglasses',
  goggles: 'Goggles',
  binoculars: 'Binoculars',
};

export function systemMeta(id: SystemId): SystemMeta {
  return SYSTEMS.find((s) => s.id === id) ?? SYSTEMS[0];
}

export function systemForCategory(cat: CategoryId): SystemMeta {
  return SYSTEMS.find((s) => s.cat === cat) ?? SYSTEMS[0];
}

export function systemForKind(kind: Kind): SystemMeta {
  return SYSTEMS.find((s) => s.kinds.includes(kind)) ?? SYSTEMS[0];
}
