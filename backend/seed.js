import sequelize from './config/db.js';
import Category from './models/Category.js';
import Product from './models/Product.js';

const seed = async () => {
    try {
        // Disable foreign key checks to avoid errors during DROP TABLE
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        
        await sequelize.sync({ force: true });
        console.log('Database synced for seeding.');

        // Re-enable foreign key checks
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

        // Categories
        const categories = await Category.bulkCreate([
            { name: 'Running', description: 'Performance running shoes' },
            { name: 'Lifestyle', description: 'Casual everyday sneakers' },
            { name: 'Basketball', description: 'High-top basketball shoes' }
        ]);

        // Products
        await Product.bulkCreate([
            { 
                name: 'SoleRunner V1', 
                description: 'Best for long distance', 
                price: 120.00, 
                stock_quantity: 50, 
                categoryId: categories[0].id,
                image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'
            },
            { 
                name: 'Urban Glide', 
                description: 'Stylish and comfortable', 
                price: 85.00, 
                stock_quantity: 100, 
                categoryId: categories[1].id,
                image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a'
            },
            { 
                name: 'Hoop Master 3000', 
                description: 'Maximized jump support', 
                price: 150.00, 
                stock_quantity: 30, 
                categoryId: categories[2].id,
                image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'
            }
        ]);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
