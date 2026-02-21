import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
export const Breed_Metadata = sequelize.define(
  "Breed_Metadata",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    species: {
      type: DataTypes.ENUM("Dog", "Cat"),
      allowNull: false,
    },

    breed_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    temperament: {
      type: DataTypes.STRING, 
      allowNull: true,
    },

    energy_level: {
      type: DataTypes.ENUM("Low", "Medium", "High"),
      allowNull: true,
    },

    size: {
      type: DataTypes.ENUM("Small", "Medium", "Large"),
      allowNull: true,
    },

    good_with_kids: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },

    good_with_other_pets: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },

    apartment_friendly: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },

    grooming_needs: {
      type: DataTypes.ENUM("Low", "Medium", "High"),
      allowNull: true,
    },

    life_expectancy: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "Breed_Metadata",
  },
);
