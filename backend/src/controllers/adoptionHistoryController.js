import { Adoption_history } from "../models/Adoption_history.js";

export const controller = {
  createAdoption: async (req, res) => {
    try {
      const { animal_id, adopter_id } = req.body;
      if (!animal_id || !adopter_id)
        return res.status(400).send(`Must complete al parameters`);
      const adoption = await Adoption_history.create({
        animal_id,
        adopter_id,
      });
      return res.status(201).send(adoption);
    } catch (err) {
      return res.status(500).send(`Couldn't create adoption: ${err}`);
    }
  },
  getAdoptionHistoryByUserId: async (req, res) => {
    try {
      const adoptions = await Adoption_history.findAll({
        where: { adopter_id: req.params.id },
      });
      if (adoptions.length === 0) {
        return res.status(404).send(`No adoptions where found!`);
      }
      return res.status(200).send(adoptions);
    } catch (err) {
      return res.status(500).send(`Couldn't fetch adoptions: ${err}`);
    }
  },
  getAdoptionById: async (req, res) => {
    try {
      const adoptionId = req.params.id;
      const adoption = await Adoption_history.findByPk(adoptionId);
      if (!adoption) return res.status(404).send(`Couldn't find the adoption`);
      return res.status(200).send(adoption);
    } catch (err) {
      return res.status(500).send(`Couldn't fetch adoption: ${err}`);
    }
  },
  deleteAdoption: async (req, res) => {
    try {
      const adoptionId = req.params.id;
      const deletedAdoption = await Adoption_history.destroy({
        where: { id: adoptionId },
      });
      if (deletedAdoption === 0)
        return res.status(404).send(`Error while deleting`);
      return res.status(200).send(`Adoption has been deleted!`);
    } catch (err) {
      return res.status(500).send(`Error at deletion: ${err}`);
    }
  },
};
