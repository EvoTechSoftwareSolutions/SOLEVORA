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
const Category = lazy(() => import('../pages/user/CategoryPage'));
const CategoryDetails = lazy(() => import('../pages/user/CategoryDetails'));
const Cart = lazy(() => import('../pages/user/Cart'));
const VerificationCode = lazy(() => import('../pages/user/VerificationCode'));
const OrderConfirmation = lazy(() => import('../pages/user/OrderConfirmation'));
const TrackOrder = lazy(() => import('../pages/user/TrackOrder'));
const PrivacyPolicyPage = lazy(() => import('../pages/user/PrivacyPolicyPage'));
const Terms = lazy(() => import('../pages/user/Terms'));
const FAQs = lazy(() => import('../pages/user/Faq'));
const Careers = lazy(() => import('../pages/user/Careers'));
const SizeGuide = lazy(() => import('../pages/user/SizeGuide'));
const Checkout = lazy(() => import('../pages/user/Checkout'));

/**
 * Pathless layout + absolute child paths so /home, /about, etc. match in React Router 7.
 * A single parent path="/" only matches the root segment and can fail for /home, which
 * previously fell through to App's "*" redirect and caused an infinite navigation loop.
 */
const UserRoutes = (
  <Route element={<UserLayout />}>
    <Route path="/" element={<Navigate to="/home" replace />} />
    <Route path="/home" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/product/:slug" element={<ProductDetail />} />
    <Route path="/category" element={<Category />} />
    <Route path="/categorypage" element={<Category />} />
    <Route path="/category-details" element={<CategoryDetails />} />
    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
    <Route path="/verify-code" element={<VerificationCode />} />
    <Route path="/order-success" element={<OrderConfirmation />} />
    <Route path="/track-order" element={<TrackOrder />} />
    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
    <Route path='/faqs' element={<FAQs />} />
    <Route path="/terms" element={<Terms />} />
    <Route path="/careers" element={<Careers />} />
    <Route path="/size-guide" element={<SizeGuide />} />
  </Route>
);

export default UserRoutes;
