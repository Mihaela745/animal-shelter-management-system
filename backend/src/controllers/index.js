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
import { controller as responsibleController } from "./responsibleBoxController.js";
import { controller as userController } from "./userController.js";
import { controller as appointmentController } from "./appointmentsController.js";
import {controller as authController} from "./authController.js";
import { controller as requestsController } from "./AdoptionRequest.js";
import {controller as AIController} from "./AIController.js"
import {controller as Breed_MetadataController} from "./breedMetadataController.js"
import { controller as reportsController } from "./reportsController.js";
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
  responsibleController,
  userController,
  appointmentController,
  authController,
  requestsController,
  AIController,
  Breed_MetadataController,
  reportsController
};
