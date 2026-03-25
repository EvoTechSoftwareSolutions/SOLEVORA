import express from 'express';
import { 
    getDashboardStats, 
    getAllCustomers, 
    getAllOrders, 
    deleteProduct, 
    deleteUser, 
    deleteOrder 
} from '../controllers/AdminController.js';

const router = express.Router();

router.get('/stats', getDashboardStats);
router.get('/customers', getAllCustomers);
router.get('/orders', getAllOrders);
router.delete('/products/:id', deleteProduct);
router.delete('/customers/:id', deleteUser);
router.delete('/orders/:id', deleteOrder);

export default router;
