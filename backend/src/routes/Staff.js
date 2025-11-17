import express from "express";
import { controllers } from "../controllers/index.js"; // Presupunem că importă controlerul tău

export const router = express.Router();

const staffController = controllers.staffController;

router.post("/createStaff", staffController.createStaff);

router.get("/getAllStaff", staffController.getAllStaf);

router.get("/getStaffById/:id", staffController.getStaffById);

router.put("/updateStaff/:id", staffController.updateStaff);

router.delete("/deleteStaff/:id", staffController.deleteStaff);
