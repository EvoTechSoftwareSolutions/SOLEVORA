import sequelize from './config/db.js';
import bcrypt from 'bcrypt';

const fixAdmin = async () => {
    await sequelize.authenticate();
    console.log('Connected.');

    const hash = await bcrypt.hash('admin123', 10);
    console.log('New bcrypt hash generated:', hash.substring(0, 20) + '...');

    await sequelize.query(
        `UPDATE Users SET password = ? WHERE email = 'admin@solevora.com'`,
        { replacements: [hash] }
    );
    console.log('✅ Admin password updated successfully with bcrypt hash.');
    console.log('   Login: admin@solevora.com / admin123');
    process.exit(0);
};

fixAdmin().catch(err => { console.error(err); process.exit(1); });
