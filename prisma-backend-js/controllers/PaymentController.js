import crypto from 'crypto';
import prisma from '../lib/prisma.js';
import { sendOrderConfirmationEmail } from '../utils/emailService.js';

export const generatePaymentHash = async (req, res) => {
    try {
        const { order_id, amount, currency } = req.body;

        const merchant_id = process.env.PAYHERE_MERCHANT_ID?.trim();
        const merchant_secret = process.env.PAYHERE_SECRET?.trim();
        if (!merchant_id || !merchant_secret) {
            return res.status(500).json({ message: 'Missing PAYHERE_MERCHANT_ID or PAYHERE_SECRET in environment' });
        }

        const hashedSecret = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase();
        const amountFormatted = Number(amount).toFixed(2);
        const hashSource = merchant_id + order_id.toString() + amountFormatted + currency + hashedSecret;
        const hash = crypto.createHash('md5').update(hashSource).digest('hex').toUpperCase();

        res.status(200).json({ hash, merchant_id });
    } catch (error) {
        console.error('Error generating hash:', error);
        res.status(500).json({ message: 'Error generating payment hash' });
    }
};

export const handlePaymentNotification = async (req, res) => {
    try {
        const { merchant_id, order_id, payment_id, payhere_amount, payhere_currency, status_code, md5sig } = req.body;

        const merchant_secret = process.env.PAYHERE_SECRET?.trim();
        if (!merchant_secret) {
            return res.status(500).send('Internal Server Error');
        }

        const hashedSecret = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase();
        const localSigSource = merchant_id + order_id + payhere_amount + payhere_currency + status_code + hashedSecret;
        const localSig = crypto.createHash('md5').update(localSigSource).digest('hex').toUpperCase();

        if (localSig === String(md5sig || '').toUpperCase()) {
            if (status_code === '2') {
                const orderId = BigInt(order_id);
                await prisma.order.update({
                    where: { id: orderId },
                    data: { status: 'processing', payment_status: 'paid' }
                });

                const order = await prisma.order.findUnique({
                    where: { id: orderId },
                    include: { items: { include: { product: true } } }
                });

                if (order && order.email) {
                    await sendOrderConfirmationEmail(order, order.items);
                }
            }
            res.status(200).send('OK');
        } else {
            res.status(400).send('Invalid signature');
        }
    } catch (error) {
        console.error('Error handling PayHere notification:', error);
        res.status(500).send('Internal Server Error');
    }
};
