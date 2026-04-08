import sequelize from './config/db.js';

async function manualMigration() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Check if columns exist first
    const [results] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'products'
    `);
    
    const existingColumns = results.map(row => row.COLUMN_NAME);
    console.log('Existing columns:', existingColumns);

    // Add gender column if it doesn't exist
    if (!existingColumns.includes('gender')) {
      await sequelize.query(`
        ALTER TABLE products 
        ADD COLUMN gender ENUM('Men', 'Women', 'Kids', 'All') DEFAULT 'All' NOT NULL
      `);
      console.log('Added gender column');
    }

    // Add sizes column if it doesn't exist
    if (!existingColumns.includes('sizes')) {
      await sequelize.query(`
        ALTER TABLE products 
        ADD COLUMN sizes TEXT NULL
      `);
      
      // Update existing rows with default values
      await sequelize.query(`
        UPDATE products 
        SET sizes = '["6","6.5","7","7.5","8","8.5","9","9.5","10","10.5","11","12","13"]'
        WHERE sizes IS NULL
      `);
      
      console.log('Added sizes column');
    }

    // Add size_range column if it doesn't exist
    if (!existingColumns.includes('size_range')) {
      await sequelize.query(`
        ALTER TABLE products 
        ADD COLUMN size_range VARCHAR(50) NULL
      `);
      console.log('Added size_range column');
    }

    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sequelize.close();
  }
}

manualMigration();
