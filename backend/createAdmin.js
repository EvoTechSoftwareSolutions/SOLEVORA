import User from './models/User.js';
import sequelize from './config/db.js';

const createAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to database. Synchronizing schema...');
        
        // Add { alter: true } so Sequelize creates missing columns (like role, lastLogin)
        await User.sync({ alter: true });
        console.log('Table schema synchronized.');

        // Check if admin already exists
        const email = 'admin@solevora.com';
        let adminUser = await User.findOne({ where: { email } });

        if (adminUser) {
            // Update existing user to be admin
            adminUser.role = 'admin';
            adminUser.password = 'admin123'; // ensure we know the password
            await adminUser.save();
            console.log('Existing user updated to Admin: admin@solevora.com');
        } else {
            // Create new admin user
            await User.create({
                name: 'System Admin',
                email: email,
                password: 'admin123',
                role: 'admin',
                newsletter: false,
                pushNotifications: false
            });
            console.log('New Admin User created: admin@solevora.com');
        }
        
        console.log('Password for login: admin123');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
