import { Medications, Medical_files, Staff } from "../models/index.js";
import { Op } from "sequelize";
export const controller = {
  createMedications: async (req, res) => {
    try {
      const medical_file_id = req.params.id;
      const { name, description, dosage, frequency, start_date, end_date } =
        req.body;
      if (!name || !dosage || !frequency || !start_date) {
        return res.status(400).send(`Toate câmpurile sunt obligatorii`);
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(start_date) < today) {
        return res.status(400).send("Data de început nu poate fi în trecut!");
      }
      if (end_date && new Date(end_date) < new Date(start_date)) {
        return res.status(400).send("Data de sfârșit nu poate fi înainte de data de început!");
      }
      const medicalFileExists = await Medical_files.findByPk(medical_file_id);
      if (!medicalFileExists) {
        return res.status(400).send(` Fișa medicală nu există!`);
      }
      const staffMember = await Staff.findOne({
        where: { user_id: req.user.id },
      });

      if (!staffMember) {
        return res
          .status(403)
          .send("Doar membrii personalului pot prescrie tratamente!");
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
      return res.status(500).send(`Crearea tratamentului a eșuat :${error}`);
    }
  },
  getAllMedicationsByMedicalFile: async (req, res) => {
    try {
      const medicalFileId = req.params.id;
      const medicalFile = await Medical_files.findByPk(medicalFileId);
      if (!medicalFile)
        return res.status(404).send("Fișa medicală nu există!");
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
        .send(`Nu am putut încărca tratamentele : ${error.message}`);
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
        return res.status(404).send("Tratamentul nu există");
      }
      return res.status(200).send(medication);
    } catch (error) {
      return res.status(500).send(`Nu am putut încărca tratamentul : ${error}`);
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
        return res.status(404).send("Tratamentul nu există!");
      }

      return res.status(200).send("Tratamentul a fost șters cu succes!");
    } catch (err) {
      return res.status(500).send(`Nu am putut șterge tratamentul:${err}`);
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
        return res.status(404).send("Tratamentul nu există!");
      }

      if (req.body.start_date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (new Date(req.body.start_date) < today) {
          return res.status(400).send("Data de început nu poate fi în trecut!");
        }
      }

      await medication.update(req.body);

      return res.status(200).json(medication);
    } catch (err) {
      return res.status(500).send(`Nu am putut actualiza tratamentul:${err}`);
    }
  },
};
