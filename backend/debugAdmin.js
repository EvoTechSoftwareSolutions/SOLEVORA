import sequelize from './config/db.js';
import bcrypt from 'bcrypt';
import User from './models/User.js';

const debug = async () => {
    await sequelize.authenticate();

    // Look up the admin user - bypass Sequelize model to get raw password
    const [rows] = await sequelize.query("SELECT id, email, password, role FROM Users WHERE email = 'admin@solevora.com'");
    
    if (rows.length === 0) {
        console.log('❌ No admin user found with that email!');
        process.exit(1);
    }

    const adminRaw = rows[0];
    console.log('✅ Found user:', adminRaw.email, '| role:', adminRaw.role);
    console.log('   Password in DB:', adminRaw.password.substring(0, 30) + '...');

    const isBcrypt = adminRaw.password.startsWith('$2b$') || adminRaw.password.startsWith('$2a$');
    console.log('   Is bcrypt hash?', isBcrypt ? '✅ YES' : '❌ NO - stored as plain text!');

    if (isBcrypt) {
        const match = await bcrypt.compare('admin123', adminRaw.password);
        console.log('   bcrypt.compare("admin123") =>', match ? '✅ MATCH' : '❌ NO MATCH');
    }

    process.exit(0);
};

debug().catch(err => { console.error(err); process.exit(1); });
