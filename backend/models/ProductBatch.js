import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Product from './Product.js';

const ProductBatch = sequelize.define('ProductBatch', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    productId: {
        type: DataTypes.BIGINT,
        references: {
            model: Product,
            key: 'id'
        },
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    original_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cost_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    selling_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    batch_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true,
    tableName: 'product_batches'
});

Product.hasMany(ProductBatch, { foreignKey: 'productId', as: 'batches' });
ProductBatch.belongsTo(Product, { foreignKey: 'productId' });

export default ProductBatch;
