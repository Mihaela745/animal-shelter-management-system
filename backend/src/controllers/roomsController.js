import { Rooms, Appointments} from "../models/index.js";

export const roomSeed = async () => {
  const roomsData = [
    { room_number: "R101" },
    { room_number: "R102" },
    { room_number: "R201" },
  ];

  await Promise.all(
    roomsData.map((data) => {
      return Rooms.findOrCreate({
        where: { room_number: data.room_number },
        defaults: data,
      });
    }),
  );
};

export const controller = {
  createRoom: async (req, res) => {
    try {
      const { room_number } = req.body;
      if (!room_number) {
        return res.status(400).send("Toate câmpurile sunt obligatorii.");
      }
      const existing = await Rooms.findOne({ where: { room_number } });
      if (existing) {
        return res.status(409).send("Camera există deja.");
      }
      const newRoom = await Rooms.create({ room_number });
      return res.status(201).send(newRoom);
    } catch (error) {
      console.log("error creating room");
      return res.status(500).send(`A apărut o eroare la creare: ${error}`);
    }
  },
  getAllRooms: async (req, res) => {
    try {
      const rooms = await Rooms.findAll({ attributes: ["id", "room_number"] });
      return res.status(200).send(rooms);
    } catch (error) {
      return res.status(500).send(`A apărut o eroare la încărcare: ${error}`);
    }
  },
  getRoomById: async (req, res) => {
    try {
      const room = await Rooms.findByPk(req.params.id, {
        attributes: ["id", "room_number"],
      });
      if (!room) {
        return res.status(404).send("Camera nu există.");
      }
      return res.status(200).send(room);
    } catch (error) {
      console.log("Can not find the room");
      return res.status(500).send(`Nu am putut încărca camera: ${error}`);
    }
  },
  updateRoom: async (req, res) => {
    try {
      const { room_number } = req.body;

      if (!room_number) {
        return res.status(400).send("Numărul camerei este obligatoriu.");
      }

      const room = await Rooms.findByPk(req.params.id);
      if (!room) {
        return res.status(404).send("Camera nu a fost găsită.");
      }

      room.room_number = room_number;
      await room.save();

      return res.status(200).json(room);
    } catch (error) {
      console.log("Failed to modify room!");

      return res.status(500).send(`Nu am putut modifica camera: ${error}`);
    }
  },
  deleteRoom: async (req, res) => {
    try {
      const roomId = req.params.id;

      const room = await Rooms.findByPk(roomId);
      if (!room) {
        return res.status(404).send("Camera nu a fost găsită.");
      }

      const hasAppointments = await Appointments.count({
        where: { room_id: roomId },
      });

      if (hasAppointments > 0) {
        return res
          .status(400)
          .send("Nu poți șterge o cameră care are programări existente.");
      }

      await room.destroy();

      return res.status(200).send("Camera a fost ștearsă cu succes.");
    } catch (error) {
      console.error("Error deleting room", error);
      return res.status(500).send(`A apărut o eroare la ștergere: ${error}`);
    }
  },
};
