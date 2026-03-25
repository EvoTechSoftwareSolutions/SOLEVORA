import express from 'express';
import { createOrder, getOrderById, getOrdersByEmail } from '../controllers/OrderController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/search', getOrdersByEmail);
router.get('/:id', getOrderById);

export default router;
