import crypto from 'crypto';
import Order from '../models/Order.js';

export const generatePaymentHash = async (req, res) => {
    try {
        const { order_id, amount, currency } = req.body;
        
        const merchant_id = process.env.PAYHERE_MERCHANT_ID?.trim();
        const merchant_secret = process.env.PAYHERE_SECRET?.trim();
        
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
        const { merchant_id, order_id, payment_id, payhere_amount, payhere_currency, status_code, md5sig } = req.body;
        
        const merchant_secret = process.env.PAYHERE_SECRET;
        const hashedSecret = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase();
        
        // Verify signature
        const localSigSource = merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret;
        const localSig = crypto.createHash('md5').update(localSigSource).digest('hex').toUpperCase();
        
        if (localSig === md5sig) {
            if (status_code === '2') {
                // Payment Success
                await Order.update({ status: 'paid' }, { where: { id: order_id } });
                console.log(`Order ${order_id} marked as paid.`);
            } else if (status_code === '0') {
                // Pending
                await Order.update({ status: 'pending' }, { where: { id: order_id } });
            } else if (status_code === '-1') {
                // Cancelled
                await Order.update({ status: 'cancelled' }, { where: { id: order_id } });
            } else if (status_code === '-2') {
                // Failed
                await Order.update({ status: 'pending' }, { where: { id: order_id } }); // Or keep as pending
            }
            res.status(200).send('OK');
        } else {
            console.error('Invalid signature from PayHere');
            res.status(400).send('Invalid signature');
        }
    } catch (error) {
        console.error('Error handling notification:', error);
        res.status(500).send('Internal Server Error');
    }
};
