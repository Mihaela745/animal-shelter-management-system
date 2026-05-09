import { Op } from "sequelize";
import {
  Adoption_requests,
  Animals,
  Appointments,
  Boxes,
  Medical_files,
  Medications,
  Rooms,
  Species,
  Staff,
  Users,
} from "../models/index.js";

function applyDateRange(where, field, startDate, endDate) {
  if (startDate && endDate) {
    where[field] = { [Op.between]: [startDate, endDate] };
    return;
  }

  if (startDate) {
    where[field] = { [Op.gte]: startDate };
  }

  if (endDate) {
    where[field] = { [Op.lte]: endDate };
  }
}

export const controller = {
  getAnimalsReport: async (req, res) => {
    try {
      const { status, species_id, startDate, endDate } = req.query;
      const where = {};

      if (status) {
        where.status = status;
      }

      if (species_id) {
        where.species_id = Number(species_id);
      }

      applyDateRange(where, "date_added", startDate, endDate);

      const animals = await Animals.findAll({
        where,
        include: [Species, Boxes, Medical_files],
        order: [["date_added", "DESC"], ["id", "DESC"]],
      });

      return res.json(animals);
    } catch (error) {
      console.error("Error fetching animal reports:", error);
      return res
        .status(500)
        .json({ message: "Nu s-a putut genera raportul pentru animale." });
    }
  },

  getAdoptionRequestsReport: async (req, res) => {
    try {
      const { status, species_id, startDate, endDate } = req.query;
      const where = {};
      const animalWhere = {};

      if (status) {
        where.status = status;
      }

      if (species_id) {
        animalWhere.species_id = Number(species_id);
      }

      applyDateRange(where, "request_date", startDate, endDate);

      const requests = await Adoption_requests.findAll({
        where,
        include: [
          {
            model: Animals,
            where: animalWhere,
            required: Boolean(species_id),
            include: [Species, Boxes],
          },
          {
            model: Users,
            attributes: ["id", "username", "email", "phonenumber"],
          },
        ],
        order: [["request_date", "DESC"], ["id", "DESC"]],
      });

      return res.json(requests);
    } catch (error) {
      console.error("Error fetching adoption request reports:", error);
      return res.status(500).json({
        message: "Nu s-a putut genera raportul pentru cererile de adoptie.",
      });
    }
  },

  getAppointmentsReport: async (req, res) => {
    try {
      const { status, species_id, startDate, endDate } = req.query;
      const where = {};
      const animalWhere = {};

      if (status) {
        where.status = status;
      }

      if (species_id) {
        animalWhere.species_id = Number(species_id);
      }

      applyDateRange(where, "date", startDate, endDate);

      const appointments = await Appointments.findAll({
        where,
        include: [
          {
            model: Animals,
            where: animalWhere,
            required: Boolean(species_id),
            include: [Species, Boxes],
          },
          {
            model: Users,
            attributes: ["id", "username", "email"],
          },
          {
            model: Staff,
            attributes: ["id", "name", "email"],
          },
          {
            model: Rooms,
            attributes: ["id", "room_number"],
          },
        ],
        order: [["date", "DESC"], ["hour", "DESC"]],
      });

      return res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointment reports:", error);
      return res
        .status(500)
        .json({ message: "Nu s-a putut genera raportul pentru programari." });
    }
  },

  getMedicationsReport: async (req, res) => {
    try {
      const { active, species_id, startDate, endDate } = req.query;
      const where = {};
      const animalWhere = {};

      if (species_id) {
        animalWhere.species_id = Number(species_id);
      }

      if (active === "true") {
        const today = new Date().toISOString().slice(0, 10);
        where.start_date = { [Op.lte]: today };
        where[Op.or] = [{ end_date: null }, { end_date: { [Op.gte]: today } }];
      }

      if (startDate && endDate) {
        where[Op.and] = [
          ...(where[Op.and] || []),
          { start_date: { [Op.lte]: endDate } },
          {
            [Op.or]: [{ end_date: null }, { end_date: { [Op.gte]: startDate } }],
          },
        ];
      } else if (startDate) {
        where[Op.and] = [
          ...(where[Op.and] || []),
          {
            [Op.or]: [{ end_date: null }, { end_date: { [Op.gte]: startDate } }],
          },
        ];
      } else if (endDate) {
        where[Op.and] = [
          ...(where[Op.and] || []),
          { start_date: { [Op.lte]: endDate } },
        ];
      }

      const medications = await Medications.findAll({
        where,
        include: [
          {
            model: Staff,
            attributes: ["id", "name", "email"],
          },
          {
            model: Medical_files,
            include: [
              {
                model: Animals,
                where: animalWhere,
                required: Boolean(species_id),
                include: [Species, Boxes],
              },
            ],
          },
        ],
        order: [["start_date", "DESC"], ["id", "DESC"]],
      });

      return res.json(medications);
    } catch (error) {
      console.error("Error fetching medication reports:", error);
      return res.status(500).json({
        message: "Nu s-a putut genera raportul pentru tratamente active.",
      });
    }
  },

  getBoxesOccupancyReport: async (req, res) => {
    try {
      const { species_id } = req.query;
      const where = {};

      if (species_id) {
        where.species_id = Number(species_id);
      }

      const boxes = await Boxes.findAll({
        where,
        include: [Species],
        order: [["box_number", "ASC"]],
      });

      const occupancy = boxes.map((box) => {
        const capacity = Number(box.capacity || 0);
        const currentOccupancy = Number(box.current_occupancy || 0);
        const occupancyRate =
          capacity > 0 ? Number(((currentOccupancy / capacity) * 100).toFixed(2)) : 0;

        return {
          ...box.toJSON(),
          available_places: Math.max(capacity - currentOccupancy, 0),
          occupancy_rate: occupancyRate,
          occupancy_label: `${occupancyRate}%`,
        };
      });

      return res.json(occupancy);
    } catch (error) {
      console.error("Error fetching box occupancy reports:", error);
      return res.status(500).json({
        message: "Nu s-a putut genera raportul pentru gradul de ocupare.",
      });
    }
  },
};
