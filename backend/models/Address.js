import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Address = sequelize.define('Address', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    street: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cityStateZip: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    icon: {
        type: DataTypes.STRING,
        defaultValue: 'home'
    }
}, {
    timestamps: true
});

export default Address;
