import express from 'express';
import prisma from '../lib/prisma.js';

const router = express.Router();

// POST /api/promo/validate
router.post('/validate', async (req, res) => {
    try {
        const { code, orderAmount } = req.body;
        if (!code) return res.status(400).json({ message: 'Promo code is required' });

        const promo = await prisma.promoCode.findFirst({
            where: { code: code.trim().toUpperCase(), isActive: true }
        });

        if (!promo) return res.status(404).json({ message: 'Invalid promo code' });

        if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
            return res.status(400).json({ message: 'This promo code has expired' });
        }

        if (promo.maxUses !== null && promo.usedCount >= promo.maxUses) {
            return res.status(400).json({ message: 'This promo code has reached its usage limit' });
        }

        if (orderAmount !== undefined && Number(orderAmount) < Number(promo.minOrderAmount)) {
            return res.status(400).json({
                message: `Minimum order amount of Rs.${Number(promo.minOrderAmount).toFixed(2)} required`
            });
        }

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
            message: `Promo applied! You save Rs.${discountAmount.toFixed(2)}`
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to validate promo code' });
    }
});

// GET /api/promo
router.get('/', async (req, res) => {
    try {
        const promos = await prisma.promoCode.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(promos);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch promo codes' });
    }
});

// POST /api/promo
router.post('/', async (req, res) => {
    try {
        const { code, discountType, discountValue, minOrderAmount, maxUses, expiresAt, isActive } = req.body;
        if (!code || !discountValue) {
            return res.status(400).json({ message: 'Code and discount value are required' });
        }

        const existing = await prisma.promoCode.findFirst({
            where: { code: code.trim().toUpperCase() }
        });
        if (existing) return res.status(400).json({ message: 'Promo code already exists' });

        const promo = await prisma.promoCode.create({
            data: {
                code: code.trim().toUpperCase(),
                discountType: discountType || 'percentage',
                discountValue: parseFloat(discountValue),
                minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : 0,
                maxUses: maxUses || null,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                isActive: isActive !== undefined ? isActive : true
            }
        });
        res.status(201).json({ message: 'Promo code created', promo });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create promo code' });
    }
});

// PUT /api/promo/:id
router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const promo = await prisma.promoCode.findUnique({ where: { id } });
        if (!promo) return res.status(404).json({ message: 'Promo code not found' });

        const { code, discountType, discountValue, minOrderAmount, maxUses, expiresAt, isActive } = req.body;

        const updated = await prisma.promoCode.update({
            where: { id },
            data: {
                code: code ? code.trim().toUpperCase() : promo.code,
                discountType: discountType || promo.discountType,
                discountValue: discountValue !== undefined ? parseFloat(discountValue) : promo.discountValue,
                minOrderAmount: minOrderAmount !== undefined ? parseFloat(minOrderAmount) : promo.minOrderAmount,
                maxUses: maxUses !== undefined ? (maxUses || null) : promo.maxUses,
                expiresAt: expiresAt !== undefined ? (expiresAt ? new Date(expiresAt) : null) : promo.expiresAt,
                isActive: isActive !== undefined ? isActive : promo.isActive
            }
        });
        res.json({ message: 'Promo code updated', promo: updated });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update promo code' });
    }
});

// DELETE /api/promo/:id
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const promo = await prisma.promoCode.findUnique({ where: { id } });
        if (!promo) return res.status(404).json({ message: 'Promo code not found' });
        await prisma.promoCode.delete({ where: { id } });
        res.json({ message: 'Promo code deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete promo code' });
    }
});

export default router;
