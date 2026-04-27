import express from 'express';
import prisma from '../lib/prisma.js';

const router = express.Router();

// Get all addresses for a user
router.get('/:userId', async (req, res) => {
    try {
        const addresses = await prisma.address.findMany({
            where: { userId: parseInt(req.params.userId) }
        });
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch addresses' });
    }
});

// Get address by ID
router.get('/details/:id', async (req, res) => {
    try {
        const address = await prisma.address.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!address) return res.status(404).json({ message: 'Address not found' });
        res.json(address);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch address details' });
    }
});

// Create Address
router.post('/', async (req, res) => {
    try {
        const { userId, title, name, street, city, postalCode, country, phone, icon, isDefault } = req.body;

        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId: parseInt(userId) },
                data: { isDefault: false }
            });
        }

        const address = await prisma.address.create({
            data: {
                userId: parseInt(userId), title, name, street, city,
                postalCode, country, phone, icon: icon || 'home',
                isDefault: isDefault || false
            }
        });
        res.json({ message: 'Address added successfully', address });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add address' });
    }
});

// Update Address
router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { title, name, street, city, postalCode, country, phone, icon, isDefault } = req.body;

        const address = await prisma.address.findUnique({ where: { id } });
        if (!address) return res.status(404).json({ message: 'Address not found' });

        if (isDefault && !address.isDefault) {
            await prisma.address.updateMany({
                where: { userId: address.userId },
                data: { isDefault: false }
            });
        }

        const updated = await prisma.address.update({
            where: { id },
            data: { title, name, street, city, postalCode, country, phone, icon, isDefault }
        });
        res.json({ message: 'Address updated successfully', address: updated });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update address' });
    }
});

// Delete Address
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const address = await prisma.address.findUnique({ where: { id } });
        if (!address) return res.status(404).json({ message: 'Address not found' });
        await prisma.address.delete({ where: { id } });
        res.json({ message: 'Address deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete address' });
    }
});

export default router;
