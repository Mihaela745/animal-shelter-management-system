import { where } from "sequelize";
import { Medical_files } from "../models/Medical_files.js";

export const createMedicalFiles = async (req, res) => {
  try {
    const { weight } = req.body;
    if (!weight) {
      return res.status(400).json({ error: "All fields must be completed!" });
    }
    const currentDate = new Date();
    const newFile = await Medical_files.create({
      weight,
      last_checkup_date: currentDate,
    });
    return res.status(201).json(newFile);
  } catch (error) {
    console.log("error creating medical files");
    return res.status(500).json({ error: "Failed to create medical file" });
  }
};

export const getAllMedicalFiles = async (req, res) => {
  try {
    const files = await Medical_files.findAll({
      attributes: ["id", "weight", "last_checkup_date"],
    });
    return res.status(200).json( files );
  } catch (error) {
    return res.status(500).json({
      error: "Failed to feetch all medical_files.",
      details: error.message,
    });
  }
};

export const getMedicalFilesbyId = async (req, res) => {
  try {
    const file = await Medical_files.findByPk(req.params.id, {
      attributes: ["id", "weight", "last_checkup_date"],
    });
    if (!file) {
      return res.status(404).json({
        error: "Medical_file does not exist",
        details: error.message,
      });
    }
    return res.status(200).json(file);
  } catch (error) {
    console.log("Can not find the medical_file");
    return res.status(500).json({
      error: "Failed to fetch the medical_file",
      details: error.message,
    });
  }
};

export const updateMedicalFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const updateData = req.body;
    const [updatedRows] = await Medical_files.update(updateData, {
      where: { id: req.params.id },
    });
    if (updatedRows === 0) {
      return res.status(404).json({ error: "there were no changes applied" });
    }
    const updatedFile = await Medical_files.findByPk(fileId, {});
    return res.status(200).json({
      message: "Medical_file updated succesfully",
      Medical_file: updatedFile,
    });
  } catch (error) {
    console.log("Failed to modify medical_file!");

    return res.status(500).json({ error: "Failed to modify medical_file!" });
  }
};

export const deleteMedicalFile = async (req, res) => {
  try {
    const deletedRows = await Medical_files.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (deletedRows === 0) {
      return res
        .status(404)
        .json({ message: "Medical_file has not been found" });
    }
    return res.status(200).json({ message: "Medical_file has been deleted!" });
  } catch (error) {
    console.error("Error deleting file", error);
    return res.status(500).json({
      error: "Failed to delete file",
      details: error.message,
    });
  }
};
