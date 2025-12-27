import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Users } from "./Users.js";

export const Adoption_requests = sequelize.define(
  "Adoption_requests",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    animal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Animals", key: "id" },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Users", key: "id" },
    },
    status: {
      type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
      defaultValue: "Pending",
    },
    request_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "Adoption_requests",
    indexes: [
      {
        unique: true,
        fields: ["user_id", "animal_id"],
      },
    ],
  }
);
