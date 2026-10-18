export type CategoryId =
  | 'tents'
  | 'boots'
  | 'backpacks'
  | 'sleep'
  | 'stoves'
  | 'bottles'
  | 'winter'
  | 'optics';

/** Pack systems: how gear is grouped when you plan a pack. */
export type SystemId = 'shelter' | 'sleep' | 'carry' | 'kitchen' | 'water' | 'layers' | 'footwear' | 'optics';

/** Like-for-like kinds, so swaps never compare a glove with a jacket. */
export type Kind =
  | 'tent'
  | 'sleeping-bag'
  | 'pack'
  | 'stove'
  | 'cookware'
  | 'bottle'
  | 'filter'
  | 'shell'
  | 'insulation'
  | 'fleece'
  | 'gloves'
  | 'boot'
  | 'sunglasses'
  | 'goggles'
  | 'binoculars';

export interface Category {
  id: CategoryId;
  name: string;
  blurb: string;
  img: string;
}

export interface Collection {
  id: string;
  name: string;
  subtitle: string;
  img: string;
  tag: string;
  categoryFilter?: CategoryId;
}

export interface ColorOption {
  name: string;
  hex: string;
}

export interface FieldTest {
  /** Days the item spent on trail with testers. */
  days: number;
  testers: number;
  routes: string[];
  note: string;
}

export interface ProductAttrs {
  capacity?: number; // tents: people
  tempF?: number; // sleeping bags: comfort-limit rating in °F
  volumeL?: number; // packs
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  makerId: string;
  cat: CategoryId;
  kind: Kind;
  price: number;
  old?: number;
  rating: number;
  reviews: number;
  img: string;
  gallery: string[];
  colors: ColorOption[];
  sizes: string[];
  blurb: string;
  specs: [string, string][];
  tag?: 'Bestseller' | 'New' | "Editor's Pick" | 'Limited';
  /** What the maker quotes. */
  listedGrams: number;
  /** What it weighed on our scale at intake. The number every plan uses. */
  measuredGrams: number;
  /** Packed volume in litres, where it is meaningful. */
  packedL?: number;
  /** Usually worn rather than carried (boots, sunglasses). */
  wornByDefault?: boolean;
  attrs: ProductAttrs;
  fieldTest: FieldTest;
}

export interface Maker {
  id: string;
  name: string;
  place: string;
  founded: number;
  team: number;
  makes: string;
  story: string;
  quote: string;
  img: string;
}

export interface Review {
  productId: string;
  quote: string;
  author: string;
  location: string;
  trip: string;
  rating: number;
}

export interface CartItem extends Product {
  color: string;
  size: string;
  qty: number;
}

export interface Address {
  id: string;
  label: string;
  name: string;
  line: string;
  city: string;
  isDefault?: boolean;
}

export interface PaymentMethod {
  id: string;
  kind: 'card' | 'paypal';
  label: string;
  sub: string;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'In transit' | 'Delivered';

export interface OrderLine {
  productId: string;
  name: string;
  qty: number;
  price: number;
  color?: string;
  size?: string;
}

export interface Order {
  id: string;
  date: string; // ISO date
  itemCount: number;
  status: OrderStatus;
  total: number;
  lines?: OrderLine[];
  shipTo?: string;
  method?: string;
  tracking?: string;
}

/* ── Pack planner ─────────────────────────────────────────── */

export type Season = 'summer' | 'three-season' | 'winter';

export interface Trip {
  name: string;
  nights: number;
  people: number;
  season: Season;
  /** Expected overnight low, °F. */
  lowF: number;
}

export interface PackItem {
  uid: string;
  source: 'catalogue' | 'own';
  productId?: string;
  name: string;
  brand?: string;
  system: SystemId;
  kind: Kind;
  grams: number;
  qty: number;
  worn: boolean;
  owned: boolean;
  inPack: boolean;
  attrs?: ProductAttrs;
}

export interface WeightPoint {
  t: string; // ISO timestamp
  base: number; // grams
}
