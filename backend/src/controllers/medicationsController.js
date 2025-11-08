import { Medications } from "../models/Medications.js";
import { Medical_files } from "../models/Medical_files.js";
import { Staff } from "../models/Staff.js";
import { Position } from "../models/Position.js";

export const controller = {
  createMedications: async (req, res) => {
    try {
      const {
        name,
        description,
        dosage,
        frequency,
        start_date,
        end_date,
        prescribing_vet,
        medical_file_id,
      } = req.body;
      if (
        !name ||
        !description ||
        !dosage ||
        !frequency ||
        !start_date ||
        !end_date ||
        !prescribing_vet ||
        !medical_file_id
      ) {
        return res.status(400).json({ error: "All fields must be completed!" });
      }
      const medicalFileExists = await Medical_files.findByPk(medical_file_id);
      if (!medicalFileExists) {
        return res.status(400).json({ error: "Medica_file doesnt exist!" });
      }
      const vet = await Staff.findByPk(prescribing_vet);
      if (!vet) {
        return res.status(400).json({ error: "Staff doesnt exist!" });
      }
      const position_id = vet.position_id;
      const position_details = await Position.findByPk(position_id);
      if (position_details.title !== "Vet") {
        return res.status(404).json({ error: "Staff isn't a vet!" });
      }

      const newMedication = await Medications.create({
        name,
        description,
        dosage,
        frequency,
        start_date,
        end_date,
        prescribing_vet,
        medical_file_id,
      });
      return res.status(201).json(newMedication);
    } catch (error) {
      console.log("error creating medication");
      return res.status(500).json({ error: "Failed to create medication" });
    }
  },
  getAllMedications: async (req, res) => {
    try {
      const medications = await Medications.findAll({
        include: [
          {
            model: Medical_files,
            attributes: ["weight", "last_checkup_date"],
          },
          {
            model: Staff,
            attributes: ["name", "email", "phonenumber"],
          },
        ],
        attributes: [
          "id",
          "name",
          "description",
          "dosage",
          "frequency",
          "start_date",
          "end_date",
        ],
      });
      if (!medications)
        return res
          .status(400)
          .json({ error: "Medications couldnt be fetched!" });
      return res.status(200).json(medications);
    } catch (error) {
      return res.status(500).json({
        error: "Failed to feetch full medications",
        details: error.message,
      });
    }
  },
  getMedicationById: async (req, res) => {
    try {
      const medication = await Medications.findByPk(req.params.id, {
        include: [
          {
            model: Medical_files,
            attributes: ["weight", "last_checkup_date"],
          },
          {
            model: Staff,
            attributes: ["name", "email", "phonenumber"],
          },
        ],
        attributes: [
          "id",
          "name",
          "description",
          "dosage",
          "frequency",
          "start_date",
          "end_date",
        ],
      });
      if (!medication) {
        return res.status(404).json({ error: "Medication doesnt exist" });
      }
      return res.status(200).json(medication);
    } catch (error) {
      return res.status(500).json({
        error: "Failed to feetch medication",
        details: error.message,
      });
    }
  },
  updateMedication: async (req, res) => {
    try {
    } catch (error) {}
  },
};
