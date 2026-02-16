import express from "express";
import { controllers } from "../controllers/index.js";
import { upload } from "../config/cloudinary.js";

export const router = express.Router();
const animalController = controllers.animalController;


router.get("/", animalController.getAllAnimals);
router.get("/:id", animalController.getAnimalById);
router.post("/", upload.single("image"), animalController.createAnimal);
router.put(
  "/:id",
  upload.single("image"),
  animalController.updateAnimal
);
router.delete("/:id", animalController.deleteAnimal);
