import {
  Animals,
  Appointments,
  Rooms,
  Staff,
  Position,
  Users,
} from "../models/index.js";
import { Op } from "sequelize";
export const controller = {
  createAppointment: async (req, res) => {
    try {
      const user_id = req.user.id;
      const { animal_id, date, hour } = req.body;

      if (!animal_id || !date || !hour) {
        return res.status(400).send("Must complete all fields!");
      }
      const animal = await Animals.findByPk(animal_id);
      if (!animal) {
        return res.status(404).send("Animal not found!");
      }

      if (animal.status === "Adopted") {
        return res
          .status(400)
          .send("Cannot create appointment for an adopted animal!");
      }
      const appointmentDate = new Date(date);

      if (appointmentDate < new Date()) {
        return res.status(400).send("Cannot create appointment in the past!");
      }

      const day = appointmentDate.getDay();
      if (day === 0 || day === 6) {
        return res
          .status(400)
          .send("Appointments are allowed only from Monday to Friday!");
      }
      const [hours, minutes] = hour.split(":").map(Number);

      if (isNaN(hours) || isNaN(minutes)) {
        return res.status(400).send("Invalid hour format!");
      }

      if (hours < 8 || hours >= 18 || minutes !== 0) {
        return res
          .status(400)
          .send(
            "Appointments must be between 08:00 and 18:00, full hours only!",
          );
      }
      const animalConflict = await Appointments.findOne({
        where: {
          animal_id,
          date: {
            [Op.between]: [
              new Date(`${date}T00:00:00`),
              new Date(`${date}T23:59:59`),
            ],
          },
          hour,
          status: "Scheduled",
        },
      });

      if (animalConflict) {
        return res.status(409).send("Animal is already booked at this time!");
      }
      const availableRooms = await Rooms.findAll();
      let selectedRoom = null;

      for (const room of availableRooms) {
        const conflict = await Appointments.findOne({
          where: {
            room_id: room.id,
            date: {
              [Op.between]: [
                new Date(`${date}T00:00:00`),
                new Date(`${date}T23:59:59`),
              ],
            },
            hour,
            status: "Scheduled",
          },
        });

        if (!conflict) {
          selectedRoom = room;
          break;
        }
      }

      if (!selectedRoom) {
        return res.status(409).send("No available room for this time slot!");
      }
      const availableStaff = await Staff.findAll({
        include: [
          {
            model: Position,
            where: {
              title: {
                [Op.in]: ["Vet", "Caretaker"],
              },
            },
          },
        ],
      });

      if (!availableStaff.length) {
        return res.status(500).send("No eligible staff found in system!");
      }

      let selectedStaff = null;

      for (const staff of availableStaff) {
        const conflict = await Appointments.findOne({
          where: {
            staff_id: staff.id,
            date: {
              [Op.between]: [
                new Date(`${date}T00:00:00`),
                new Date(`${date}T23:59:59`),
              ],
            },
            hour,
            status: "Scheduled",
          },
        });

        if (!conflict) {
          selectedStaff = staff;
          break;
        }
      }

      if (!selectedStaff) {
        return res.status(409).send("No available staff for this time slot!");
      }
      const appointment = await Appointments.create({
        user_id,
        staff_id: selectedStaff.id,
        animal_id,
        room_id: selectedRoom.id,
        date,
        hour,
        status: "Scheduled",
      });

      return res.status(201).json(appointment);
    } catch (err) {
      return res
        .status(500)
        .send(`Error while creating appointment: ${err.message}`);
    }
  },

  getAllAppointments: async (req, res) => {
    try {
      const appointments = await Appointments.findAll({
        include: [
          { model: Users, attributes: ["username"] },
          { model: Animals, attributes: ["name"] },
          { model: Staff, attributes: ["id"] },
          { model: Rooms, attributes: ["room_number"] },
        ],
      });
      return res.status(200).send(appointments);
    } catch (err) {
      return res.status(500).send(`Couldn't fetch appointments: ${err}`);
    }
  },
  getAppointmentByStaffId: async (req, res) => {
    try {
      const staffId = req.params.id;

      const appointments = await Appointments.findAll({
        where: { staff_id: staffId, status: "Scheduled" },
        include: [
          { model: Users, attributes: ["username", "email"] },
          { model: Animals, attributes: ["name"] },
          { model: Rooms, attributes: ["room_number"] },
        ],
        order: [
          ["date", "ASC"],
          ["hour", "ASC"],
        ],
      });

      return res.status(200).json(appointments);
    } catch (err) {
      return res
        .status(500)
        .send(`Couldn't fetch appointments by staff id: ${err.message}`);
    }
  },
  updateAppointmentStatus: async (req, res) => {
    try {
      const appointmentId = req.params.id;
      const { status } = req.body;

      const appointment = await Appointments.findByPk(appointmentId);

      if (!appointment) {
        return res.status(404).send("Appointment not found!");
      }

      if (!["Completed", "Cancelled"].includes(status)) {
        return res.status(400).send("Invalid status value!");
      }

      if (appointment.status !== "Scheduled") {
        return res.status(400).send("Appointment already processed!");
      }

      await appointment.update({ status });

      return res.status(200).json(appointment);
    } catch (err) {
      return res
        .status(500)
        .send(`Couldn't update appointment: ${err.message}`);
    }
  },
  deleteAppointment: async (req, res) => {
    try {
      const appointment = req.params.id;
      const deletedAppointment = await Appointments.destroy({
        where: { id: appointment },
      });
      if (deletedAppointment === 0)
        return res.status(404).send(`Appointment not found to be deleted!`);
      return res.status(200).send(`Appointment has been deleted!`);
    } catch (err) {
      return res.status(500).send(`Error at deletion: ${err}`);
    }
  },
  getAppointmentsByUserId: async (req, res) => {
    try {
      const userId = req.user.id;

      if (!userId) {
        return res.status(400).send("User id is required!");
      }

      const appointments = await Appointments.findAll({
        where: { user_id: userId, status: "Scheduled" },
        order: [
          ["date", "ASC"],
          ["hour", "ASC"],
        ],
      });

      return res.status(200).send(appointments);
    } catch (err) {
      return res
        .status(500)
        .send(`Couldn't fetch appointments by user id: ${err}`);
    }
  },
  getAppointmentsByAnimalId: async (req, res) => {
    try {
      const animalId = req.params.id;

      const appointments = await Appointments.findAll({
        where: { animal_id: animalId, status: "Scheduled" },
        include: [
          { model: Users, attributes: ["username"] },
          { model: Staff, attributes: ["id"] },
          { model: Rooms, attributes: ["room_number"] },
        ],
        order: [
          ["date", "ASC"],
          ["hour", "ASC"],
        ],
      });

      return res.status(200).json(appointments);
    } catch (err) {
      return res
        .status(500)
        .send(`Couldn't fetch appointments by animal id: ${err.message}`);
    }
  },
};
