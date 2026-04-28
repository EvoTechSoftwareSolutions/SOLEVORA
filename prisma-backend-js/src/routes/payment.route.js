import express from 'express';
import { generatePaymentHash, handlePaymentNotification, updateOrderStatus } from '../controllers/payment.controller.js';

const router = express.Router();

// Generate payment hash for PayHere
router.post('/hash', generatePaymentHash);

// Handle PayHere payment notifications
router.post('/notify', handlePaymentNotification);

// Update order status (for frontend callback)
router.put('/orders/:id/status', updateOrderStatus);

export default router;
