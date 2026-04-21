import { Boxes,Staff,Responsible_box,Position} from "../models/index.js";

export const controller = {
  createResponsibleBox: async (req, res) => {
    try {
      const { box_id, responsible_id } = req.body;
      if (!box_id || !responsible_id) {
        return res.status(400).send("Must complete all parameters!");
      }
      const box = await Boxes.findByPk(box_id);
      if (!box) {
        return res.status(404).send("Box doesn't exist!");
      }

      const staff = await Staff.findByPk(responsible_id, {
        include: [{ model: Position }],
      });
      if (!staff) {
        return res.status(404).send("Staff doesn't exist!");
      }
      if (staff.Position.title !== "Caretaker") {
        return res
          .status(400)
          .send("Only Caretakers can be responsible for boxes!");
      }
      const existingRelation = await Responsible_box.findOne({
        where: { box_id, responsible_id },
      });

      if (existingRelation) {
        return res
          .status(409)
          .send("This staff member is already responsible for this box.");
      }

      const resp_box = await Responsible_box.create({
        box_id,
        responsible_id,
      });
      return res.status(201).send(resp_box);
    } catch (err) {
      console.log("Error while creating!");
      return res.status(500).send(`Error while creating:${err}`);
    }
  },
  getAllResponsibles: async (req, res) => {
    try {
      const response = await Responsible_box.findAll({
        include: [
          {
            model: Boxes,
            attributes: ["id", "box_number"],
          },
          {
            model: Staff,
            attributes: ["id", "name"],
          },
        ],
      });
      return res.status(200).send(response);
    } catch (err) {
      console.log("Error while fetching!");
      return res.status(500).send(`Error while fetching:${err}`);
    }
  },
  getResponsiblesByBoxId: async (req, res) => {
    try {
      const box_id = req.params.id;

      const box = await Boxes.findByPk(box_id);
      if (!box) {
        return res.status(404).send("Box doesn't exist!");
      }

      const response = await Responsible_box.findAll({
        where: { box_id },
        include: [
          {
            model: Staff,
            attributes: ["id", "name"],
          },
        ],
      });

      return res.status(200).json(response);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  getBoxesByStaffId: async (req, res) => {
    try {
      const res_id = req.params.id;
      const responsable = await Staff.findByPk(res_id);
      if (!responsable) return res.status(404).send("Staff doesn't exist!");
      const response = await Responsible_box.findAll({
        where: { responsible_id: res_id },
        include: [
          {
            model: Boxes,
            attributes: [
              "id",
              "box_number",
              "capacity",
              "current_occupancy",
              "species_id",
            ],
          },
        ],
      });

      const boxes = response
        .map((item) => item.Boxes || item.Box || null)
        .filter(Boolean);

      return res.status(200).send(boxes);
    } catch (err) {
      console.log("Error while fetching!");
      return res.status(500).send(`Error while fetching:${err}`);
    }
  },
  deleteBoxResponsible: async (req, res) => {
    try {
      const deletedRows = await Responsible_box.destroy({
        where: {
          id: req.params.id,
        },
      });
      if (deletedRows === 0) return res.status(404).send("Doesn't exist!");
      return res.status(200).send("Box_resp has been deleted!");
    } catch (err) {
      console.log("Error while deleting");
      return res.status(500).send(`Error while deleting: ${err}`);
    }
  },
};
