// Run this once to create the promo_codes table and seed a test promo code
// Usage: node backend/seedPromo.js

import sequelize from './config/db.js';
import PromoCode from './models/PromoCode.js';

const run = async () => {
    try {
        await sequelize.authenticate();
        console.log('DB connected');

        // Sync ONLY the PromoCode table (safe — won't touch others)
        await PromoCode.sync({ alter: true });
        console.log('promo_codes table created/updated');

        // Seed some sample promo codes
        const samples = [
            { code: 'SAVE10', discountType: 'percentage', discountValue: 10, minOrderAmount: 0, isActive: true },
            { code: 'WELCOME20', discountType: 'percentage', discountValue: 20, minOrderAmount: 50, maxUses: 100, isActive: true },
            { code: 'FLAT5', discountType: 'fixed', discountValue: 5, minOrderAmount: 30, isActive: true },
        ];

        for (const s of samples) {
            const [, created] = await PromoCode.findOrCreate({ where: { code: s.code }, defaults: s });
            console.log(`${s.code} — ${created ? 'seeded' : 'already exists'}`);
        }

        console.log('\nDone! Promo codes are ready.');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

run();
