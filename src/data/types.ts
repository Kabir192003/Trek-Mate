export type CategoryId =
  | 'tents'
  | 'boots'
  | 'backpacks'
  | 'sleep'
  | 'stoves'
  | 'bottles'
  | 'winter'
  | 'optics';

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

export interface Product {
  id: string;
  name: string;
  brand: string;
  cat: CategoryId;
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
  weightGrams?: number;
}

export interface Review {
  quote: string;
  author: string;
  location: string;
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

export interface Order {
  id: string;
  date: string;
  itemCount: number;
  status: 'In transit' | 'Delivered' | 'Processing';
  total: number;
}
