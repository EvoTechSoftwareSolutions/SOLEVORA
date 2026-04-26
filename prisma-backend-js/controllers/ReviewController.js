import prisma from '../lib/prisma.js';

// Get reviews for a specific product
export const getProductReviews = async (req, res) => {
    try {
        const productId = BigInt(req.params.productId);
        const reviews = await prisma.review.findMany({
            where: { productId },
            include: {
                user: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new review
export const addReview = async (req, res) => {
    try {
        const { rating, comment, userId, productId } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Login is required to add a review.' });
        }

        const review = await prisma.review.create({
            data: {
                rating: parseInt(rating),
                comment,
                userId: parseInt(userId),
                productId: BigInt(productId)
            },
            include: {
                user: { select: { name: true } }
            }
        });

        res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
