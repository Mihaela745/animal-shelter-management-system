import { Rooms } from "../models/Rooms.js";

export const createRoom = async (req, res) => {
  try {
    const { room_number } = req.body;
    if (!room_number) {
      return res.status(400).json({ error: "All fields must be completed!" });
    }
    const newRoom = await Room.create({ room_number });
    return res.status(201).json(newRoom);
  } catch (error) {
    console.log("error creating room");
    return res.status(500).json({ error: "Failed to create room!" });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Rooms.findAll({ attributes: ["id", "room_number"] });
    return res.status(200).json({ rooms });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to feetch full room list.",
      details: error.message,
    });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await Rooms.findByPk(req.params.id, {
      attributes: ["id", "room_number"],
    });
    if (!room) {
      return res.status(404).json({
        error: "Room_number does not exist",
        details: error.message,
      });
    }
    return res.status(200).json(room);
  } catch (error) {
    console.log("Can not find the room");
    return res.status(500).json({
      error: "Failled to fetch the room",
      details: error.message,
    });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    const updateData = req.body;

    const [updatedRows] = await Rooms.update(updateData, {
      where: { id: req.params.id },
    });
    if (updatedRows === 0) {
      return res
        .status(404)
        .json({ error: "Room not found or no changes applied!" });
    }
    const updatedRoom = await Rooms.findByPk(roomId, {});
    return res.status(200).json({
      message: "Room updated succesfully",
      room: updatedRoom,
    });
  } catch (error) {
    console.log("Failed to modify room!");

    return res.status(500).json({ error: "Failed to modify room!" });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const deletedRooms = await Rooms.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (deletedRooms === 0) {
      return res.status(404).json({ error: "Room not found" });
    }
    return res.status(200).json({ message: "Room has been deleted!" });
  } catch (error) {
    console.error("Error deleting room", error);
    return res.status(500).json({
      error: "Failed to delete room",
      details: error.message,
    });
  }
};
