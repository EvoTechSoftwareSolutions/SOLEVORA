import Review from '../models/Review.js';
import User from '../models/User.js';

// Get reviews for a specific product
export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.findAll({
            where: { productId },
            include: [{
                model: User,
                as: 'user',
                attributes: ['name']
            }],
            order: [['createdAt', 'DESC']]
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

        const review = await Review.create({
            rating,
            comment,
            userId,
            productId
        });

        const createdReview = await Review.findByPk(review.id, {
            include: [{
                model: User,
                as: 'user',
                attributes: ['name']
            }]
        });

        res.status(201).json({ message: 'Review added successfully', review: createdReview });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
