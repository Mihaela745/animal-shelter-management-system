import { Medical_files, Medications, Staff, Animals } from "../models/index.js";

const MEDICAL_FILE_ATTRIBUTES = [
  "id",
  "weight",
  "last_checkup_date",
  "general_observations",
];

const MEDICAL_FILE_INCLUDE = [
  {
    model: Animals,
    attributes: ["id", "name", "status", "box_id", "medical_file_id"],
  },
  {
    model: Medications,
    attributes: [
      "id",
      "name",
      "description",
      "dosage",
      "frequency",
      "start_date",
      "end_date",
    ],
    include: [
      {
        model: Staff,
        attributes: ["id", "name"],
      },
    ],
  },
];

export const controller = {
  getAllMedicalFiles: async (req, res) => {
    try {
      const files = await Medical_files.findAll({
        attributes: MEDICAL_FILE_ATTRIBUTES,
        include: MEDICAL_FILE_INCLUDE,
      });
      return res.status(200).send(files);
    } catch (error) {
      return res.status(500).send(`"Nu am putut încărca fișele medicale : ${error}`);
    }
  },
  getMedicalFilesbyId: async (req, res) => {
    try {
      const file = await Medical_files.findByPk(req.params.id, {
        attributes: MEDICAL_FILE_ATTRIBUTES,
        include: MEDICAL_FILE_INCLUDE,
      });
      if (!file) {
        return res.status(404).send(`Fișa medicală nu există`);
      }
      return res.status(200).send(file);
    } catch (error) {
      console.log("Can not find the medical_file");
      return res.status(500).send(`Nu am putut încărca fișele medicale : ${error}`);
    }
  },
  updateMedicalFile: async (req, res) => {
    try {
      const fileId = req.params.id;
      const file = await Medical_files.findByPk(fileId);
      if (!file) {
        return res.status(404).send("Fișa medicală nu există");
      }
      await file.update({ ...req.body, last_checkup_date: new Date() });

      const updatedFile = await Medical_files.findByPk(fileId, {
        attributes: MEDICAL_FILE_ATTRIBUTES,
        include: MEDICAL_FILE_INCLUDE,
      });

      return res.status(200).json(updatedFile);
    } catch (error) {
      console.log("Failed to modify medical_file!");

      return res.status(500).send(`Nu am putut actualiza fișele medicale : ${error}`);
    }
  },
};
