import express from 'express';
import { getAllCategories, createCategory } from '../controllers/CategoryController.js';
import { requireStoreAccess } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getAllCategories);
router.post('/', requireStoreAccess, createCategory);

export default router;
