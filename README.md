# Trek Mate

Field-tested outdoor gear, scored on weight, durability, and pack volume instead of marketing copy.

**[Live site →](https://kabir192003.github.io/Trek-Mate/)**

## What this is

Most outdoor retailers bury the specs that actually matter — weight, durability, pack volume — under lifestyle photography and marketing copy. Trek Mate leads with them: every product page puts the spec sheet front and center, gear is organized by category with real inventory counts, and the whole experience is built around helping someone decide what to carry, not just what to buy.

A full storefront: browse by category or search, filter/sort, product detail pages with variant selection, a cart with free-shipping progress, a 3-step checkout, a wishlist, and a fully editable user profile (account details, saved addresses, payment methods, order history, notification preferences) — all persisted locally so the app is stateful across visits without needing a backend.

## Stack

- **React 19 + TypeScript**, built with **Vite**
- **React Router** (hash routing, so it deploys cleanly to GitHub Pages with no server config)
- Plain CSS with CSS custom properties for theming (no framework) + CSS Modules per component
- App state (cart, wishlist, profile, addresses, payment methods, notification settings) lives in React Context and persists to `localStorage`
- Deployed via GitHub Actions → GitHub Pages on every push to `main`

## Running locally

```bash
npm install
npm run dev
```

```bash
npm run build    # production build to dist/
npm run preview  # preview the production build locally
```

## Project structure

```
src/
  components/   Nav, Footer, ProductCard, Icon set, Toast — shared UI
  context/      Cart, Wishlist, Profile, Toast — app state + localStorage persistence
  data/         product catalog, categories, collections, design tokens
  pages/        Home, Browse, ProductDetail, Cart, Checkout, Wishlist, Profile, NotFound
  styles/       theme.css — design tokens and shared layout classes
```

## Notes

This app has no backend — cart, wishlist, profile edits, and orders are held in `localStorage`. Checkout is a simulated flow (no real payment processing). Product photography is sourced from Unsplash for demonstration purposes.

Originally scoped from a design handoff bundle; rebuilt from scratch as a production React app with real routing, an expanded/corrected product catalog, and a fully editable profile rather than the read-only prototype it started from.
