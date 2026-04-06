import sequelize from './config/db.js';
import Order from './models/Order.js';

const check = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected.');
        
        const [results] = await sequelize.query("DESCRIBE orders");
        console.log('--- Table Schema ---');
        console.log(JSON.stringify(results, null, 2));

        const orders = await Order.findAll({ limit: 10, order: [['createdAt', 'DESC']] });
        console.log('\n--- Recent Orders ---');
        console.log(JSON.stringify(orders.map(o => ({
            id: o.id,
            status: o.status,
            raw_status: o.getDataValue('status')
        })), null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

check();
