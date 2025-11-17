import express from "express";
import {controllers} from "../controllers/index.js"

export const router=express.Router();
let medicationsController=controllers.medicationsController;
router.post("/createMedications",medicationsController.createMedications);
router.get("/getAllMedications",medicationsController.getAllMedications);
router.get("/getMedicationById/:id",medicationsController.getMedicationById);
router.put("/updateMedication/:id",medicationsController.updateMedication);
router.delete("/deleteMedication/:id",medicationsController.deleteMedications);
