import { Boxes } from "../models/Boxes.js";

export const seedBoxes=async()=>{
  const boxesData = [
    { box_number: "D-B01", capacity: 10, current_occupancy: 0, species_id: 1 },
    { box_number: "D-B02", capacity: 10, current_occupancy: 0, species_id: 1 },
    { box_number: "D-B03", capacity: 5, current_occupancy: 0, species_id: 1 },
    { box_number: "D-B04", capacity: 5, current_occupancy: 0, species_id: 1 },
     { box_number: "D-B05", capacity: 4, current_occupancy: 0, species_id: 1 },
    { box_number: "D-B06", capacity: 2, current_occupancy: 0, species_id: 1 },

    { box_number: "C-B01", capacity: 6, current_occupancy: 0, species_id: 2 },
    { box_number: "C-B02", capacity: 5, current_occupancy: 0, species_id: 2 },
    { box_number: "C-B03", capacity: 7, current_occupancy: 0, species_id: 2 },
    { box_number: "C-B02", capacity: 3, current_occupancy: 0, species_id: 2 },
    { box_number: "C-B03", capacity: 5, current_occupancy: 0, species_id: 2 },

    { box_number: "I-B01", capacity: 1, current_occupancy: 0, species_id: 1 },
    { box_number: "I-B02", capacity: 1, current_occupancy: 0, species_id: 2 },
  ];

  await Promise.all(boxesData.map(data=>{
    return Boxes.findOrCreate({
      where:{box_number:data.box_number},
      defaults:data
    })
  }))
}

export const controller = {
  createBoxes: async (req, res) => {
    try {
      const { box_number, capacity,species_id} = req.body;
      if (!box_number || !capacity||!species_id) {
        return res.status(404).send(`All fields must be completed`);
      }
      const newBox = await Boxes.create({
        box_number,
        capacity,
        species_id
      });
      return res.status(201).send(newBox);
    } catch (error) {
      return res.status(500).send(`Failed creating box: ${error}`);
    }
  },
  getAllBoxes: async (req, res) => {
    try {
      const boxes = await Boxes.findAll();
      return res.status(200).send(boxes);
    } catch (error) {
      return res.status(500).send(`Failed fetching boxes: ${error}`);
    }
  },
  getBoxById: async (req, res) => {
    try {
      const box = await Boxes.findByPk(req.params.id);
      if (box) {
        return res.status(200).send(box);
      } else
        return res.status(404).send(`Box doesn't exists!`)
    } catch (error) {
       return res.status(500).send(`Failed fetching box: ${error}`);
    }
  },
  deleteBox: async (req, res) => {
    try {
      const deletedRows = await Boxes.destroy({
        where: {
          id: req.params.id,
        },
      });
      if (deletedRows === 0)
        return res.status(404).send(`Box not found!`);
      return res.status(200).send( `Deletion succesfull!`);
    } catch (error) {
      return res.status(500).send(`Failed deleting box: ${error}`);
    }
  },
  updateBox: async (req, res) => {
    try {
      const boxId = req.params.id;
      const updateData = req.body;
      const [updatedRows] = await Boxes.update(updateData, {
        where: {
          id: boxId,
        },
      });
      if (updatedRows === 0) {
        return res.status(404).send(`No boxes where updated!`);
      }
      const updatedBox = await Boxes.findByPk(boxId);
      return res
        .status(200)
        .send(updatedBox);
    } catch (error) {
     return res.status(500).send(`Failed updating box: ${error}`);
    }
  },
};
