import express from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getAllBatches } from '../controllers/ProductController.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/batches', getAllBatches);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
