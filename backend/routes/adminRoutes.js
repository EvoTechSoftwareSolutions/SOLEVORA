import express from 'express';
import {
    getDashboardStats,
    getAllCustomers,
    getAllOrders,
    deleteProduct,
    deleteUser,
    deleteOrder,
    getSystemSettings,
    updateSystemSettings,
    getAllAdminUsers,
    createAdminUser,
    updateAdminUser,
    deleteAdminUser
} from '../controllers/AdminController.js';
import { requireAdmin, requireStoreAccess } from '../middleware/roleMiddleware.js';

const router = express.Router();

// ── Shared: accessible by both admin and store_manager ──────────────────────
router.get('/stats',                requireStoreAccess, getDashboardStats);
router.get('/customers',            requireStoreAccess, getAllCustomers);
router.get('/orders',               requireStoreAccess, getAllOrders);
router.delete('/products/:id',      requireStoreAccess, deleteProduct);
router.delete('/orders/:id',        requireStoreAccess, deleteOrder);

// ── Admin Only: user/customer management and system settings ─────────────────
router.delete('/customers/:id',     requireAdmin, deleteUser);

// System Settings (admin only)
router.get('/settings',             requireAdmin, getSystemSettings);
router.put('/settings',             requireAdmin, updateSystemSettings);

// Admin User Management (admin only)
router.get('/admin-users',          requireAdmin, getAllAdminUsers);
router.post('/admin-users',         requireAdmin, createAdminUser);
router.put('/admin-users/:id',      requireAdmin, updateAdminUser);
router.delete('/admin-users/:id',   requireAdmin, deleteAdminUser);

export default router;
