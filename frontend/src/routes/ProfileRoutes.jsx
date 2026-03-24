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
const AddAddress = lazy(() => import('../profile/AddAddress'));
const EditAddress = lazy(() => import('../profile/EditAddress'));

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
