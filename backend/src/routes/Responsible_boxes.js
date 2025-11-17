import express from "express";
import {controllers} from "../controllers/index.js"

export const router=express.Router();
let responsibleController=controllers.responsibleController;
router.post("/createResponsible",responsibleController.createResponsibleBox);
router.get("/getAllResponsibles",responsibleController.getAllResponsibles);
router.get("/getResponsibleByBoxId/:id",responsibleController.getResponsiblesByBoxId);
router.get("/getBoxesByStaffId/:id",responsibleController.getBoxesByStaffId);
router.delete("/deleteResponsible",responsibleController.deleteBoxResponsible);


