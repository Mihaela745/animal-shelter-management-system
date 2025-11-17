import { Rooms } from "../models/Rooms.js";

export const roomSeed=async()=>{
  const roomsData = [
        { room_number: "R101" }, 
        { room_number: "R102" }, 
        { room_number: "R201" }  
    ];
    
    await Promise.all(
        roomsData.map(data => {
            return Rooms.findOrCreate({
                where: { room_number: data.room_number },
                defaults: data
            });
        })
    );
}


export const controller = {
  createRoom: async (req, res) => {
    try {
      const { room_number } = req.body;
      if (!room_number) {
        return res.status(400).send("All fields must be completed!");
      }
      const newRoom = await Rooms.create({ room_number });
      return res.status(201).send(newRoom);
    } catch (error) {
      console.log("error creating room");
      return res.status(500).send(`Error while creating:${error}`)
    }
  },
  getAllRooms: async (req, res) => {
    try {
      const rooms = await Rooms.findAll({ attributes: ["id", "room_number"] });
      return res.status(200).send(rooms );
    } catch (error) {
      return res.status(500).send(`Error while fetching: ${error}`);
    }
  },
  getRoomById: async (req, res) => {
    try {
      const room = await Rooms.findByPk(req.params.id, {
        attributes: ["id", "room_number"],
      });
      if (!room) {
        return res.status(404).send(`Room number doesn't exist!`);
      }
      return res.status(200).send(room);
    } catch (error) {
      console.log("Can not find the room");
      return res.status(500).send(`Failed to fetch room:${error}`);
    }
  },
  updateRoom: async (req, res) => {
    try {
      const roomId = req.params.id;
      const updateData = req.body;

      const [updatedRows] = await Rooms.update(updateData, {
        where: { id: req.params.id },
      });
      if (updatedRows === 0) {
        return res
          .status(404)
          .send(`No changes where applied`);
      }
      const updatedRoom = await Rooms.findByPk(roomId, {});
      return res.status(200).send(updatedRoom);
    } catch (error) {
      console.log("Failed to modify room!");

      return res.status(500).send(`'Failed to modify Room:${error}'`);
    }
  },
  deleteRoom: async (req, res) => {
    try {
      const deletedRooms = await Rooms.destroy({
        where: {
          id: req.params.id,
        },
      });
      if (deletedRooms === 0) {
        return res.status(404).send(`Room not found`);
      }
      return res.status(200).send('Rppm has been deleted!');
    } catch (error) {
      console.error("Error deleting room", error);
      return res.status(500).send(`Error while deleting:${error}`);
    }
  },
};
