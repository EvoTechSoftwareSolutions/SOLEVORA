import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

/* Import modularized routes */
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import ProfileRoutes from './routes/ProfileRoutes';

/* Authentication pages (centralized path) */
import { Login, Register, ForgotPassword, CheckEmail, ResetPassword, ResetSuccess } from "./pages/auth";
import Logout from "./pages/user/Logout";
import OrderConfirmation from "./pages/user/OrderConfirmation";
import NotFound from "./pages/user/NotFound";

import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import './App.css';

/**
 * App Component
 * The root entry point of the React application. 
 * Implements centralized and modular routing for Shopper, Admin, and Profile modules.
 */
function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
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

                {/* Authentication Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/check-email" element={<CheckEmail />} />
                <Route path="/reset-password/:token?" element={<ResetPassword />} />
                <Route path="/reset-success" element={<ResetSuccess />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />

                {/* Unknown paths: static 404 (avoid redirect loop with /home) */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </CartProvider>
        </WishlistProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;