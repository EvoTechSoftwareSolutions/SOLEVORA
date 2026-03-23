import React, { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';

// Layout
const ProfileLayout = lazy(() => import('../profile/ProfileLayout'));

// Pages
const ProfileDashboard = lazy(() => import('../profile/Dashboard'));
const MyOrders = lazy(() => import('../profile/MyOrders'));
const Wishlist = lazy(() => import('../profile/Wishlist'));
const AccountSettings = lazy(() => import('../profile/AccountSettings'));
const Addresses = lazy(() => import('../profile/Addresses'));

//ProfileRoutes

const ProfileRoutes = (
  <Route path="/profile" element={<ProfileLayout />}>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<ProfileDashboard />} />
    <Route path="orders" element={<MyOrders />} />
    <Route path="wishlist" element={<Wishlist />} />
    <Route path="account" element={<AccountSettings />} />
    <Route path="addresses" element={<Addresses />} />
    {/* Optional: Add security/loyalty/support routes here */}
  </Route>
);

export default ProfileRoutes;
