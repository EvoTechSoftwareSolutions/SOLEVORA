import sequelize from './config/db.js';
import Product from './models/Product.js';

async function updateProductFilters() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Update existing products to have default values
    const [updatedCount] = await Product.update(
      {
        gender: 'All',
        sizes: JSON.stringify(['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12', '13']),
        size_range: '6-13'
      },
      {
        where: {
          gender: null
        }
      }
    );

    console.log(`${updatedCount} products updated with default filter values!`);
    
  } catch (error) {
    console.error('Update failed:', error);
  } finally {
    await sequelize.close();
  }
}

updateProductFilters();
