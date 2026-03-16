import { Medications, Medical_files, Staff } from "../models/index.js";
import { Op } from "sequelize";
export const controller = {
  createMedications: async (req, res) => {
    try {
      const medical_file_id = req.params.id;
      const { name, description, dosage, frequency, start_date, end_date } =
        req.body;
      if (!name || !dosage || !frequency || !start_date) {
        return res.status(400).send(`All fields must be completed`);
      }
      if (end_date && new Date(end_date) < new Date(start_date)) {
        return res.status(400).send("End date cannot be before start date!");
      }
      const medicalFileExists = await Medical_files.findByPk(medical_file_id);
      if (!medicalFileExists) {
        return res.status(400).send(` Medical file doesn't exist!`);
      }
      const staffMember = await Staff.findOne({
        where: { user_id: req.user.id },
      });

      if (!staffMember) {
        return res
          .status(403)
          .send("Only staff members can prescribe medication!");
      }

      const newMedication = await Medications.create({
        name,
        description,
        dosage,
        frequency,
        start_date,
        end_date,
        prescribing_vet:staffMember.id,
        medical_file_id,
      });
      return res.status(201).send(newMedication);
    } catch (error) {
      console.log("error creating medication");
      return res.status(500).send(`Failed while creating medication :${error}`);
    }
  },
  getAllMedicationsByMedicalFile: async (req, res) => {
    try {
      const medicalFileId = req.params.id;
      const medicalFile = await Medical_files.findByPk(medicalFileId);
      if (!medicalFile)
        return res.status(404).send("Medical file does not exist!");
      const today = new Date();

      const medications = await Medications.findAll({
        where: {
          medical_file_id: medicalFileId,
        },
        include: [
          {
            model: Staff,
            attributes: ["id", "name"],
          },
        ],
      });
      return res.status(200).json(medications);
    } catch (error) {
      return res
        .status(500)
        .send(`Failed to fetch medicationd : ${error.message}`);
    }
  },
  getMedicationById: async (req, res) => {
    try {
      const { fileId, id } = req.params;
      const medication = await Medications.findOne({
        where: {
          id: id,
          medical_file_id: fileId,
        },
      });
      if (!medication) {
        return res.status(404).send("Medication doesnt exist");
      }
      return res.status(200).send(medication);
    } catch (error) {
      return res.status(500).send(`Failed to fetch medications : ${error}`);
    }
  },
  deleteMedications: async (req, res) => {
    try {
      const { fileId,id } = req.params;

      const deleted = await Medications.destroy({
        where: {
          id: id,
          medical_file_id: fileId,
        },
      });

      if (!deleted) {
        return res.status(404).send("Medication does not exist!");
      }

      return res.status(200).send("Medication deleted successfully!");
    } catch (err) {
      return res.status(500).send(`Couldn't delete medication:${err}`);
    }
  },
  updateMedication: async (req, res) => {
    try {
      const { fileId, id } = req.params;

      const medication = await Medications.findOne({
        where: {
          id: id,
          medical_file_id: fileId,
        },
      });

      if (!medication) {
        return res.status(404).send("Medication does not exist!");
      }

      await medication.update(req.body);

      return res.status(200).json(medication);
    } catch (err) {
      return res.status(500).send(`Couldn't update medication:${err}`);
    }
  },
};
