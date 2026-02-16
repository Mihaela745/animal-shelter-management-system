import { Animals, Appointments, Users } from "../models/index.js";
import { Adoption_requests } from "../models/index.js";
import { Adoption_history } from "../models/index.js";
import { sequelize } from "../config/db.js";
import { Op } from "sequelize";
export const controller = {
  createRequest: async (req, res) => {
    try {
      const { animal_id } = req.body;
      const user_id = req.user.id;

      if (!animal_id) {
        return res.status(400).send("Animal ID is required!");
      }

      const animal = await Animals.findByPk(animal_id);
      if (!animal) return res.status(404).send("Animal not found!");
      if (animal.status !== "Available") {
        return res
          .status(400)
          .send("This animal is not available for adoption.");
      }

      const existingRequest = await Adoption_requests.findOne({
        where: { user_id, animal_id },
      });

      if (existingRequest) {
        return res
          .status(409)
          .send("You have already sent a request for this animal.");
      }

      const request = await Adoption_requests.create({
        user_id,
        animal_id,
        status: "Pending",
      });

      return res.status(201).json(request);
    } catch (err) {
      return res.status(500).send(`Error creating request: ${err.message}`);
    }
  },

  getAllRequests: async (req, res) => {
    try {
      const requests = await Adoption_requests.findAll({
        include: [
          { model: Users, attributes: ["username", "email", "phonenumber"] },
          { model: Animals, attributes: ["name", "breed", "image_url"] },
        ],
      });
      return res.status(200).json(requests);
    } catch (err) {
      return res.status(500).send(`Error fetching requests: ${err.message}`);
    }
  },
  updateRequestStatus: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { status } = req.body;

      const request = await Adoption_requests.findByPk(id);
      if (!request) return res.status(404).send("Request not found!");

      if (request.status !== "Pending") {
        return res.status(400).json({ message: "Request already processed." });
      }
      if (!["Approved", "Rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value." });
      }
      const animal = await Animals.findByPk(request.animal_id);

      if (status === "Approved") {
        if (animal.status !== "Available") {
          return res.status(400).json({ message: "Animal already adopted." });
        }
        await Animals.update(
          { status: "Adopted" },
          { where: { id: request.animal_id }, transaction: t },
        );
        await Appointments.update(
          {
            status: "Cancelled",
          },
          {
            where: {
              animal_id: request.animal_id,
              status: "Scheduled",
            },
            transaction: t,
          },
        );
        await Adoption_history.create(
          {
            animal_id: request.animal_id,
            adopter_id: request.user_id,
            adoption_date: new Date(),
          },
          { transaction: t },
        );
        await Adoption_requests.update(
          { status: "Rejected" },
          {
            where: {
              animal_id: request.animal_id,
              status: "Pending",
              id: { [Op.ne]: request.id },
            },
            transaction: t,
          },
        );
      }

      request.status = status;
      await request.save({ transaction: t });

      await t.commit();
      return res.status(200).json(request);
    } catch (err) {
      if (t) await t.rollback();
      return res.status(500).send(`Error updating request: ${err.message}`);
    }
  },

  getMyRequests: async (req, res) => {
    try {
      const requests = await Adoption_requests.findAll({
        where: { user_id: req.user.id },
        include: [{ model: Animals, attributes: ["name", "status"] }],
      });
      return res.status(200).json(requests);
    } catch (err) {
      return res
        .status(500)
        .send(`Error fetching your requests: ${err.message}`);
    }
  },
};
