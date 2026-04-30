import express from 'express';
import { validatePromo } from '../controllers/admin.controller.js';

const router = express.Router();

// Public route — no auth required, used by checkout flow
router.post('/validate', validatePromo);

export default router;
