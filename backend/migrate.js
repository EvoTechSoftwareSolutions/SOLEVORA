import sequelize from './config/db.js';

const migrate = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to database.');

        const queryInterface = sequelize.getQueryInterface();
        const tableDescription = await queryInterface.describeTable('Users');

        const columnsToAdd = [
            { name: 'streetAddress', type: 'VARCHAR(255)' },
            { name: 'city',          type: 'VARCHAR(255)' },
            { name: 'postalCode',    type: 'VARCHAR(50)'  },
            { name: 'country',       type: 'VARCHAR(255)' },
        ];

        for (const col of columnsToAdd) {
            if (!tableDescription[col.name]) {
                await sequelize.query(`ALTER TABLE Users ADD COLUMN \`${col.name}\` ${col.type} DEFAULT NULL;`);
                console.log(`✅ Added column: ${col.name}`);
            } else {
                console.log(`⏭  Column already exists: ${col.name}`);
            }
        }

        console.log('Migration complete!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err.message);
        process.exit(1);
    }
};

migrate();
