import prisma from '../lib/prisma.js';
import { sendEmail } from '../utils/sentEmail.js';
import fs from 'fs';
import path from 'path';

export const subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const existing = await prisma.subscriber.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ message: 'Email already subscribed' });
        }

        await prisma.subscriber.create({ data: { email } });

        const templatePath = path.join(process.cwd(), 'template', 'subscribe.html');
        let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
        htmlTemplate = htmlTemplate.replace('{{email}}', email);

        const imagesDir = path.join(process.cwd(), 'public', 'images');
        const emailImagesDir = path.join(imagesDir, 'email');

        const attachments = [
            { filename: 'logo.png', path: path.join(imagesDir, 'logo.png'), cid: 'logo' },
            { filename: 'grey-shoe.png', path: path.join(emailImagesDir, 'grey-shoe.png'), cid: 'grey-shoe' },
            { filename: 'lime-shoe.png', path: path.join(emailImagesDir, 'lime-shoe.png'), cid: 'lime-shoe' },
            { filename: 'orange-shoe.png', path: path.join(emailImagesDir, 'orange-shoe.png'), cid: 'orange-shoe' },
            { filename: 'tan-shoe.png', path: path.join(emailImagesDir, 'tan-shoe.png'), cid: 'tan-shoe' },
            { filename: 'product-4.png', path: path.join(emailImagesDir, 'product-4.png'), cid: 'product-4' },
            { filename: 'product-6.png', path: path.join(emailImagesDir, 'product-6.png'), cid: 'product-6' },
            { filename: 'product-8.png', path: path.join(emailImagesDir, 'product-8.png'), cid: 'product-8' },
        ];

        await sendEmail(email, '🎉 Welcome to SoleVora! 10% OFF your first order', htmlTemplate, attachments);

        const adminEmail = 'sajeesajeevan1998@gmail.com';
        const adminHtml = `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px; margin: auto;">
            <h2 style="color: #ff4d4d;">New subscriber Alert!</h2>
            <p>A new user has just subscribed to your newsletter.</p>
            <p><strong>Subscriber Email:</strong> <span style="color: #ff4d4d;">${email}</span></p>
          </div>
        `;
        await sendEmail(adminEmail, 'New Newsletter Subscription - SoleVora', adminHtml);

        res.status(200).json({ message: 'Thank you for subscribing 🎉' });
    } catch (error) {
        console.log('Email error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllSubscribers = async (req, res) => {
    try {
        const subscribers = await prisma.subscriber.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(subscribers);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteSubscriber = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const subscriber = await prisma.subscriber.findUnique({ where: { id } });

        if (!subscriber) {
            return res.status(404).json({ message: 'Subscriber not found' });
        }

        await prisma.subscriber.delete({ where: { id } });
        res.status(200).json({ message: 'Subscriber deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
