import express from "express";
import { controllers } from "../controllers/index.js";
export const router = express.Router();
const animalController = controllers.animalController;

router.get("/animals", animalController.getAllAnimals);
router.get("/animals/:id", animalController.getAnimalById);
router.post("/createAnimal", animalController.createAnimal);
router.put("/updateAnimal/:id", animalController.updateAnimal);
router.delete("/deleteAnimal/:id", animalController.deleteAnimal);
