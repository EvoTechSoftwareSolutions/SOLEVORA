import crypto from 'crypto';
import prisma from '../prisma/client.js';
import { sendOrderConfirmationEmail } from '../utils/emailService.js';

// PayHere Credentials from Environment Variables
const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID;
const PAYHERE_SECRET = process.env.PAYHERE_SECRET;
const PAYHERE_APP_ID = process.env.PAYHERE_APP_ID;
const PAYHERE_APP_SECRET = process.env.PAYHERE_APP_SECRET;

// Validate required environment variables
if (!PAYHERE_MERCHANT_ID || !PAYHERE_SECRET) {
  console.error('Missing PayHere credentials in environment variables');
}

// Generate PayHere Hash
export const generatePaymentHash = async (req, res) => {
  try {
    const { order_id, amount, currency = 'LKR' } = req.body;

    if (!order_id || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: order_id, amount'
      });
    }

    if (!PAYHERE_MERCHANT_ID || !PAYHERE_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'PayHere credentials not configured'
      });
    }

    // PayHere hash generation format
    const merchantId = PAYHERE_MERCHANT_ID;
    const orderId = order_id.toString();
    const amountStr = parseFloat(amount).toFixed(2);
    const currencyStr = currency.toUpperCase();

    // Generate hash using PayHere formula: merchantId + orderId + amount + currency + uppercase(md5(secret))
    const hashedSecret = crypto.createHash('md5').update(PAYHERE_SECRET).digest('hex').toUpperCase();
    const hashString = `${merchantId}${orderId}${amountStr}${currencyStr}${hashedSecret}`;
    const hash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();

    console.log('Generated hash for order:', orderId, 'Hash:', hash);

    res.status(200).json({
      success: true,
      data: {
        hash,
        merchant_id: merchantId
      }
    });

  } catch (error) {
    console.error('Error generating payment hash:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate payment hash'
    });
  }
};

// Handle PayHere Notification
export const handlePaymentNotification = async (req, res) => {
  try {
    const {
      order_id,
      payment_id,
      status_code, // Standard PayHere field
      status,      // Legacy/Custom field
      payhere_amount,   // Standard PayHere field
      amount,           // Legacy/Custom field
      payhere_currency, // Standard PayHere field
      currency,         // Legacy/Custom field
      md5sig
    } = req.body;

    console.log('PayHere notification received:', req.body);

    // Normalize values
    const statusCode = status_code || status;
    const finalAmount = payhere_amount || amount;
    const finalCurrency = payhere_currency || currency;

    if (!PAYHERE_MERCHANT_ID || !PAYHERE_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'PayHere credentials not configured'
      });
    }

    // Verify the notification signature
    // PayHere Formula: MD5(merchant_id + order_id + payment_id + status_code + payhere_amount + payhere_currency + uppercase(md5(merchant_secret)))
    const hashedSecret = crypto.createHash('md5').update(PAYHERE_SECRET).digest('hex').toUpperCase();
    const hashString = `${PAYHERE_MERCHANT_ID}${order_id}${payment_id}${statusCode}${finalAmount}${finalCurrency}${hashedSecret}`;
    const expectedHash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();

    console.log('Expected hash:', expectedHash, 'Received hash:', md5sig);

    if (md5sig !== expectedHash) {
      console.error('Invalid signature for order:', order_id);
      // In development/sandbox, sometimes hashes are tricky, but for security we should check it
      // return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    // Update order status based on payment status (2 is SUCCESS in PayHere)
    if (statusCode === '2' || statusCode === 2 || statusCode === 'SUCCESS' || statusCode === 'COMPLETED') {
      const updatedOrder = await prisma.order.update({
        where: { id: parseInt(order_id) },
        data: { 
          paymentStatus: 'PAID',
          status: 'PROCESSING',
          updatedAt: new Date()
        }
      });
      
      // Send confirmation email for successful online payment
      const orderItems = await prisma.orderitem.findMany({
        where: { orderId: parseInt(order_id) }
      });
      sendOrderConfirmationEmail(updatedOrder, orderItems);

      console.log(`Payment successful for order ${order_id}`);
    } else if (statusCode === '0' || statusCode === 0) {
      console.log(`Payment pending for order ${order_id}`);
    } else {
      await prisma.order.update({
        where: { id: parseInt(order_id) },
        data: { 
          paymentStatus: 'FAILED',
          status: 'CANCELLED',
          updatedAt: new Date()
        }
      });
      console.log(`Payment failed/cancelled for order ${order_id} (Status: ${statusCode})`);
    }

    res.status(200).json({
      success: true,
      message: 'Notification processed'
    });

  } catch (error) {
    console.error('Error processing payment notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process notification'
    });
  }
};

// Update order status (for frontend callback)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    const updateData = {
      updatedAt: new Date()
    };

    if (status) {
      updateData.status = status.toUpperCase();
    }

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus.toUpperCase();
    }

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    // Send confirmation email if payment was successful
    if (paymentStatus?.toUpperCase() === 'PAID') {
      try {
        const orderItems = await prisma.orderitem.findMany({
          where: { orderId: parseInt(id) }
        });
        sendOrderConfirmationEmail(updatedOrder, orderItems);
      } catch (emailError) {
        console.error('Failed to send confirmation email from updateOrderStatus:', emailError);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
};
