import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './styles/global.css';
import App from './App.tsx';
import { ToastProvider } from './context/ToastContext';
import { PrefsProvider } from './context/PrefsContext';
import { ProfileProvider } from './context/ProfileContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { PackProvider } from './context/PackContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <ToastProvider>
        <PrefsProvider>
          <ProfileProvider>
            <WishlistProvider>
              <CartProvider>
                <PackProvider>
                  <App />
                </PackProvider>
              </CartProvider>
            </WishlistProvider>
          </ProfileProvider>
        </PrefsProvider>
      </ToastProvider>
    </HashRouter>
  </StrictMode>,
);
