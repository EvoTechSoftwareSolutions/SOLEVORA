import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import AdminRoute from '../admin/AdminRoute';

// Layout
const AdminLayout  = lazy(() => import('../admin/AdminLayout'));
const AdminLogin   = lazy(() => import('../admin/AdminLogin'));

// Pages – accessible by both admin and store_manager
const Dashboard          = lazy(() => import('../admin/Dashboard'));
const ProductsManagement = lazy(() => import('../admin/ProductsManagement'));
const OrdersManagement   = lazy(() => import('../admin/OrdersManagement'));
const CustomerManagement = lazy(() => import('../admin/CustomerManagement'));
const Analytics          = lazy(() => import('../admin/Analytics'));
const Messages           = lazy(() => import('../admin/Messages'));
const NewsletterManagement = lazy(() => import('../admin/NewsletterManagement'));

// Pages – admin only
const Settings = lazy(() => import('../admin/Settings'));

const AdminRoutes = [
    /* Stand-alone admin login page (no layout shell) */
    <Route key="admin-login" path="/admin-login" element={<AdminLogin />} />,

    /* Protected admin shell */
    <Route
        key="admin-shell"
        path="/admin"
        element={
            <AdminRoute>
                <AdminLayout />
            </AdminRoute>
        }
    >
        <Route index                element={<Dashboard />} />
        <Route path="products"      element={<ProductsManagement />} />
        <Route path="orders"        element={<OrdersManagement />} />
        <Route path="customers"     element={<CustomerManagement />} />
        <Route path="analytics"     element={<Analytics />} />
        <Route path="messages"      element={<Messages />} />
        <Route path="newsletter"    element={<NewsletterManagement />} />

        {/* Admin-only: settings page */}
        <Route
            path="settings"
            element={
                <AdminRoute adminOnly>
                    <Settings />
                </AdminRoute>
            }
        />
    </Route>
];

export default AdminRoutes;
