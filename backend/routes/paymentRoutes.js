import express from 'express';
import PaymentController from '../controllers/PaymentController.js';

const router = express.Router();

router.post('/generate-hash', PaymentController.generatePaymentHash);
router.post('/notify', PaymentController.handlePaymentNotification);

export default router;
