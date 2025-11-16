import express from "express";
import { controllers } from "../controllers/index.js";
export const router=express.Router();
const boxesController=controllers.boxController;

router.post("/createBoxes",boxesController.createBoxes);
router.get("/getBoxes",boxesController.getAllBoxes);
router.get("/getBoxById/:id",boxesController.getBoxById);
router.delete("/deleteBox/:id",boxesController.deleteBox);
router.put("/updateBox/:id",boxesController.updateBox);