import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Wishlist = sequelize.define('Wishlist', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productId: {
        type: DataTypes.BIGINT, // Matches Product model's id type
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: 'wishlists'
});

export default Wishlist;
