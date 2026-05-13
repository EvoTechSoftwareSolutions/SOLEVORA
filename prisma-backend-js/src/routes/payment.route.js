import express from "express";
import {
  generatePaymentHash,
  handlePaymentNotification,
  getOrderFromPendingPayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

// Generate hash + store pending payment intent (no order created)
router.post("/hash", generatePaymentHash);

// PayHere server-to-server notification (creates the order on success)
router.post( "/notify",express.urlencoded({ extended: true }), handlePaymentNotification,);
 
  
 


// Frontend polls this after PayHere onCompleted to get the real order ID
router.get("/pending/:pendingId", getOrderFromPendingPayment);

export default router;
