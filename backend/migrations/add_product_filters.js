import sequelize from '../config/db.js';
import Product from '../models/Product.js';

async function addProductFilters() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Add new columns to products table
    await sequelize.getQueryInterface().addColumn('products', 'gender', {
      type: sequelize.Sequelize.ENUM('Men', 'Women', 'Kids', 'All'),
      defaultValue: 'All',
      allowNull: false
    });

    await sequelize.getQueryInterface().addColumn('products', 'sizes', {
      type: sequelize.Sequelize.JSON,
      defaultValue: JSON.stringify(['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12', '13']),
      allowNull: false
    });

    await sequelize.getQueryInterface().addColumn('products', 'size_range', {
      type: sequelize.Sequelize.STRING,
      allowNull: true
    });

    console.log('Migration completed successfully!');
    
    // Update existing products to have default values
    await Product.update(
      {
        gender: 'All',
        sizes: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12', '13'],
        size_range: '6-13'
      },
      {
        where: {
          gender: null
        }
      }
    );

    console.log('Existing products updated with default filter values!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sequelize.close();
  }
}

addProductFilters();
