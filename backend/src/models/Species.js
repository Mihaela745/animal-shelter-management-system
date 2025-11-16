import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Species = sequelize.define(
  "Speciess",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Species",
  }
);
