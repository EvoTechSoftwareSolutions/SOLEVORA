
import sequelize from './config/db.js';
import Product from './models/Product.js';

const getProducts = async () => {
    try {
        await sequelize.authenticate();
        const products = await Product.findAll({
            attributes: ['id', 'name', 'description']
        });
        console.log(JSON.stringify(products, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

getProducts();
