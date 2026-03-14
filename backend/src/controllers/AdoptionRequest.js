import { Animals, Appointments, Users, Species } from "../models/index.js";
import { Adoption_requests } from "../models/index.js";
import { Adoption_history } from "../models/index.js";
import { sequelize } from "../config/db.js";
import { Op } from "sequelize";
import { sendEmail } from "../utils/sendEmail.js";

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

      const request = await Adoption_requests.findByPk(id, { transaction: t });
      if (!request) {
        await t.rollback();
        return res.status(404).send("Request not found!");
      }

      if (request.status !== "Pending") {
        await t.rollback();
        return res.status(400).json({ message: "Request already processed." });
      }

      if (!["Approved", "Rejected"].includes(status)) {
        await t.rollback();
        return res.status(400).json({ message: "Invalid status value." });
      }

      const animal = await Animals.findByPk(request.animal_id, {
        transaction: t,
      });

      if (status === "Approved") {
        if (animal.status !== "Available") {
          await t.rollback();
          return res.status(400).json({ message: "Animal already adopted." });
        }

        await Animals.update(
          { status: "Adopted" },
          { where: { id: request.animal_id }, transaction: t },
        );

        await Appointments.update(
          { status: "Cancelled" },
          {
            where: { animal_id: request.animal_id, status: "Scheduled" },
            transaction: t,
          },
        );
        console.log("Creating history:", {
          animal_id: request.animal_id,
          adopter_id: request.user_id,
        });
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

      await Adoption_requests.update(
        { status },
        { where: { id: request.id }, transaction: t },
      );

      await t.commit();

      const updatedRequest = await Adoption_requests.findByPk(id, {
        include: [
          { model: Users, attributes: ["username", "email", "phonenumber"] },
          { model: Animals, attributes: ["name", "breed", "image_url"] },
        ],
      });

      res.status(200).json(updatedRequest);

      try {
        const animalData = await Animals.findByPk(request.animal_id);
        const approvedUser = await Users.findByPk(request.user_id);

        if (status === "Approved") {
          await sendEmail(
            approvedUser.email,
            "Adoption Approved!",
            `<h2>Congratulations</h2>
             <p>Your adoption request for <b>${animalData.name}</b> has been approved.</p>
             <p>Please contact the shelter for pickup details.</p>`,
          );

          const rejectedRequests = await Adoption_requests.findAll({
            where: { animal_id: request.animal_id, status: "Rejected" },
            include: [{ model: Users }],
          });

          await Promise.all(
            rejectedRequests.map((r) =>
              sendEmail(
                r.User.email,
                "Adoption Request Update",
                `<h3>Update for ${animalData.name}</h3>
                 <p>We are sorry, but your adoption request was not approved.</p>`,
              ),
            ),
          );

          const cancelledAppointments = await Appointments.findAll({
            where: { animal_id: request.animal_id, status: "Cancelled" },
            include: [{ model: Users }],
          });

          await Promise.all(
            cancelledAppointments.map((app) =>
              sendEmail(
                app.User.email,
                "Appointment Cancelled",
                `<h3>Appointment Cancelled</h3>
                 <p>Your appointment for <b>${animalData.name}</b> was cancelled because the animal has been adopted.</p>`,
              ),
            ),
          );
        } else if (status === "Rejected") {
          await sendEmail(
            approvedUser.email,
            "Adoption Request Rejected",
            `<h3>Adoption Request Update</h3>
             <p>We are sorry, but your adoption request for <b>${animalData.name}</b> has been rejected.</p>
             <p>You can explore other animals available for adoption.</p>`,
          );
        }
      } catch (emailErr) {
        console.error("Email error (non-critical):", emailErr.message);
      }
    } catch (err) {
      if (!t.finished) {
        await t.rollback();
      }
      console.error("updateRequestStatus error:", err.message);
      return res.status(500).send(`Error updating request: ${err.message}`);
    }
  },

  getMyRequests: async (req, res) => {
    try {
      const requests = await Adoption_requests.findAll({
        where: { user_id: req.user.id },
        include: [
          {
            model: Animals,
            attributes: ["name", "status"],
            include: [{ model: Species, attributes: ["name"] }],
          },
        ],
      });
      return res.status(200).json(requests);
    } catch (err) {
      return res
        .status(500)
        .send(`Error fetching your requests: ${err.message}`);
    }
  },
};
