import { controller as boxController } from "./boxesController.js";
import { controller as breedController } from "./breedController.js";
import { controller as medicalFileController } from "./medicalFilesController.js";
import { controller as medicationsController } from "./medicationsController.js";
import { controller as positionController } from "./positionsController.js";
import { controller as roomController } from "./roomsController.js";
import { controller as speciesController } from "./speciesController.js";
import { controller as staffController } from "./staffController.js";
import { controller as other } from "./other.js";
import { controller as animalController } from "./animalsController.js";
import { controller as adoptionController } from "./adoptionHistoryController.js";
import { controller as responsableController } from "./responsibleBoxController.js";
import { controller as userController } from "./userController.js";
import { controller as appointmentController } from "./appointmentsController.js";

export const controllers = {
  other,
  boxController,
  breedController,
  medicalFileController,
  medicationsController,
  positionController,
  roomController,
  speciesController,
  staffController,
  animalController,
  adoptionController,
  responsableController,
  userController,
  appointmentController,
};
