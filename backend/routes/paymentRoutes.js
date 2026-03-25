import express from 'express';
import { generatePaymentHash, handlePaymentNotification } from '../controllers/PaymentController.js';

const router = express.Router();

router.post('/hash', generatePaymentHash);
router.post('/notify', handlePaymentNotification);

export default router;
