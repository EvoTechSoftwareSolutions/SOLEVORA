import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
const Subscriber = sequelize.define("Subscriber", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

}, {
  tableName: "subscribers", // table name in DB
  timestamps: true, // adds createdAt & updatedAt
});

export default Subscriber;