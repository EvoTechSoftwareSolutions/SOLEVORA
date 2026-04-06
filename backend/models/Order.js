import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending'
    },
    shipping_address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    contact_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    tracking_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    carrier: {
        type: DataTypes.STRING,
        allowNull: true
    },
    estimated_delivery: {
        type: DataTypes.DATE,
        allowNull: true
    },
    actual_delivery: {
        type: DataTypes.DATE,
        allowNull: true
    },
    payment_method: {
        type: DataTypes.ENUM('online', 'cod'),
        defaultValue: 'online'
    },
    payment_status: {
        type: DataTypes.ENUM('pending', 'paid', 'failed'),
        defaultValue: 'pending'
    }
}, {
    timestamps: true,
    tableName: 'orders'
});

export default Order;
