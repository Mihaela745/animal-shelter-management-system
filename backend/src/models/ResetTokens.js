import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const ResetTokens = sequelize.define(
  "ResetTokens",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    token_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "reset_tokens",
    freezeTableName: true,
    timestamps: false,
  }
);
