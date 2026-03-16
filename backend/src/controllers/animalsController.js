import { Animals, Species, Boxes, Medical_files } from "../models/index.js";
import { sequelize } from "../config/db.js";
import { Op } from "sequelize";

const ANIMAL_INCLUDES = [
  { model: Species, attributes: ["name"] },
  { model: Boxes, attributes: ["box_number"] },
  { model: Medical_files },
];

export const controller = {
  createAnimal: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const {
        name,
        species_id,
        breed,
        age,
        gender,
        box_id,
        weight,
        image_url,
      } = req.body;

      if (!name || !species_id || !gender || !box_id) {
        await t.rollback();
        return res.status(400).send("Must complete all parameters!");
      }

      const imageUrl = req.file ? req.file.path : image_url;

      const medicalFile = await Medical_files.create(
        { weight: weight ? Number(weight) : null, general_observations: "" },
        { transaction: t },
      );

      const animal = await Animals.create(
        {
          name,
          species_id: Number(species_id),
          breed,
          age: age ? Number(age) : null,
          gender,
          box_id: Number(box_id),
          medical_file_id: medicalFile.id,
          image_url: imageUrl,
        },
        { transaction: t },
      );

      await Boxes.increment(
        { current_occupancy: 1 },
        { where: { id: box_id }, transaction: t },
      );

      await t.commit();
      return res.status(201).send(animal);
    } catch (err) {
      if (t) await t.rollback();
      console.error("Error while creating animal:", err);
      return res.status(500).send(`Error while creating: ${err.message}`);
    }
  },

  getAllAnimals: async (req, res) => {
    try {
      const {
        species,
        status,
        gender,
        minAge,
        maxAge,
        box_id,
        page = 1,
        limit = 9,
      } = req.query;
      const offset = (Number(page) - 1) * Number(limit);
      const whereClause = {};

      if (status) whereClause.status = status;
      if (gender) whereClause.gender = gender;
      if (box_id) whereClause.box_id = Number(box_id);

      if (minAge || maxAge) {
        whereClause.age = {};
        if (minAge) whereClause.age[Op.gte] = Number(minAge);
        if (maxAge) whereClause.age[Op.lte] = Number(maxAge);
      }

      const { count, rows } = await Animals.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Species,
            attributes: ["name"],
            required: !!species,
            ...(species && { where: { name: species } }),
          },
          { model: Boxes, attributes: ["box_number"] },
          { model: Medical_files },
        ],
        limit: Number(limit),
        offset,
      });

      return res.status(200).json({
        animals: rows,
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: Number(page),
      });
    } catch (err) {
      return res.status(500).send(`Couldn't fetch animals: ${err.message}`);
    }
  },

  getAnimalById: async (req, res) => {
    try {
      const animal = await Animals.findByPk(req.params.id, {
        include: ANIMAL_INCLUDES,
      });
      if (!animal) return res.status(404).send("Can't find animal by id!");
      return res.status(200).send(animal);
    } catch (err) {
      return res.status(500).send(`Couldn't fetch animal: ${err.message}`);
    }
  },

  updateAnimal: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const animalId = req.params.id;
      const body = req.body || {};
      const { name, breed, age, gender, status, box_id } = body;

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (breed !== undefined) updateData.breed = breed;
      if (age !== undefined && age !== "") updateData.age = Number(age);
      if (gender !== undefined) updateData.gender = gender;
      if (status !== undefined) updateData.status = status;
      if (box_id !== undefined) updateData.box_id = Number(box_id);
      if (req.file) updateData.image_url = req.file.path;

      const animal = await Animals.findByPk(animalId, { transaction: t });
      if (!animal) {
        await t.rollback();
        return res.status(404).send("Animal not found!");
      }

      if (updateData.box_id && updateData.box_id !== animal.box_id) {
        const newBox = await Boxes.findByPk(updateData.box_id, {
          transaction: t,
        });

        if (!newBox) {
          await t.rollback();
          return res.status(404).send("Box doesn't exist!");
        }
        if (newBox.species_id !== animal.species_id) {
          await t.rollback();
          return res
            .status(400)
            .send("Box is not suitable for this animal species!");
        }
        if (newBox.current_occupancy >= newBox.capacity) {
          await t.rollback();
          return res.status(400).send("Box capacity exceeded!");
        }
        if (animal.box_id) {
          await Boxes.decrement(
            { current_occupancy: 1 },
            { where: { id: animal.box_id }, transaction: t },
          );
        }
        await Boxes.increment(
          { current_occupancy: 1 },
          { where: { id: updateData.box_id }, transaction: t },
        );
      }

      await Animals.update(updateData, {
        where: { id: animalId },
        transaction: t,
      });

      await t.commit();

      const updatedAnimal = await Animals.findByPk(animalId, {
        include: ANIMAL_INCLUDES,
      });

      return res.status(200).send(updatedAnimal);
    } catch (err) {
      if (t) await t.rollback();
      console.error("Update error:", err.message);
      return res.status(500).send(`Couldn't update animal: ${err.message}`);
    }
  },

  deleteAnimal: async (req, res) => {
    try {
      const animalId = req.params.id;
      const animal = await Animals.findByPk(animalId);

      if (!animal)
        return res.status(404).send("Animal not found to be deleted!");

      if (animal.box_id) {
        await Boxes.decrement(
          { current_occupancy: 1 },
          { where: { id: animal.box_id } },
        );
      }

      await Animals.destroy({ where: { id: animalId } });
      return res.status(200).send("Animal has been deleted!");
    } catch (err) {
      return res.status(500).send(`Error at deletion: ${err.message}`);
    }
  },
};
