import crypto from 'crypto';
import Order from '../models/Order.js';

const generatePaymentHash = async (req, res) => {
    try {
        const { orderId, amount, currency } = req.body;
        const merchantId = process.env.PAYHERE_MERCHANT_ID;
        const merchantSecret = process.env.PAYHERE_SECRET;

        // PayHere Hash format: md5(merchant_id + order_id + amount + currency + md5(merchant_secret).toUpperCase())
        const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
        
        // Ensure amount is formatted to 2 decimal places as required by PayHere
        const formattedAmount = parseFloat(amount).toFixed(2);
        
        const sourceString = merchantId + orderId + formattedAmount + currency + hashedSecret;
        const finalHash = crypto.createHash('md5').update(sourceString).digest('hex').toUpperCase();

        console.log('--- PayHere Hash Generation Debug ---');
        console.log('Merchant ID:', merchantId);
        console.log('Order ID:', orderId);
        console.log('Amount:', formattedAmount);
        console.log('Currency:', currency);
        console.log('Hash Source String:', sourceString);
        console.log('Generated Hash:', finalHash);
        console.log('-------------------------------------');

        res.json({ hash: finalHash });
    } catch (error) {
        console.error('Error generating hash:', error);
        res.status(500).json({ error: 'Failed to generate payment hash' });
    }
};

const handlePaymentNotification = async (req, res) => {
    try {
        const { order_id, status_code, md5sig, merchant_id, payhere_amount, payhere_currency } = req.body;
        const merchantSecret = process.env.PAYHERE_SECRET;

        // Verify the notification signature
        const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
        const verifyString = merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret;
        const expectedSig = crypto.createHash('md5').update(verifyString).digest('hex').toUpperCase();

        if (md5sig !== expectedSig) {
            console.error('Invalid PayHere signature received!');
            return res.status(400).send('Invalid Signature');
        }

        // status_code 2 means success
        if (status_code === '2') {
            await Order.update({ status: 'paid' }, { where: { id: order_id } });
            console.log(`Order ${order_id} marked as PAID via PayHere notification.`);
        } else if (status_code === '-2') { //-2 means failed
            await Order.update({ status: 'failed' }, { where: { id: order_id } });
            console.log(`Order ${order_id} marked as FAILED via PayHere notification.`);
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('Error handling payment notification:', error);
        res.status(500).send('Error');
    }
};

export default {
    generatePaymentHash,
    handlePaymentNotification
};
