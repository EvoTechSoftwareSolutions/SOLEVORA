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

async function fixKids() {
  try {
    console.log("Updating products for Kids category...");
    
    // Set some products to Kids
    await sequelize.query("UPDATE products SET gender = 'Kids' WHERE id IN (2, 8, 9)");
    
    // Fix names
    await sequelize.query("UPDATE products SET name = 'Jump Force' WHERE id = 9");
    
    console.log("Products updated successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Update failed:", error);
    process.exit(1);
  }
}

fixKids();
