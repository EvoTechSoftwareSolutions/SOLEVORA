import sequelize from './config/db.js';
import Order from './models/Order.js';

const seedTracking = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to database.');

        const orders = await Order.findAll();
        console.log(`Found ${orders.length} orders.`);

        let updatedCount = 0;
        for (const order of orders) {
            // Only update if no tracking info exists
            if (!order.tracking_number) {
                const carriers = ['FedEx', 'UPS', 'DHL', 'USPS'];
                const randomCarrier = carriers[Math.floor(Math.random() * carriers.length)];
                const randomTrack = `${randomCarrier.toUpperCase()}-${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
                
                // If the order is older, maybe mark it as shipped or delivered
                let newStatus = order.status;
                if (order.status === 'pending') {
                    newStatus = 'shipped';
                }

                await order.update({
                    tracking_number: randomTrack,
                    carrier: randomCarrier,
                    status: newStatus
                });
                updatedCount++;
            }
        }

        console.log(`Successfully updated ${updatedCount} orders with tracking info.`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding tracking info:', error);
        process.exit(1);
    }
};

seedTracking();
