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

              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/check-email" element={<CheckEmail />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/logout" element={<Logout />} />

              {/* Default Route: Redirect to Home or a 404 Page */}
            </Routes>
          </Suspense>
        </CartProvider>
      </WishlistProvider>
    </BrowserRouter>
  );
}

export default App;