import sequelize from './config/db.js';

const fix = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected.');

        // Update the table definition
        console.log('Altering orders table status column...');
        await sequelize.query("ALTER TABLE orders MODIFY COLUMN status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled')");
        console.log('Table altered successfully.');

        // Update any blank statuses that should probably be 'processing' (if they had a recent update)
        // Or if they are empty strings.
        console.log('Fixing empty statuses...');
        await sequelize.query("UPDATE orders SET status = 'processing' WHERE status = '' OR status IS NULL");
        console.log('Fix applied.');

        process.exit(0);
    } catch (err) {
        console.error('Error fixing DB:', err);
        process.exit(1);
    }
};

fix();
