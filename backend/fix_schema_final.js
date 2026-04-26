import sequelize from './config/db.js';
import bcrypt from 'bcrypt';

const fixSchema = async () => {
    try {
        console.log('Altering Users table to increase password length...');
        await sequelize.query("ALTER TABLE Users MODIFY COLUMN password VARCHAR(255) NOT NULL");
        console.log('✅ Column password increased to VARCHAR(255).');

        console.log('Resetting admin password...');
        const hash = await bcrypt.hash('admin123', 10);
        await sequelize.query(
            "UPDATE Users SET password = ? WHERE email = 'admin@solevora.com'",
            { replacements: [hash] }
        );
        console.log('✅ Admin password reset successfully.');
        
        console.log('Verifying...');
        const [rows] = await sequelize.query("SELECT password FROM Users WHERE email = 'admin@solevora.com'");
        const dbHash = rows[0].password;
        console.log('Hash in DB:', dbHash);
        const match = await bcrypt.compare('admin123', dbHash);
        console.log('bcrypt.compare("admin123") =>', match ? '✅ MATCH' : '❌ NO MATCH');

    } catch (error) {
        console.error('Error:', error);
    }
    process.exit(0);
};

fixSchema();
