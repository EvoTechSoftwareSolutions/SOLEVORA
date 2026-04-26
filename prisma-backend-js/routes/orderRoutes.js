import express from 'express';
import { createOrder, getOrderById, getOrdersByUserId, getOrdersByEmail, updateOrderStatus } from '../controllers/OrderController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/email', getOrdersByEmail);
router.get('/user/:id', getOrdersByUserId);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);

export default router;
