import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  }
);

async function migrate() {
  try {
    console.log("Starting migration...");
    
    // Add new columns
    await sequelize.query("ALTER TABLE addresses ADD COLUMN city VARCHAR(255)");
    await sequelize.query("ALTER TABLE addresses ADD COLUMN postalCode VARCHAR(255)");
    
    // Move data from cityStateZip to city if it exists
    await sequelize.query("UPDATE addresses SET city = cityStateZip");
    
    // Optional: drop old column
    // await sequelize.query("ALTER TABLE addresses DROP COLUMN cityStateZip");
    
    console.log("Migration successful!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
