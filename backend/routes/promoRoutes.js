import express from 'express';
import { Op } from 'sequelize';
import PromoCode from '../models/PromoCode.js';

const router = express.Router();

// ── POST /api/promo/validate  (used by checkout frontend) ────────────────────
router.post('/validate', async (req, res) => {
    try {
        const { code, orderAmount } = req.body;
        if (!code) return res.status(400).json({ message: 'Promo code is required' });

        const promo = await PromoCode.findOne({
            where: { code: code.trim().toUpperCase(), isActive: true }
        });

        if (!promo) return res.status(404).json({ message: 'Invalid promo code' });

        // Check expiry
        if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
            return res.status(400).json({ message: 'This promo code has expired' });
        }

        // Check usage limit
        if (promo.maxUses !== null && promo.usedCount >= promo.maxUses) {
            return res.status(400).json({ message: 'This promo code has reached its usage limit' });
        }

        // Check minimum order amount
        if (orderAmount !== undefined && Number(orderAmount) < Number(promo.minOrderAmount)) {
            return res.status(400).json({
                message: `Minimum order amount of $${Number(promo.minOrderAmount).toFixed(2)} required for this code`
            });
        }

        // Calculate discount
        let discountAmount = 0;
        if (promo.discountType === 'percentage') {
            discountAmount = (Number(orderAmount || 0) * Number(promo.discountValue)) / 100;
        } else {
            discountAmount = Number(promo.discountValue);
        }

        return res.json({
            valid: true,
            code: promo.code,
            discountType: promo.discountType,
            discountValue: Number(promo.discountValue),
            discountAmount: parseFloat(discountAmount.toFixed(2)),
            message: `Promo applied! You save $${discountAmount.toFixed(2)}`
        });
    } catch (error) {
        console.error('Promo validate error:', error);
        res.status(500).json({ message: 'Failed to validate promo code' });
    }
});

// ── GET /api/promo  (admin — list all codes) ─────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const promos = await PromoCode.findAll({ order: [['createdAt', 'DESC']] });
        res.json(promos);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch promo codes' });
    }
});

// ── POST /api/promo  (admin — create) ────────────────────────────────────────
router.post('/', async (req, res) => {
    try {
        const { code, discountType, discountValue, minOrderAmount, maxUses, expiresAt, isActive } = req.body;
        if (!code || !discountValue) {
            return res.status(400).json({ message: 'Code and discount value are required' });
        }

        const existing = await PromoCode.findOne({ where: { code: code.trim().toUpperCase() } });
        if (existing) return res.status(400).json({ message: 'Promo code already exists' });

        const promo = await PromoCode.create({
            code: code.trim().toUpperCase(),
            discountType: discountType || 'percentage',
            discountValue,
            minOrderAmount: minOrderAmount || 0,
            maxUses: maxUses || null,
            expiresAt: expiresAt || null,
            isActive: isActive !== undefined ? isActive : true
        });
        res.status(201).json({ message: 'Promo code created', promo });
    } catch (error) {
        console.error('Promo create error:', error);
        res.status(500).json({ message: 'Failed to create promo code' });
    }
});

// ── PUT /api/promo/:id  (admin — update) ─────────────────────────────────────
router.put('/:id', async (req, res) => {
    try {
        const promo = await PromoCode.findByPk(req.params.id);
        if (!promo) return res.status(404).json({ message: 'Promo code not found' });

        const { code, discountType, discountValue, minOrderAmount, maxUses, expiresAt, isActive } = req.body;
        await promo.update({
            code: code ? code.trim().toUpperCase() : promo.code,
            discountType: discountType || promo.discountType,
            discountValue: discountValue ?? promo.discountValue,
            minOrderAmount: minOrderAmount ?? promo.minOrderAmount,
            maxUses: maxUses !== undefined ? (maxUses || null) : promo.maxUses,
            expiresAt: expiresAt !== undefined ? (expiresAt || null) : promo.expiresAt,
            isActive: isActive !== undefined ? isActive : promo.isActive
        });
        res.json({ message: 'Promo code updated', promo });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update promo code' });
    }
});

// ── DELETE /api/promo/:id  (admin — delete) ───────────────────────────────────
router.delete('/:id', async (req, res) => {
    try {
        const promo = await PromoCode.findByPk(req.params.id);
        if (!promo) return res.status(404).json({ message: 'Promo code not found' });
        await promo.destroy();
        res.json({ message: 'Promo code deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete promo code' });
    }
});

export default router;
