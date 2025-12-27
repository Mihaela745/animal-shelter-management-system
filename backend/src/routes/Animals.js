import express from "express";
import { controllers } from "../controllers/index.js";
export const router = express.Router();
const animalController = controllers.animalController;
import { upload } from "../config/cloudinary.js";

router.get("/animals", animalController.getAllAnimals);
router.get("/animals/:id", animalController.getAnimalById);
router.post("/animals", upload.single("image"), animalController.createAnimal);
router.put(
  "/animals/:id",
  upload.single("image"),
  animalController.updateAnimal
);
router.delete("/deleteAnimal/:id", animalController.deleteAnimal);
