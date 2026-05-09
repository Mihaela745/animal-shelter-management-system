import {
  Animals,
  Appointments,
  Position,
  Rooms,
  Staff,
  Users,
} from "../models/index.js";
import { Op } from "sequelize";

const APPOINTMENT_HOURS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

function applyAppointmentDateRange(where, startDate, endDate) {
  if (startDate && endDate) {
    where.date = {
      [Op.between]: [
        new Date(`${startDate}T00:00:00`),
        new Date(`${endDate}T23:59:59`),
      ],
    };
    return;
  }

  if (startDate) {
    where.date = {
      [Op.gte]: new Date(`${startDate}T00:00:00`),
    };
  }

  if (endDate) {
    where.date = {
      ...(where.date || {}),
      [Op.lte]: new Date(`${endDate}T23:59:59`),
    };
  }
}

function buildDateRange(date) {
  return {
    [Op.between]: [
      new Date(`${date}T00:00:00`),
      new Date(`${date}T23:59:59`),
    ],
  };
}

async function getSchedulingResources() {
  const [rooms, eligibleStaff] = await Promise.all([
    Rooms.findAll({ attributes: ["id"] }),
    Staff.findAll({
      attributes: ["id"],
      include: [
        {
          model: Position,
          attributes: [],
          where: {
            title: {
              [Op.in]: ["Vet", "Caretaker"],
            },
          },
        },
      ],
    }),
  ]);

  return {
    roomIds: rooms.map((room) => room.id),
    staffIds: eligibleStaff.map((member) => member.id),
  };
}

async function getAvailableResourceIds(date, hour) {
  const { roomIds, staffIds } = await getSchedulingResources();

  if (!roomIds.length || !staffIds.length) {
    return { availableRoomIds: [], availableStaffIds: [] };
  }

  const scheduledAppointments = await Appointments.findAll({
    where: {
      date: buildDateRange(date),
      hour,
      status: "Scheduled",
    },
    attributes: ["room_id", "staff_id"],
  });

  const occupiedRoomIds = new Set(
    scheduledAppointments.map((appointment) => appointment.room_id),
  );
  const occupiedStaffIds = new Set(
    scheduledAppointments.map((appointment) => appointment.staff_id),
  );

  return {
    availableRoomIds: roomIds.filter((roomId) => !occupiedRoomIds.has(roomId)),
    availableStaffIds: staffIds.filter((staffId) => !occupiedStaffIds.has(staffId)),
  };
}

async function animalHasAppointmentAtHour(animal_id, date, hour) {
  const conflict = await Appointments.findOne({
    where: {
      animal_id,
      date: buildDateRange(date),
      hour,
      status: "Scheduled",
    },
  });

  return Boolean(conflict);
}

async function getAvailableHoursForAnimal(animal, date) {
  if (!animal || animal.status !== "Available") {
    return [];
  }

  const appointmentDate = new Date(date);
  const day = appointmentDate.getDay();

  if (day === 0 || day === 6) {
    return [];
  }

  const { roomIds, staffIds } = await getSchedulingResources();
  if (!roomIds.length || !staffIds.length) {
    return [];
  }

  const availableHours = [];

  for (const hour of APPOINTMENT_HOURS) {
    // eslint-disable-next-line no-await-in-loop
    const animalConflict = await animalHasAppointmentAtHour(animal.id, date, hour);
    if (animalConflict) {
      continue;
    }

    // eslint-disable-next-line no-await-in-loop
    const { availableRoomIds, availableStaffIds } = await getAvailableResourceIds(
      date,
      hour,
    );

    if (availableRoomIds.length > 0 && availableStaffIds.length > 0) {
      availableHours.push(hour);
    }
  }

  return availableHours;
}

export const controller = {
  createAppointment: async (req, res) => {
    try {
      const user_id = req.user.id;
      const { animal_id, date, hour } = req.body;

      if (!animal_id || !date || !hour) {
        return res.status(400).send("Toate câmpurile sunt obligatorii.");
      }

      const animal = await Animals.findByPk(animal_id);
      if (!animal) {
        return res.status(404).send("Animalul nu a fost găsit.");
      }

      if (animal.status !== "Available") {
        return res
          .status(400)
          .send("Poți crea programări doar pentru animalele disponibile.");
      }

      const appointmentDate = new Date(date);
      if (appointmentDate < new Date()) {
        return res.status(400).send("Nu poți crea o programare în trecut.");
      }

      const day = appointmentDate.getDay();
      if (day === 0 || day === 6) {
        return res
          .status(400)
          .send("Programările sunt permise doar de luni până vineri.");
      }

      const [hours, minutes] = hour.split(":").map(Number);
      if (Number.isNaN(hours) || Number.isNaN(minutes)) {
        return res.status(400).send("Format invalid pentru oră.");
      }

      if (hours < 8 || hours >= 18 || minutes !== 0) {
        return res
          .status(400)
          .send("Programările trebuie făcute între 08:00 și 18:00, doar la ore fixe.");
      }

      const animalConflict = await animalHasAppointmentAtHour(animal_id, date, hour);
      if (animalConflict) {
        return res.status(409).send("Animalul este deja programat la această oră.");
      }

      const userConflict = await Appointments.findOne({
        where: {
          user_id,
          date: buildDateRange(date),
          hour,
          status: "Scheduled",
        },
      });

      if (userConflict) {
        return res
          .status(409)
          .send("Ai deja o altă programare stabilită la această oră.");
      }

      const { availableRoomIds, availableStaffIds } = await getAvailableResourceIds(
        date,
        hour,
      );

      if (!availableRoomIds.length) {
        return res
          .status(409)
          .send("Nu există nicio cameră disponibilă pentru acest interval.");
      }

      if (!availableStaffIds.length) {
        return res
          .status(409)
          .send("Nu există personal disponibil pentru acest interval.");
      }

      const [selectedRoom, selectedStaff] = await Promise.all([
        Rooms.findByPk(availableRoomIds[0]),
        Staff.findByPk(availableStaffIds[0]),
      ]);

      if (!selectedRoom) {
        return res
          .status(409)
          .send("Nu există nicio cameră disponibilă pentru acest interval.");
      }

      if (!selectedStaff) {
        return res
          .status(500)
          .send("Nu există personal eligibil disponibil în sistem.");
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
        .send(`A apărut o eroare la crearea programării: ${err.message}`);
    }
  },

  getAllAppointments: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const where = {};

      applyAppointmentDateRange(where, startDate, endDate);

      const appointments = await Appointments.findAll({
        where,
        include: [
          { model: Users, attributes: ["id", "username", "email"] },
          { model: Animals, attributes: ["id", "name"] },
          { model: Staff, attributes: ["id", "name"] },
          { model: Rooms, attributes: ["id", "room_number"] },
        ],
        order: [["date", "ASC"], ["hour", "ASC"]],
      });

      return res.status(200).send(appointments);
    } catch (err) {
      return res.status(500).send(`Nu am putut încărca programările: ${err}`);
    }
  },

  getAppointmentByStaffId: async (req, res) => {
    try {
      const staffId = req.params.id;
      const { startDate, endDate } = req.query;
      const where = { staff_id: staffId };

      applyAppointmentDateRange(where, startDate, endDate);

      const appointments = await Appointments.findAll({
        where,
        include: [
          { model: Users, attributes: ["id", "username", "email"] },
          { model: Animals, attributes: ["id", "name"] },
          { model: Staff, attributes: ["id", "name"] },
          { model: Rooms, attributes: ["id", "room_number"] },
        ],
        order: [["date", "ASC"], ["hour", "ASC"]],
      });

      return res.status(200).json(appointments);
    } catch (err) {
      return res.status(500).send(
        `Nu am putut încărca programările pentru acest membru din personal: ${err.message}`,
      );
    }
  },

  updateAppointmentStatus: async (req, res) => {
    try {
      const appointmentId = req.params.id;
      const { status } = req.body;

      const appointment = await Appointments.findByPk(appointmentId);
      if (!appointment) {
        return res.status(404).send("Programarea nu a fost găsită.");
      }

      if (!["Completed", "Cancelled"].includes(status)) {
        return res.status(400).send("Valoare invalidă pentru status.");
      }

      if (appointment.status !== "Scheduled") {
        return res.status(400).send("Programarea a fost deja procesată.");
      }

      await appointment.update({ status });
      return res.status(200).json(appointment);
    } catch (err) {
      return res
        .status(500)
        .send(`Nu am putut actualiza programarea: ${err.message}`);
    }
  },

  deleteAppointment: async (req, res) => {
    try {
      const appointment = req.params.id;
      const deletedAppointment = await Appointments.destroy({
        where: { id: appointment },
      });

      if (deletedAppointment === 0) {
        return res.status(404).send("Programarea pentru ștergere nu a fost găsită.");
      }

      return res.status(200).send("Programarea a fost ștearsă.");
    } catch (err) {
      return res.status(500).send(`A apărut o eroare la ștergere: ${err}`);
    }
  },

  getAppointmentsByUserId: async (req, res) => {
    try {
      const userId = req.user.id;
      if (!userId) {
        return res.status(400).send("ID-ul utilizatorului este obligatoriu.");
      }

      const appointments = await Appointments.findAll({
        where: { user_id: userId, status: "Scheduled" },
        order: [["date", "ASC"], ["hour", "ASC"]],
      });

      return res.status(200).send(appointments);
    } catch (err) {
      return res
        .status(500)
        .send(`Nu am putut încărca programările utilizatorului: ${err}`);
    }
  },

  getAppointmentsByAnimalId: async (req, res) => {
    try {
      const animalId = req.params.id;

      const appointments = await Appointments.findAll({
        where: { animal_id: animalId, status: "Scheduled" },
        include: [
          { model: Users, attributes: ["username"] },
          { model: Staff, attributes: ["id", "name"] },
          { model: Rooms, attributes: ["room_number"] },
        ],
        order: [["date", "ASC"], ["hour", "ASC"]],
      });

      return res.status(200).json(appointments);
    } catch (err) {
      return res
        .status(500)
        .send(`Nu am putut încărca programările animalului: ${err.message}`);
    }
  },

  getCalendarAvailability: async (req, res) => {
    try {
      const { animal_id } = req.query;
      if (!animal_id) {
        return res.status(400).send("ID-ul animalului este obligatoriu.");
      }

      const animal = await Animals.findByPk(animal_id, {
        attributes: ["id", "status"],
      });

      if (!animal || animal.status !== "Available") {
        return res.json({ availableDates: [] });
      }

      const today = new Date();
      const endDate = new Date();
      endDate.setMonth(today.getMonth() + 2);
      const availableDates = [];

      for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
        const currentDate = new Date(d);
        const day = currentDate.getDay();

        if (day === 0 || day === 6) {
          continue;
        }

        const dateStr = currentDate.toISOString().split("T")[0];
        // eslint-disable-next-line no-await-in-loop
        const availableHours = await getAvailableHoursForAnimal(animal, dateStr);

        if (availableHours.length > 0) {
          availableDates.push(dateStr);
        }
      }

      return res.json({ availableDates });
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  getAvailableSlots: async (req, res) => {
    try {
      const { animal_id, date } = req.query;

      if (!animal_id || !date) {
        return res.status(400).send("ID-ul animalului și data sunt obligatorii.");
      }

      const animal = await Animals.findByPk(animal_id, {
        attributes: ["id", "status"],
      });

      if (!animal || animal.status !== "Available") {
        return res.json({ availableHours: [] });
      }

      const appointmentDate = new Date(date);
      const today = new Date();

      if (appointmentDate < today) {
        return res.status(400).send("Data nu poate fi în trecut.");
      }

      const availableHours = await getAvailableHoursForAnimal(animal, date);
      return res.json({ availableHours });
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
};
