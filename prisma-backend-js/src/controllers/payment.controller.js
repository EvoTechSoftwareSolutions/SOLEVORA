import crypto from 'crypto';
import prisma from '../prisma/client.js';

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
      status,
      amount,
      currency,
      md5sig
    } = req.body;

    console.log('PayHere notification received:', req.body);

    if (!PAYHERE_MERCHANT_ID || !PAYHERE_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'PayHere credentials not configured'
      });
    }

    // Verify the notification signature
    const merchantId = PAYHERE_MERCHANT_ID;
    const hashString = `${merchantId}${order_id}${payment_id}${status}${amount}${currency}${PAYHERE_SECRET}`;
    const expectedHash = crypto.createHash('md5').update(hashString).digest('hex').toUpperCase();

    console.log('Expected hash:', expectedHash, 'Received hash:', md5sig);

    if (md5sig !== expectedHash) {
      console.error('Invalid signature for order:', order_id);
      return res.status(400).json({
        success: false,
        message: 'Invalid signature'
      });
    }

    // Update order status based on payment status
    if (status === 'SUCCESS' || status === 'COMPLETED') {
      await prisma.order.update({
        where: { id: parseInt(order_id) },
        data: { 
          paymentStatus: 'PAID',
          status: 'PROCESSING',
          updatedAt: new Date()
        }
      });
      console.log(`Payment successful for order ${order_id}`);
    } else if (status === 'FAILED' || status === 'CANCELLED') {
      await prisma.order.update({
        where: { id: parseInt(order_id) },
        data: { 
          paymentStatus: 'FAILED',
          status: 'CANCELLED',
          updatedAt: new Date()
        }
      });
      console.log(`Payment failed for order ${order_id}`);
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
