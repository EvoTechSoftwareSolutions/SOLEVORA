import prisma from '../lib/prisma.js';

export const submitContact = async (req, res) => {
    try {
        const { name, phone, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Required fields missing' });
        }

        const newContact = await prisma.contact.create({
            data: { name, phone, email, subject, message }
        });

        res.status(201).json({ message: 'Message sent successfully', data: newContact });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getContacts = async (req, res) => {
    try {
        const contacts = await prisma.contact.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUnreadCount = async (req, res) => {
    try {
        const count = await prisma.contact.count({
            where: { isRead: false }
        });
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const id = BigInt(req.params.id);
        const contact = await prisma.contact.findUnique({ where: { id } });

        if (!contact) {
            return res.status(404).json({ message: 'Contact message not found' });
        }

        const updated = await prisma.contact.update({
            where: { id },
            data: { isRead: true }
        });

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
