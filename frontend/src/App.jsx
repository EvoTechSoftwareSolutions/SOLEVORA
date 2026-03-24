<<<<<<< HEAD
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

/* Import modularized routes */
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import ProfileRoutes from './routes/ProfileRoutes';

import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import './App.css';
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import CheckEmail from "./pages/CheckEmail";
import ResetPassword from "./pages/ResetPassword";
>>>>>>> 794c2b409b66fa3ce90662479322780842b0eef6

/**
 * App Component
 * The root entry point of the React application. 
 * Implements centralized and modular routing for Shopper, Admin, and Profile modules.
 */
function App() {
  return (
    <BrowserRouter>
<<<<<<< HEAD
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
=======
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
>>>>>>> 794c2b409b66fa3ce90662479322780842b0eef6
    </BrowserRouter>
  );
}

export default App;