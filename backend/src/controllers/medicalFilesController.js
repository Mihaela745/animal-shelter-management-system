import { Medical_files, Medications, Staff, Animals } from "../models/index.js";

export const controller = {
  getAllMedicalFiles: async (req, res) => {
    try {
      const files = await Medical_files.findAll({
        attributes: ["id", "weight", "last_checkup_date"],
        include: [
          {
            model: Animals,
            attributes: ["id", "name", "status"],
          },
          {
            model: Medications,
            attributes: ["id", "name", "dosage", "start_date", "end_date"],
            include: [
              {
                model: Staff,
                attributes: ["id"],
              },
            ],
          },
        ],
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
        include: [
          {
            model: Animals,
            attributes: ["id", "name", "status"],
          },
          {
            model: Medications,
            attributes: ["id", "name", "dosage", "start_date", "end_date"],
            include: [
              {
                model: Staff,
                attributes: ["id"],
              },
            ],
          },
        ],
      });
      if (!file) {
        return res.status(404).send(`Medical file doesn't exist`);
      }
      return res.status(200).send(file);
    } catch (error) {
      console.log("Can not find the medical_file");
      return res.status(500).send(`Failed to fetch medical files : ${error}`);
    }
  },
  updateMedicalFile: async (req, res) => {
    try {
      const fileId = req.params.id;
      const file = await Medical_files.findByPk(fileId);
      if (!file) {
        return res.status(404).send("Medical file doesn't exist");
      }
      await file.update({ ...req.body, last_checkup_date: new Date() });

      return res.status(200).json(file);
    } catch (error) {
      console.log("Failed to modify medical_file!");

      return res.status(500).send(`Failed to update medical files : ${error}`);
    }
  },
};
