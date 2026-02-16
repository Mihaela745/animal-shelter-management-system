import { Adoption_history } from "../models/Adoption_history.js";
import { Animals } from "../models/Animals.js";
import { Boxes } from "../models/Boxes.js";
export const controller = {
  getAdoptionHistoryByUserId: async (req, res) => {
    try {
      const adoptions = await Adoption_history.findAll({
        where: { adopter_id: req.user.id },
      });
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

      if (req.user.role === "user" && adoption.adopter_id !== req.user.id) {
        return res.status(403).send("Access denied!");
      }

      return res.status(200).send(adoption);
    } catch (err) {
      return res.status(500).send(`Couldn't fetch adoption: ${err}`);
    }
  },
  deleteAdoption: async (req, res) => {
    try {
      const adoptionId = req.params.id;

      const adoption = await Adoption_history.findByPk(adoptionId);
      if (!adoption) return res.status(404).send("Adoption not found!");

      await Animals.update(
        { status: "Available" },
        { where: { id: adoption.animal_id } },
      );

      await Adoption_history.destroy({ where: { id: adoptionId } });

      return res.status(200).send("Adoption deleted successfully.");
    } catch (err) {
      return res.status(500).send(`Error at deletion: ${err}`);
    }
  },
  getAllAdoptions: async (req, res) => {
    try {
      const adoptions = await Adoption_history.findAll({
        include: [
          {
            model: Animals,
            attributes: ["name", "species_id"],
          },
        ],
      });
      return res.status(200).json(adoptions);
    } catch (err) {
      return res.status(500).send(`Couldn't fetch adoptions: ${err.message}`);
    }
  },
};
