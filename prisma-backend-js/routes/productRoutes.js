import express from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getAllBatches } from '../controllers/ProductController.js';
import { requireStoreAccess } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/batches', getAllBatches);
router.get('/:id', getProductById);
router.post('/', requireStoreAccess, createProduct);
router.put('/:id', requireStoreAccess, updateProduct);
router.delete('/:id', requireStoreAccess, deleteProduct);

export default router;
