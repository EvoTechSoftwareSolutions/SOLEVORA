import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Category from './Category.js';

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    stock_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image_url_2: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image_url_3: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image_url_4: {
        type: DataTypes.STRING,
        allowNull: true
    },
    categoryId: {
        type: DataTypes.BIGINT,
        references: {
            model: Category,
            key: 'id'
        }
    }
}, {
    timestamps: true,
    tableName: 'products'
});

Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

export default Product;
