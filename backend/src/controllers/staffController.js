import { Staff } from "../models/Staff.js";
import { Position } from "../models/Position.js";

export const controller = {
  createStaff: async (req, res) => {
    try {
      const { name, email, position_id, phone_number } = req.body;
      if (!name || !email || !position_id || !phone_number) {
        return res.status(400).send(`All fields must be completed`);
      }

      const positionExists = await Position.findByPk(position_id);
      if (!positionExists) {
        return res.status(404).send(`Position doesn't exist!`);
      }
      const newStaff = await Staff.create({
        name,
        email,
        position_id,
        phone_number,
      });
      return res.status(201).send(newStaff);
    } catch (error) {
      console.log("error creating staff");
      return res.status(500).send(`Failed while creating staff :${error}`);
    }
  },
  getAllStaf: async (req, res) => {
    try {
      const staffMembers = await Staff.findAll();
      return res.status(200).send(staffMembers);
    } catch (error) {
            return res
              .status(500)
              .send(`Failed to fetch staff : ${error}`);

    }
  },
  getStaffById: async (req, res) => {
    try {
      const staff = await Staff.findByPk(req.params.id);
      if (!staff) {
        return res.status(404).send("Staff doesnt exist");
      } else return res.status(200).send(staff);
    } catch (error) {
            return res
              .status(500)
              .send(`Failed to fetch staff : ${error}`);

    }
  },
  updateStaff: async (req, res) => {
    try {
      const staffId = req.params.id;
      const updateData = req.body;

      if (updateData.position_id) {
        const positionExists = await Position.findByPk(updateData.position_id);
        if (!positionExists) {
           return res
             .status(404)
             .send("Position not found or no changes applied.");
        }
      }
      const [updatedRows] = await Staff.update(updateData, {
        where: { id: req.params.id },
      });
      if (updatedRows === 0) {
         return res
           .status(404)
           .send("Position not found or no changes applied.");
      }
      const updatedStaff = await Staff.findByPk(staffId);

      return res.status(200).send(updatedStaff);
    } catch (error) {
      console.log("Failed to modify staff member!");
     return res.status(500).send(`Couldn't update staff:${error}`);
    }
  },
  deleteStaff: async (req, res) => {
    try {
      const deletedRows = await Staff.destroy({
        where: {
          id: req.params.id,
        },
      });
      if (deletedRows === 0)
        return res.status(404).send("Staff member not found." );
      return res
        .status(200)
        .send(`Deletion succesfull!`);
    } catch (error) {
      console.error("Error deleting staff member:", error);
      return res.status(500).send(`Couldn't delete staffMember:${error}`)
    }
  },
};
