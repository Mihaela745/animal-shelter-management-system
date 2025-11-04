import { Boxes } from "../models/Boxes.js";

export const createBoxes = async (req, res) => {
  try {
    const { box_number, capacity } = req.body;
    if (!box_number || !capacity) {
      return res.status(404).json({ error: "all fields must be completed!" });
    }
    const newBox = await Boxes.create({
      box_number,
      capacity,
    });
    return res.status(201).json(newBox);
  } catch (error) {
    console.log("Error creating bocstaff");
    return res.status(500).json({ error: "Failed to create box member" });
  }
};

export const getAllBoxes = async (req, res) => {
  try {
    const boxes = await Boxes.findAll({
      attributes: ["id", "box_number", "capacity", "current_occupancy"],
    });
    return res.status(200).json(boxes);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch all boxes.",
      details: error.message,
    });
  }
};

export const getBoxById = async (req, res) => {
  try {
    const box = await Boxes.findByPk(req.params.id, {
      attributes: ["id", "box_number", "capacity", "current_occupancy"],
    });
    if (box) {
      return res.status(200).json(box);
    } else
      return res.status(404).json({
        error: "Box does not exist",
      });
  } catch (error) {
    console.log("Can not find the box");
    return res.status(500).json({
      error: "Failled to fetch box",
      details: error.message,
    });
  }
};

export const deleteBox = async (req, res) => {
  try {
    const deletedRows = await Boxes.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (deletedRows === 0)
      return res.status(404).json({ error: "Box not found." });
    return res.status(200).json({ message: "Box deleted succesfully!" });
  } catch (error) {
    console.log("Can not delete the box");
    return res.status(500).json({
      error: "Failled to delete the box",
      details: error.message,
    });
  }
};

export const updateBox = async (req, res) => {
  try {
    const boxId = req.params.id;
    const updateData = req.body;
    const [updatedRows] = await Boxes.update(updateData, {
      where: {
        id: boxId,
      },
    });
    if (updatedRows === 0) {
      return res.status(404).json({ error: "No boxes where updated" });
    }
    const updatedBox = await Boxes.findByPk(boxId);
    return res
      .status(200)
      .json({ message: "Box was updated!", box: updatedBox });
  } catch (error) {
    console.log("Failed to modify box!");
    return res.status(500).json({ error: "Failed to modify box!" });
  }
};
