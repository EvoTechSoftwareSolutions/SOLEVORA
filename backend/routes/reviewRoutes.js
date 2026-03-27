import express from 'express';
import { getProductReviews, addReview } from '../controllers/ReviewController.js';

const router = express.Router();

// GET reviews for a productId
router.get('/:productId', getProductReviews);

// POST a new review for a product
router.post('/', addReview);

export default router;
