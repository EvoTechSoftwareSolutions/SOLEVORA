import sequelize from './config/db.js';

const checkSchema = async () => {
    const [results] = await sequelize.query("DESCRIBE Users");
    console.log(JSON.stringify(results, null, 2));
    process.exit(0);
};

checkSchema();
