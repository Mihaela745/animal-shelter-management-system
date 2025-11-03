import {DataTypes} from 'sequelize';
import {sequelize} from '../config/db.js';

export const Users = sequelize.define('Users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phonenumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: { 
    type: DataTypes.STRING,
    allowNull: true,
  },
  registeredAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  role: { 
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
  },
}, {
  timestamps: false,
  tableName: 'Users',
});
