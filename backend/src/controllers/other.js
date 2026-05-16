import { sequelize } from "../config/db.js";
import { seedSpecies } from "./speciesController.js";
import { seedPositions } from "./positionsController.js";
import { seedBoxes } from "./boxesController.js";
import { roomSeed as seedRoom } from "./roomsController.js";
import { seedManager } from "./userController.js";
import { seedBreddMetadata } from "./breedMetadataController.js";
export const controller = {
  resetDb: async (req, res) => {
    try {
      await sequelize.query("SET FOREIGN_KEY_CHECKS=0");

      await sequelize.sync({ force: true });

      await seedPositions();
      await seedSpecies();
      await seedBoxes();
      await seedRoom();
      await seedManager();
      await seedBreddMetadata();

      res.status(200).send({ message: "Database has been reset!" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: `Error on resetting: ${err.message}` });
    } finally {
      await sequelize.query("SET FOREIGN_KEY_CHECKS=1");
    }
  },
};
