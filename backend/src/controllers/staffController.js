import { Staff } from "../models/Staff.js";
import { Position } from "../models/Position.js";

export const createStaff = async (req, res) => {
  try {
    const { name, email, position_id, phone_number } = req.body;
    if (!name || !email || !position_id || !phone_number) {
      return res.status(400).json({ error: "All fields must be completed!" });
    }

    const positionExists = await Position.findByPk(position_id);
    if (!positionExists) {
      return res.status(404).json({ error: "Position doesn't exist!" });
    }
    const newStaff = await Staff.create({
      name,
      email,
      position_id,
      phone_number,
    });
    return res.status(201).json("Staff member has been added!");
  } catch (error) {
    console.log("error creating staff");
    return res.status(500).json({ error: "Failed to create staff member" });
  }
};

export const getAllStaf = async (req, res) => {
  try {
    const staffMembers = await Staff.findAll({
      include: [
        {
          model: Position,
          attributes: ["title", "description"],
        },
      ],
      attributes: ["id", "name", "email", "phonenumber"],
    });
    return res.status(200).json(staffMembers);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to feetch full staff list.",
      details: error.message,
    });
  }
};

export const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findByPk(req.params.id, {
      include: [
        {
          model: Position,
          attributes: ["title", "description"],
        },
      ],
      attributes: ["id", "name", "email", "phonenumber"],
    });
    if (!staff) {
      return res.status(404).json({
        error: "Staff member does not exist",
        details: error.message,
      });
    } else return res.status(200).json(staff);
  } catch (error) {
    console.log("Can not find the staff memeber");
    return res
      .status(500)
      .json({ error: "Failled to fetch staff member", details: error.message });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const staffId = req.params.id;
    const updateData = req.body;

    if (updateData.position_id) {
      const positionExists = await Position.findByPk(updateData.position_id);
      if (!positionExists) {
        return res.status(404).json({
          error: `Position with ID ${updateData.position_id} not found.`,
        });
      }
    }
    const [updatedRows] = await Staff.update(updateData, {
      where: { id: req.params.id },
    });
    if (updatedRows === 0) {
      return res
        .status(404)
        .json({ error: "Staff member not found or no changes applied!" });
    }
    const updatedStaff = await Staff.findByPk(staffId, {
      include: [{ model: Position, attributes: ["title"] }],
    });

    return res.status(200).json({
      message: "Staff member updated successfully.",
      staff: updatedStaff,
    });
  } catch (error) {
    console.log("Failed to modify staff member!");
    return res.status(500).json({ error: "Failed to modify staff member!" });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const deletedRows = await Staff.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (deletedRows === 0)
      return res.status(404).json({ error: "Staff member not found." });
    return res
      .status(200)
      .json({ message: "Staff member deleted successfully" });
  } catch (error) {
    console.error("Error deleting staff member:", error);
    return res.status(500).json({
      error: "Failed to delete staff member.",
      details: error.message,
    });
  }
};
