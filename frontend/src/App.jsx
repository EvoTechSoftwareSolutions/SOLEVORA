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

/* Profile Pages */
import MyOrders from './profile/MyOrders';
import Wishlist from './profile/Wishlist';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Dashboard Routes */}
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductsManagement />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Navigate to="/" />} />
        </Route>

        {/* User Profile Routes */}
        <Route path="/profile" element={<ProfileLayout />}>
          <Route index element={<Navigate to="orders" />} />
          <Route path="orders" element={<MyOrders />} />
          {/* Add place-holders for other profile pages to keep navigation working */}
          <Route path="dashboard" element={<div style={{ padding: '40px' }}><h2>User Dashboard Coming Soon</h2></div>} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="account" element={<div style={{ padding: '40px' }}><h2>Account Settings Coming Soon</h2></div>} />
          <Route path="addresses" element={<div style={{ padding: '40px' }}><h2>Your Addresses Coming Soon</h2></div>} />
        </Route>

        {/* Default Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
