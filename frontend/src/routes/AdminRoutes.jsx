import React, { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';

// Layout
const AdminLayout = lazy(() => import('../admin/AdminLayout'));

// Pages
const Dashboard = lazy(() => import('../admin/Dashboard'));
const ProductsManagement = lazy(() => import('../admin/ProductsManagement'));
const OrdersManagement = lazy(() => import('../admin/OrdersManagement'));
const CustomerManagement = lazy(() => import('../admin/CustomerManagement'));
const Analytics = lazy(() => import('../admin/Analytics'));

//AdminRoutes

const AdminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="products" element={<ProductsManagement />} />
    <Route path="orders" element={<OrdersManagement />} />
    <Route path="customers" element={<CustomerManagement />} />
    <Route path="analytics" element={<Analytics />} />
  </Route>
);

export default AdminRoutes;
