import { Animals } from "../models/Animals.js";
import { Species } from "../models/Species.js";
import { Boxes } from "../models/Boxes.js";
import { Medical_files } from "../models/Medical_files.js";

export const controller = {
  createAnimal: async (req, res) => {
    try {
      const { name, species_id, breed, age, gender, box_id, medical_file_id } =
        req.body;
      if (!name || !species_id || !breed || !age || !gender || !box_id) {
        return res.status(400).send("Must complete all parameters!");
      }
      const animal = await Animals.create({
        name,
        species_id,
        breed,
        age,
        gender,
        box_id,
      });
      return res.status(201).send(animal);
    } catch (err) {
      console.log("Error while creating animal");
      return res.status(500).send(`Error while creating : ${err}`);
    }
  },
  getAllAnimals: async (req, res) => {
    try {
      const animals = await Animals.findAll();
      if (animals.length === 0)
        return res.status(400).send("No data found for animals!");
      else return res.status(200).send(animals);
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
    try {
      const animalId = req.params.id;
      const updateData = req.body;
      const [updatedRows] = await Animals.update(updateData, {
        where: {
          id: animalId,
        },
      });
      if (updatedRows === 0) return res.status(400).send(`No rows updated!`);
      const updatedAnimal = await Animals.findByPk({ where: { id: animalId } });
      return res.status(200).send(updatedAnimal);
    } catch (err) {
      return res.status(500).send(`Could'n change no data: ${err}`);
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
