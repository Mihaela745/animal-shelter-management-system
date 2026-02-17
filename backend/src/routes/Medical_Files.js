import express from "express";
import {controllers} from "../controllers/index.js"
import { authorizeRoles, verifyToken } from "../middleware/authMiddleware.js";

export const router=express.Router();

let medical_fileController=controllers.medicalFileController;
//Medical file routes 

router.get("/",verifyToken,authorizeRoles("Manager","Vet"),medical_fileController.getAllMedicalFiles);
router.get("/:id",verifyToken,medical_fileController.getMedicalFilesbyId);
router.put("/:id",verifyToken,authorizeRoles("Vet"),medical_fileController.updateMedicalFile);

//Medications routes
const medicationsController = controllers.medicationsController;

//creare de medicatie 
router.post(
  "/:id/medications",
  verifyToken,
  authorizeRoles("Vet"),
  medicationsController.createMedications,
);
router.get(
  "/:id/medications",
  verifyToken,
  authorizeRoles("Vet", "Caretaker", "Manager"),
  medicationsController.getAllMedicationsByMedicalFile,
);
router.get(
  "/:fileId/medications/:id",
  verifyToken,
  authorizeRoles("Vet", "Caretaker", "Manager"),
  medicationsController.getMedicationById,
);
router.put(
  "/:fileId/medications/:id",
  verifyToken,
  authorizeRoles("Vet"),
  medicationsController.updateMedication,
);
router.delete(
  "/:fileId/medications/:id",
  verifyToken,
  authorizeRoles("Vet", "Manager"),
  medicationsController.deleteMedications,
);