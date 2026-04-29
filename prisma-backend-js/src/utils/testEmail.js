import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env first
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { sendOrderConfirmationEmail } from './emailService.js';

const testOrder = {
  id: 'TEST-123',
  customerName: 'Test User',
  email: process.env.GMAIL_USER, // Send to yourself
  totalAmount: 5500,
  shippingAddress: '123 Test Street, Colombo, Sri Lanka',
  paymentMethod: 'COD',
  trackingNumber: 'TRK-TEST-999'
};

const testItems = [
  { productName: 'Premium Sneakers', size: '42', quantity: 1, sellingPrice: 3500 },
  { productName: 'Classic Loafers', size: '40', quantity: 1, sellingPrice: 2000 }
];

console.log('Testing SMTP Connection and Email Sending...');
console.log('Target Email:', process.env.GMAIL_USER);
console.log('Transporter User:', process.env.GMAIL_USER ? process.env.GMAIL_USER : 'MISSING');
console.log('Transporter Pass:', process.env.GMAIL_PASS ? '********' : 'MISSING');

sendOrderConfirmationEmail(testOrder, testItems)
  .then(info => {
    if (info) {
      console.log('✅ Success! Email sent successfully.');
      console.log('Message ID:', info.messageId);
    } else {
      console.error('❌ Failed. Email was not sent.');
    }
  })
  .catch(err => {
    console.error('❌ Error during email test:', err);
  });
