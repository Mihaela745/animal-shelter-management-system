import express from "express";
import { controllers } from "../controllers/index.js";
export const router = express.Router();
const adoptionController = controllers.adoptionController;
router.get(
  "/adoptionsByUser/:id",
  adoptionController.getAdoptionHistoryByUserId
);
router.get("/adoptionsById/:id", adoptionController.getAdoptionById);
router.post("/createAdoption", adoptionController.createAdoption);
router.delete("/deleteAdoption/:id", adoptionController.deleteAdoption);
