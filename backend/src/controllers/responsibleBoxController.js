import { Boxes,Staff,Responsible_box,Position} from "../models/index.js";

export const controller = {
  createResponsibleBox: async (req, res) => {
    try {
      const { box_id, responsible_id } = req.body;
      if (!box_id || !responsible_id) {
        return res.status(400).send("Trebuie completați toți parametrii!");
      }
      const box = await Boxes.findByPk(box_id);
      if (!box) {
        return res.status(404).send("Boxa nu există!");
      }

      const staff = await Staff.findByPk(responsible_id, {
        include: [{ model: Position }],
      });
      if (!staff) {
        return res.status(404).send("Angajatul nu există!");
      }
      if (staff.Position.title !== "Caretaker") {
        return res
          .status(400)
          .send("Doar îngrijitorii pot fi responsabili pentru boxe!");
      }
      const existingRelation = await Responsible_box.findOne({
        where: { box_id, responsible_id },
      });

      if (existingRelation) {
        return res
          .status(409)
          .send("Acest angajat este deja responsabil pentru această boxă.");
      }

      const resp_box = await Responsible_box.create({
        box_id,
        responsible_id,
      });
      return res.status(201).send(resp_box);
    } catch (err) {
      console.log("Error while creating!");
      return res.status(500).send(`Eroare la creare:${err}`);
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
      return res.status(500).send(`Eroare la încărcare:${err}`);
    }
  },
  getResponsiblesByBoxId: async (req, res) => {
    try {
      const box_id = req.params.id;

      const box = await Boxes.findByPk(box_id);
      if (!box) {
        return res.status(404).send("Boxa nu există!");
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
      if (!responsable) return res.status(404).send("Angajatul nu există!");
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
      return res.status(500).send(`Eroare la încărcare:${err}`);
    }
  },
  deleteBoxResponsible: async (req, res) => {
    try {
      const deletedRows = await Responsible_box.destroy({
        where: {
          id: req.params.id,
        },
      });
      if (deletedRows === 0) return res.status(404).send("Nu există!");
      return res.status(200).send("Responsabilul boxei a fost șters!");
    } catch (err) {
      console.log("Error while deleting");
      return res.status(500).send(`Eroare la ștergere: ${err}`);
    }
  },
};
