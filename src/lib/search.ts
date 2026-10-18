import { PRODUCTS } from '../data/products';
import { MAKERS } from '../data/makers';
import { KIND_LABEL, SYSTEMS, systemForCategory } from '../data/systems';
import type { Maker, Product } from '../data/types';
import type { SystemMeta } from '../data/systems';

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]+/g, ' ');

function score(haystack: { text: string; weight: number }[], q: string): number {
  const terms = norm(q).split(' ').filter(Boolean);
  if (!terms.length) return 0;
  let total = 0;
  for (const term of terms) {
    let best = 0;
    for (const h of haystack) {
      const t = norm(h.text);
      if (t.startsWith(term)) best = Math.max(best, h.weight * 3);
      else if (t.includes(` ${term}`)) best = Math.max(best, h.weight * 2);
      else if (t.includes(term)) best = Math.max(best, h.weight);
    }
    if (!best) return 0; // every term must match somewhere
    total += best;
  }
  return total;
}

export function productScore(p: Product, q: string): number {
  return score(
    [
      { text: p.name, weight: 5 },
      { text: p.brand, weight: 3 },
      { text: KIND_LABEL[p.kind], weight: 3 },
      { text: systemForCategory(p.cat).name, weight: 2 },
      { text: p.blurb, weight: 1 },
      { text: p.fieldTest.routes.join(' '), weight: 1 },
    ],
    q,
  );
}

export function searchProducts(q: string, pool: Product[] = PRODUCTS): Product[] {
  if (!q.trim()) return pool;
  return pool
    .map((p) => ({ p, s: productScore(p, q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.p);
}

export interface SearchResults {
  products: Product[];
  makers: Maker[];
  systems: SystemMeta[];
}

export function searchAll(q: string): SearchResults {
  if (!q.trim()) return { products: [], makers: [], systems: [] };
  return {
    products: searchProducts(q).slice(0, 6),
    makers: MAKERS.filter((m) => score([{ text: m.name, weight: 3 }, { text: m.makes, weight: 1 }, { text: m.place, weight: 1 }], q) > 0).slice(0, 3),
    systems: SYSTEMS.filter((s) => score([{ text: s.name, weight: 3 }, { text: s.blurb, weight: 1 }], q) > 0).slice(0, 3),
  };
}
