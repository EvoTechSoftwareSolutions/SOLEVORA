import sequelize from './config/db.js';
import bcrypt from 'bcrypt';

const rehashAllPasswords = async () => {
    await sequelize.authenticate();
    console.log('Connected to database.');

    // Get all users with plain-text passwords (bcrypt hashes always start with $2b$ or $2a$)
    const [users] = await sequelize.query(
        "SELECT id, email, password FROM Users WHERE password NOT LIKE '$2b$%' AND password NOT LIKE '$2a$%'"
    );

    if (users.length === 0) {
        console.log('✅ All passwords are already hashed. Nothing to do.');
        process.exit(0);
    }

    console.log(`Found ${users.length} user(s) with plain-text passwords. Rehashing...`);

    for (const user of users) {
        const hash = await bcrypt.hash(user.password, 10);
        await sequelize.query(
            'UPDATE Users SET password = ? WHERE id = ?',
            { replacements: [hash, user.id] }
        );
        console.log(`  ✅ Rehashed: ${user.email}`);
    }

    console.log('\n✅ All passwords have been securely hashed.');
    console.log('   Users can now log in with their original passwords.');
    process.exit(0);
};

rehashAllPasswords().catch(err => {
    console.error('Failed:', err.message);
    process.exit(1);
});
