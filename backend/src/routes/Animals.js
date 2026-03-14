import express from "express";
import { controllers } from "../controllers/index.js";
import { upload } from "../config/cloudinary.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
export const router = express.Router();
const animalController = controllers.animalController;

router.get("/", animalController.getAllAnimals);
router.get("/:id", animalController.getAnimalById);
router.post(
  "/",
  verifyToken,
  authorizeRoles("Manager"),
  upload.single("image"),
  animalController.createAnimal,
);
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("Manager"),
  upload.single("image"),
  animalController.updateAnimal,
);
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("Manager"),
  animalController.deleteAnimal,
);
