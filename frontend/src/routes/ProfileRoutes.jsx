import React, { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';

// Layout
const ProfileLayout = lazy(() => import('../pages/profile/ProfileLayout'));

// Pages
const ProfileDashboard = lazy(() => import('../pages/profile/Dashboard'));
const MyOrders = lazy(() => import('../pages/profile/MyOrders'));
const Wishlist = lazy(() => import('../pages/profile/Wishlist'));
const AccountSettings = lazy(() => import('../pages/profile/AccountSettings'));
const Addresses = lazy(() => import('../pages/profile/Addresses'));
const AddAddress = lazy(() => import('../pages/profile/AddAddress'));
const EditAddress = lazy(() => import('../pages/profile/EditAddress'));

//ProfileRoutes

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('user') !== null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const ProfileRoutes = (
  <Route 
    path="/profile" 
    element={
      <PrivateRoute>
        <ProfileLayout />
      </PrivateRoute>
    }
  >
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<ProfileDashboard />} />
    <Route path="orders" element={<MyOrders />} />
    <Route path="wishlist" element={<Wishlist />} />
    <Route path="account" element={<AccountSettings />} />
    <Route path="addresses" element={<Addresses />} />
    <Route path="addresses/add" element={<AddAddress />} />
    <Route path="addresses/edit/:id" element={<EditAddress />} />
    {/* Optional: Add security/loyalty/support routes here */}
  </Route>
);

export default ProfileRoutes;
