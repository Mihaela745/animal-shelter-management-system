import { where } from "sequelize";
import { Medical_files } from "../models/Medical_files.js";

export const controller = {
  createMedicalFiles: async (req, res) => {
    try {
      const { weight } = req.body;
      if (!weight) {
        return res.status(400).send("All fields must be completed!");
      }
      const currentDate = new Date();
      const newFile = await Medical_files.create({
        weight,
        last_checkup_date: currentDate,
      });
      return res.status(201).send(newFile);
    } catch (error) {
      console.log("error creating medical files");
      return res.status(500).send(`"Failed to create medical file : ${error}`);
    }
  },
  getAllMedicalFiles: async (req, res) => {
    try {
      const files = await Medical_files.findAll({
        attributes: ["id", "weight", "last_checkup_date"],
      });
      return res.status(200).send(files);
    } catch (error) {
      return res.status(500).send(`"Failed to fetch medical files : ${error}`);
    }
  },
  getMedicalFilesbyId: async (req, res) => {
    try {
      const file = await Medical_files.findByPk(req.params.id, {
        attributes: ["id", "weight", "last_checkup_date"],
      });
      if (!file) {
        return res.status(404).send(`Medical file doesn't exist`);
      }
      return res.status(200).send(file);
    } catch (error) {
      console.log("Can not find the medical_file");
      return res.status(500).send(`"Failed to fetch medical files : ${error}`);
    }
  },
  updateMedicalFile: async (req, res) => {
    try {
      const fileId = req.params.id;
      const updateData = req.body;
      const [updatedRows] = await Medical_files.update(updateData, {
        where: { id: req.params.id },
      });
      if (updatedRows === 0) {
        return res.status(404).send(`Medical file doesn't exist`);
      }
      const updatedFile = await Medical_files.findByPk(fileId, {});
      return res.status(200).send(updatedFile)
    } catch (error) {
      console.log("Failed to modify medical_file!");

      return res.status(500).send(`"Failed to update medical files : ${error}`);
    }
  },
  deleteMedicalFile: async (req, res) => {
    try {
      const deletedRows = await Medical_files.destroy({
        where: {
          id: req.params.id,
        },
      });
      if (deletedRows === 0) {
        return res.status(404).send(`Medical file doesn't exist`);
      }
      return res
        .status(200)
        .send(`Medical file has been deleted!`);
    } catch (error) {
      console.error("Error deleting file", error);
      return res.status(500).send(`"Failed to delete medical files : ${error}`);
    }
  },
};
