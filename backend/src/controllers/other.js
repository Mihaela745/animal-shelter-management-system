import { sequelize } from "../config/db.js";
import { seedSpecies } from "./speciesController.js";
import { seedPositions } from "./positionsController.js";
import { seedBoxes } from "./boxesController.js";
import { roomSeed as seedRoom} from "./roomsController.js";
export const controller = {
  resetDb: async (req, res) => {
    try {
      await sequelize.query("SET FOREIGN_KEY_CHECKS=0", { raw: true });
      await sequelize.sync({ force: true });
      await seedPositions();
      await seedSpecies(); 
      await seedBoxes();
      await seedRoom();
      await sequelize.query("SET FOREIGN_KEY_CHECKS=1", { raw: true });
      res.status(200).send({ message: "Data base has been reseted!" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: `Error on reseting:${err}` });
    }
  },
};
