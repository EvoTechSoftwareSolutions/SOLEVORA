import express from 'express';
import { createOrder, getOrderById, getOrdersByEmail, updateOrderStatus, getOrdersByUserId } from '../controllers/OrderController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/search', getOrdersByEmail);
router.get('/:id', getOrderById);
router.get('/user/:id', getOrdersByUserId);
router.put('/:id/status', updateOrderStatus);

export default router;
