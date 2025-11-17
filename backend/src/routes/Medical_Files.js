import express from "express";
import {controllers} from "../controllers/index.js"

export const router=express.Router();

let medical_fileController=controllers.medicalFileController;

router.post("/createMedicalFile",medical_fileController.createMedicalFiles);
router.get("/getAllMedicalFiles",medical_fileController.getAllMedicalFiles);
router.get("/getMedicalFilesById/:id",medical_fileController.getMedicalFilesbyId);
router.put("/updateMedicalFile/:id",medical_fileController.updateMedicalFile);
router.delete("/deleteMedicalFile",medical_fileController.deleteMedicalFile);