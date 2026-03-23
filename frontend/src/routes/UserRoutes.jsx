import React, { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';

// Layout
const UserLayout = lazy(() => import('../layouts/UserLayout/UserLayout'));

// Pages
const Home = lazy(() => import('../pages/user/Home'));
const ProductDetail = lazy(() => import('../pages/user/ProductDetail'));
const Category = lazy(() => import('../pages/user/Category')); // Example added for completeness

//UserRoutes

const UserRoutes = (
  <Route path="/" element={<UserLayout />}>
    <Route index element={<Navigate to="/home" replace />} />
    <Route path="home" element={<Home />} />
    <Route path="product/:id" element={<ProductDetail />} />
    <Route path="category" element={<Category />} />
    {/* Add more shopper routes here: catalog, cart, checkout etc. */}
  </Route>
);

export default UserRoutes;