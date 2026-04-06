import crypto from 'crypto';
import Order from '../models/Order.js';

export const generatePaymentHash = async (req, res) => {
    try {
        const { order_id, amount, currency } = req.body;
        
        const merchant_id = process.env.PAYHERE_MERCHANT_ID?.trim();
        const merchant_secret = process.env.PAYHERE_SECRET?.trim();
        if (!merchant_id || !merchant_secret) {
            return res.status(500).json({ message: 'Missing PAYHERE_MERCHANT_ID or PAYHERE_SECRET in environment' });
        }
        
        console.log('--- PayHere Hash Generation Debug ---');
        console.log('Merchant ID:', merchant_id);
        console.log('Order ID:', order_id);
        console.log('Amount:', amount);
        console.log('Currency:', currency);
        
        const hashedSecret = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase();
        const amountFormatted = Number(amount).toFixed(2);
        
        const hashSource = merchant_id + order_id.toString() + amountFormatted + currency + hashedSecret;
        console.log('Hash Source String:', hashSource);
        
        const hash = crypto.createHash('md5').update(hashSource).digest('hex').toUpperCase();
        console.log('Generated Hash:', hash);
        console.log('-------------------------------------');
        
        res.status(200).json({ hash, merchant_id });
    } catch (error) {
        console.error('Error generating hash:', error);
        res.status(500).json({ message: 'Error generating payment hash' });
    }
};

export const handlePaymentNotification = async (req, res) => {
    try {
        console.log('--- PayHere Notification Received ---');
        console.log('Request Body:', req.body);
        
        const { merchant_id, order_id, payment_id, payhere_amount, payhere_currency, status_code, md5sig } = req.body;
        
        const merchant_secret = process.env.PAYHERE_SECRET?.trim();
        if (!merchant_secret) {
            console.error('PAYHERE_SECRET is not defined in .env');
            return res.status(500).send('Internal Server Error');
        }

        const hashedSecret = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase();
        
        // Verify signature: merchant_id + order_id + payhere_amount + payhere_currency + status_code + strtoupper(md5(merchant_secret))
        const localSigSource = merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret;
        const localSig = crypto.createHash('md5').update(localSigSource).digest('hex').toUpperCase();
        
        console.log('Local Signature Source:', localSigSource);
        console.log('Local Signature:', localSig);
        console.log('PayHere Signature:', md5sig);

        if (localSig === String(md5sig || '').toUpperCase()) {
            if (status_code === '2') {
                // Success
                await Order.update({ status: 'processing', payment_status: 'paid' }, { where: { id: order_id } });
                console.log(`Payment successful: Order ${order_id} marked as PROCESSING.`);
            } else if (status_code === '0') {
                // Pending
                console.log(`Payment pending for Order ${order_id}.`);
            } else {
                // Failed or Cancelled
                console.log(`Payment unsuccessful for Order ${order_id}. Status: ${status_code}`);
            }
            res.status(200).send('OK');
        } else {
            console.error('INVALID SIGNATURE: Signature mismatch for Order', order_id);
            res.status(400).send('Invalid signature');
        }
    } catch (error) {
        console.error('Error handling PayHere notification:', error);
        res.status(500).send('Internal Server Error');
    }
};
