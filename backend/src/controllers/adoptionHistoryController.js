import { Adoption_history } from "../models/Adoption_history.js";
import { Animals } from "../models/Animals.js";
import { Boxes } from "../models/Boxes.js";
import {Species} from "../models/index.js"
export const controller = {
  getAdoptionHistoryByUserId: async (req, res) => {
    try {
      const adoptions = await Adoption_history.findAll({
        where: { adopter_id: req.user.id },
        include: [
          {
            model: Animals,
            attributes: [
              "id",
              "name",
              "breed",
              "age",
              "gender",
              "image_url",
              "status",
            ],
            include: [{ model: Species, attributes: ["name"] }],
          },
        ],
      });
      return res.status(200).json(adoptions);
    } catch (err) {
      return res.status(500).send(`Nu am putut încărca adopțiile: ${err}`);
    }
  },
  getAdoptionById: async (req, res) => {
    try {
      const adoptionId = req.params.id;
      const adoption = await Adoption_history.findByPk(adoptionId);
      if (!adoption) return res.status(404).send(`Nu am găsit adopția`);

      if (req.user.role === "user" && adoption.adopter_id !== req.user.id) {
        return res.status(403).send("Acces interzis!");
      }

      return res.status(200).send(adoption);
    } catch (err) {
      return res.status(500).send(`Nu am putut încărca adopția: ${err}`);
    }
  },
  deleteAdoption: async (req, res) => {
    try {
      const adoptionId = req.params.id;

      const adoption = await Adoption_history.findByPk(adoptionId);
      if (!adoption) return res.status(404).send("Adopția nu a fost găsită!");

      await Animals.update(
        { status: "Available" },
        { where: { id: adoption.animal_id } },
      );

      await Adoption_history.destroy({ where: { id: adoptionId } });

      return res.status(200).send("Adopția a fost ștearsă cu succes.");
    } catch (err) {
      return res.status(500).send(`A apărut o eroare la ștergere: ${err}`);
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
      return res.status(500).send(`Nu am putut încărca adopțiile: ${err.message}`);
    }
  },
};
