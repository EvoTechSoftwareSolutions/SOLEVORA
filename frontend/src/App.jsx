import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

/* Import modularized routes */
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import ProfileRoutes from './routes/ProfileRoutes';

/* Import new authentication routes from feature/thilina */
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import CheckEmail from "./pages/CheckEmail";
import ResetPassword from "./pages/ResetPassword";
import Logout from "./pages/Logout";
import ResetSuccess from "./pages/ResetSuccess";
import OrderConfirmation from "./pages/user/OrderConfirmation";

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
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/check-email" element={<CheckEmail />} />
                <Route path="/reset-password/:token?" element={<ResetPassword />} />
                <Route path="/reset-success" element={<ResetSuccess />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />

                {/* Default Route: Redirect to Home or a 404 Page */}
              </Routes>
            </Suspense>
          </CartProvider>
        </WishlistProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;