import express from 'express';
import prisma from '../lib/prisma.js';

const router = express.Router();

// Get Wishlist for User
router.get('/:userId', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const wishlistItems = await prisma.wishlist.findMany({
            where: { userId },
            include: { product: true }
        });
        const products = wishlistItems.map(item => item.product);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch wishlist' });
    }
});

// Add to Wishlist
router.post('/', async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const existingItem = await prisma.wishlist.findFirst({
            where: { userId: parseInt(userId), productId: BigInt(productId) }
        });
        if (existingItem) return res.status(400).json({ message: 'Already in wishlist' });

        await prisma.wishlist.create({
            data: { userId: parseInt(userId), productId: BigInt(productId) }
        });
        res.json({ message: 'Added to wishlist' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add to wishlist' });
    }
});

// Remove from Wishlist
router.delete('/:userId/:productId', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const productId = BigInt(req.params.productId);

        await prisma.wishlist.deleteMany({ where: { userId, productId } });
        res.json({ message: 'Removed from wishlist' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove from wishlist' });
    }
});

export default router;
