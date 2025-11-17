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
        return res.status(400).send(`All fields must be completed`);
      }
      const medicalFileExists = await Medical_files.findByPk(medical_file_id);
      if (!medicalFileExists) {
        return res.status(400).send(` Medical file doesn't exist!`);
      }
      const vet = await Staff.findByPk(prescribing_vet);
      if (!vet) {
        return res.status(400).send(`Staff doesn't exist!`);
      }
      const position_id = vet.position_id;
      const position_details = await Position.findByPk(position_id);
      if (position_details.title !== "Vet") {
        return res.status(404).send(`Staff isn't a vet`);
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
      return res.status(201).send(newMedication);
    } catch (error) {
      console.log("error creating medication");
      return res.status(500).send(`Failed while creating medication :${error}`);
    }
  },
  getAllMedications: async (req, res) => {
    try {
      const medications = await Medications.findAll();
      if (!medications)
        return res
          .status(400)
          .send(`Couldn't fetch  medications`);
      return res.status(200).send(medications);
    } catch (error) {
      return res.status(500).send(`Failed to fetch medicationd : ${error}`);
    }
  },
  getMedicationById: async (req, res) => {
    try {
      const medication = await Medications.findByPk(req.params.id);
      if (!medication) {
        return res.status(404).send("Medication doesnt exist" );
      }
      return res.status(200).send(medication);
    } catch (error) {
      return res.status(500).send(`Failed to fetch medicationd : ${error}`);
    }
  },
  deleteMedications: async (req, res) => {
    try {
      const deletedRows = await Medications.destroy({
        where: {
          id: req.params.id,
        },
      });
      if (deletedRows === 0) return res.status(404).send("Doesn't exist!");
      return res.status(200).send("Medication has been deleted!");
    } catch (err) {
      return res.status(500).send(`Couldn't delete medication:${err}`);
    }
  },
  updateMedication: async (req, res) => {
    try {
      const medicationId=req.params.id;
      const updateData=req.body;
      const [updatedRows] = await Medications.update(updateData, {
        where: { id: medicationId },
      });

      if (updatedRows === 0) {
        return res
          .status(404)
          .send("Medication not found or no changes applied.");
      }
      const updatedMedication = await Medications.findByPk(medicationId);
      return res.status(200).send(updatedMedication);
    } catch (err) {
      return res.status(500).send(`Couldn't update medication:${err}`);
    }
  },
};
