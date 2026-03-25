import express from 'express';
import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

const router = express.Router();

// Get Wishlist for User
router.get('/:userId', async (req, res) => {
    try {
        const wishlistItems = await Wishlist.findAll({
            where: { userId: req.params.userId }
        });
        
        const productIds = wishlistItems.map(item => item.productId);
        const products = await Product.findAll({
            where: { id: productIds }
        });
        
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch wishlist" });
    }
});

// Add to Wishlist
router.post('/', async (req, res) => {
    try {
        const { userId, productId } = req.body;
        
        const existingItem = await Wishlist.findOne({ where: { userId, productId } });
        if (existingItem) return res.status(400).json({ message: "Already in wishlist" });

        await Wishlist.create({ userId, productId });
        res.json({ message: "Added to wishlist" });
    } catch (error) {
        res.status(500).json({ message: "Failed to add to wishlist" });
    }
});

// Remove from Wishlist
router.delete('/:userId/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;
        await Wishlist.destroy({ where: { userId, productId } });
        res.json({ message: "Removed from wishlist" });
    } catch (error) {
        res.status(500).json({ message: "Failed to remove from wishlist" });
    }
});

export default router;
