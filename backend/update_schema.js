
import sequelize from './config/db.js';

async function updateStatusEnum() {
    try {
        console.log('Attempting to update status ENUM in MySQL table "orders"...');
        await sequelize.query("ALTER TABLE orders MODIFY COLUMN status ENUM('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending'");
        console.log('Successfully updated status ENUM in database.');
        process.exit(0);
    } catch (error) {
        console.error('Error updating database schema:', error);
        process.exit(1);
    }
}

updateStatusEnum();
