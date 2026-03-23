import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

/* Import layout shells */
import AdminLayout from './admin/AdminLayout';
import ProfileLayout from './profile/ProfileLayout';

/* Admin Pages */
import Dashboard from './admin/Dashboard';
import ProductsManagement from './admin/ProductsManagement';
import OrdersManagement from './admin/OrdersManagement';
import CustomerManagement from './admin/CustomerManagement';
import Analytics from './admin/Analytics';

/* User Pages */
import Home from './pages/user/Home';

/* Profile Pages */
import MyOrders from './profile/MyOrders';
import ProfileDashboard from './profile/Dashboard';
import Wishlist from './profile/Wishlist';
import AccountSettings from './profile/AccountSettings';
import Addresses from './profile/Addresses';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User Home Page */}
        <Route path="/home" element={<Home />} />

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Navigate to="/admin" />} />
        </Route>

        {/* User Profile Routes */}
        <Route path="/profile" element={<ProfileLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<ProfileDashboard />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="account" element={<AccountSettings />} />
          <Route path="addresses" element={<Addresses />} />
        </Route>

        {/* Default: redirect to Home */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
