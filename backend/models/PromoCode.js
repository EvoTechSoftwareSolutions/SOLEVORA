import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const PromoCode = sequelize.define('PromoCode', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    discountType: {
        type: DataTypes.ENUM('percentage', 'fixed'),
        allowNull: false,
        defaultValue: 'percentage'
    },
    discountValue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    minOrderAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    maxUses: {
        type: DataTypes.INTEGER,
        allowNull: true,   // null = unlimited
        defaultValue: null
    },
    usedCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: true    // null = never expires
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true,
    tableName: 'promo_codes'
});

export default PromoCode;
