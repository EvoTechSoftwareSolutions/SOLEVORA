import express from 'express';
import { createOrder, getOrderById, getOrdersByEmail, updateOrderStatus } from '../controllers/OrderController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/search', getOrdersByEmail);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);

export default router;
