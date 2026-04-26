import express from 'express';
import {
    getDashboardStats,
    getAllCustomers,
    getAllOrders,
    deleteUser,
    deleteOrder,
    getSystemSettings,
    updateSystemSettings,
    getAllAdminUsers,
    createAdminUser,
    updateAdminUser,
    deleteAdminUser
} from '../controllers/AdminController.js';
import { getAllSubscribers, deleteSubscriber } from '../controllers/newsletterController.js';
import { getContacts, getUnreadCount, markAsRead } from '../controllers/contactController.js';
import { requireAdmin, requireStoreAccess } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Dashboard
router.get('/stats', requireStoreAccess, getDashboardStats);

// Customers
router.get('/customers', requireStoreAccess, getAllCustomers);
router.delete('/customers/:id', requireAdmin, deleteUser);

// Orders
router.get('/orders', requireStoreAccess, getAllOrders);
router.delete('/orders/:id', requireAdmin, deleteOrder);

// System Settings
router.get('/settings', requireAdmin, getSystemSettings);
router.put('/settings', requireAdmin, updateSystemSettings);

// Staff Management
router.get('/admin-users', requireAdmin, getAllAdminUsers);
router.post('/admin-users', requireAdmin, createAdminUser);
router.put('/admin-users/:id', requireAdmin, updateAdminUser);
router.delete('/admin-users/:id', requireAdmin, deleteAdminUser);

// Subscribers
router.get('/subscribers', requireStoreAccess, getAllSubscribers);
router.delete('/subscribers/:id', requireAdmin, deleteSubscriber);

// Contact Messages
router.get('/contacts', requireStoreAccess, getContacts);
router.get('/contacts/unread-count', requireStoreAccess, getUnreadCount);
router.put('/contacts/:id/read', requireStoreAccess, markAsRead);

export default router;
