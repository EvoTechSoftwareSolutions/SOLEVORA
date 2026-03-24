import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

/* Import modularized routes */
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import ProfileRoutes from './routes/ProfileRoutes';

import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import './App.css';

/**
 * App Component
 * The root entry point of the React application. 
 * Implements centralized and modular routing for Shopper, Admin, and Profile modules.
 */
function App() {
  return (
    <BrowserRouter>
      <WishlistProvider>
        <CartProvider>
          <Suspense fallback={<div className="global-loader">Loading...</div>}>
        <Routes>
          {/* User Facing Module (Shopper Pages) */}
          {UserRoutes}

          {/* Admin Dashboard Module (Back-office Management) */}
          {AdminRoutes}

          {/* User Profile Module (Authenticated Customer Dashboard) */}
          {ProfileRoutes}

          {/* Default Route: Redirect to Home or a 404 Page */}
        </Routes>
      </Suspense>
      </CartProvider>
      </WishlistProvider>
    </BrowserRouter>
  );
}

export default App;
