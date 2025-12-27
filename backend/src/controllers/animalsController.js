import { Animals, Species, Boxes, Medical_files } from "../models/index.js";
import { sequelize } from "../config/db.js";

export const controller = {
  createAnimal: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { name, species_id, breed, age, gender, box_id } = req.body;
      if (!name || !species_id || !breed || !age || !gender || !box_id) {
        return res.status(400).send("Must complete all parameters!");
      }
      const image_url = req.file ? req.file.path : null;
      const medicalFile = await Medical_files.create(
        {
          weight: 0,
          general_observations: "",
        },
        { transaction: t }
      );
      const animal = await Animals.create(
        {
          name,
          species_id,
          breed,
          age,
          gender,
          box_id,
          medical_file_id: medicalFile.id,
          image_url: image_url,
        },
        { transaction: t }
      );
      await t.commit();
      return res.status(201).send(animal);
    } catch (err) {
      if (t) await t.rollback();
      console.log("Error while creating animal");
      return res.status(500).send(`Error while creating : ${err}`);
    }
  },
  getAllAnimals: async (req, res) => {
    try {
      const animals = await Animals.findAll({
        include: [
          { model: Species, attributes: ["name"] },
          { model: Boxes, attributes: ["box_number"] },
          { model: Medical_files },
        ],
      });

      if (animals.length === 0)
        return res.status(404).send("No animals found!");
      return res.status(200).send(animals);
    } catch (err) {
      return res.status(500).send(`Couldn't fetch animals: ${err}`);
    }
  },
  getAnimalById: async (req, res) => {
    try {
      const animalId = req.params.id;
      const animal = await Animals.findByPk(animalId);
      if (!animal) return res.status(400).send(`Can't find animal by id!`);
      return res.status(200).send(animal);
    } catch (err) {
      return res.status(500).send(`Couldn't fetch animal: ${err}`);
    }
  },
  updateAnimal: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const animalId = req.params.id;
      let updateData = { ...req.body };
      const animal = await Animals.findByPk(animalId);
      if (!animal) {
        await t.rollback();
        return res.status(404).send("Animal not found!");
      }

      if (req.file) {
        updateData.image_url = req.file.path;
      }
      const [updatedRows] = await Animals.update(updateData, {
        where: { id: animalId },
        transaction: t,
      });

      if (updatedRows === 0 && !req.file) {
        await t.rollback();
        return res.status(400).send("No changes applied!");
      }

      await t.commit();

      const updatedAnimal = await Animals.findByPk(animalId, {
        include: [
          { model: Species, attributes: ["name"] },
          { model: Boxes, attributes: ["box_number"] },
          { model: Medical_files },
        ],
      });

      return res.status(200).send(updatedAnimal);
    } catch (err) {
      if (t) await t.rollback();
      console.error("Update error:", err);
      return res.status(500).send(`Couldn't update animal: ${err.message}`);
    }
  },
  deleteAnimal: async (req, res) => {
    try {
      const animalId = req.params.id;
      const deletedAnimals = await Animals.destroy({ where: { id: animalId } });
      if (deletedAnimals === 0)
        return res.status(404).send(`Animal not found to be deleted!`);
      return res.status(200).send(`Animal has been deleted!`);
    } catch (err) {
      return res.status(500).send(`Error at deletion: ${err}`);
    }
  },
};
