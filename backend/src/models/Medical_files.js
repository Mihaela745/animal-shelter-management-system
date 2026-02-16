import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Medical_files = sequelize.define(
  "Medical_files",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    last_checkup_date: {
      type: DataTypes.DATE,
    },
    general_observations: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "Medical_files",
  }
);
