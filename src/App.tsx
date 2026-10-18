import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Pack } from './pages/Pack';
import { Makers } from './pages/Makers';
import { Saved } from './pages/Saved';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { Account } from './pages/Account';
import { NotFound } from './pages/NotFound';

const TITLES: Record<string, string> = {
  '/': 'Carry less. Know exactly why.',
  '/shop': 'Shop gear',
  '/pack': 'Pack Planner',
  '/makers': 'The makers',
  '/saved': 'Saved gear',
  '/cart': 'Cart',
  '/checkout': 'Checkout',
  '/account': 'Base Camp',
};

function RouteEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
    const key = Object.keys(TITLES).find((k) => (k === '/' ? pathname === '/' : pathname.startsWith(k)));
    document.title = `${key ? TITLES[key] : 'Trek Mate'} · Trek Mate`;
  }, [pathname, hash]);
  return null;
}

function App() {
  const { pathname } = useLocation();
  const minimal = pathname === '/checkout';

  return (
    <>
      <RouteEffects />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/pack" element={<Pack />} />
        <Route path="/makers" element={<Makers />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/:id" element={<OrderConfirmation />} />
        <Route path="/account" element={<Account />} />
        {/* Old paths from the first version keep working */}
        <Route path="/browse" element={<Navigate to="/shop" replace />} />
        <Route path="/wishlist" element={<Navigate to="/saved" replace />} />
        <Route path="/profile" element={<Navigate to="/account" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!minimal && <Footer />}
      <Toast />
    </>
  );
}

export default App;
