import sequelize from './config/db.js';

const checkSchema = async () => {
    try {
        const [results] = await sequelize.query("DESCRIBE Users");
        console.log(JSON.stringify(results, null, 2));
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
};

checkSchema();
