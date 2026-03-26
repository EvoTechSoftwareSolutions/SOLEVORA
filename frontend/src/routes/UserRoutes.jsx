import React, { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';


// Layout
const UserLayout = lazy(() => import('../layouts/UserLayout/UserLayout'));

// Pages
const Home = lazy(() => import('../pages/user/Home'));
const About = lazy(() => import('../pages/user/AboutUs'));
const Contact = lazy(() => import('../pages/user/Contact'));
const ProductDetail = lazy(() => import('../pages/user/ProductDetail'));
const Category = lazy(() => import('../pages/user/Category'));
const Cart = lazy(() => import('../pages/user/Cart'));
const ShippingInformation = lazy(() => import('../pages/user/ShippingInformation'));
const SizeChart = lazy(() => import('../pages/user/SizeChart'));
const ShippingMethod = lazy(() => import('../pages/user/ShippingMethod'));
const PaymentDetails = lazy(() => import('../pages/user/PaymentDetails'));
const VerificationCode = lazy(() => import('../pages/user/VerificationCode'));
const OrderConfirmation = lazy(() => import('../pages/user/OrderConfirmation'));
const TrackOrder = lazy(() => import('../pages/user/TrackOrder'));

//UserRoutes

const UserRoutes = (
  <Route path="/" element={<UserLayout />}>
    <Route index element={<Navigate to="/home" replace />} />
    <Route path="home" element={<Home />} />
    <Route path="about" element={<About />} />
    <Route path="contact" element={<Contact />} />
    <Route path="product/:id" element={<ProductDetail />} />
    <Route path="category" element={<Category />} />
    <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
    <Route path="shipping" element={<ProtectedRoute><ShippingInformation /></ProtectedRoute>} />
    <Route path="size-chart" element={<SizeChart />} />
    <Route path="shipping-method" element={<ShippingMethod />} />
    <Route path="payment" element={<PaymentDetails />} />
    <Route path="verify-code" element={<VerificationCode />} />
    <Route path="order-success" element={<OrderConfirmation />} />
    <Route path="track-order" element={<TrackOrder />} />
  </Route>
);

export default UserRoutes;