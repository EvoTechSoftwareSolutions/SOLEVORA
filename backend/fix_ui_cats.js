import sequelize from './config/db.js';
import Category from './models/Category.js';
import Product from './models/Product.js';

const fixCategories = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection established.');

        const targetCategories = [
            "Sneakers", "Running", "Formal", "Boots", 
            "Sandals", "Heels", "Loafers", "Athletic"
        ];

        for (const name of targetCategories) {
            await Category.findOrCreate({
                where: { name },
                defaults: { description: `${name} footwear collection` }
            });
        }

        console.log('Categories synced with UI.');
        
        // Optionally update some products to these categories so the filter shows results
        const products = await Product.findAll();
        const cats = await Category.findAll();
        const catMap = {};
        cats.forEach(c => catMap[c.name] = c.id);

        if (products.length > 0) {
            // Assign some products to these categories for testing
            await products[0].update({ categoryId: catMap['Sneakers'] });
            if (products[1]) await products[1].update({ categoryId: catMap['Running'] });
            if (products[2]) await products[2].update({ categoryId: catMap['Formal'] });
        }

        console.log('DB data updated to match UI categories.');
        process.exit(0);
    } catch (error) {
        console.error('Failed to fix categories:', error);
        process.exit(1);
    }
};

fixCategories();
