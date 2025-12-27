import {DataTypes} from 'sequelize';
import {sequelize} from '../config/db.js';

export const Responsible_box = sequelize.define(
  "Responsible_box",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    box_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Boxes",
        key: "id",
      },
    },
    responsible_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Staff",
        key: "id",
      },
    },
  },
  {
    timestamps: false,
    tableName: "Responsible_boxes",
  }
);