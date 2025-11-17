import express from "express";
export const router = express.Router();
import { controllers } from "../controllers/index.js";
const appointmentController = controllers.appointmentController;

router.post("/createAppointment",appointmentController.createAppointment);
router.get("/getAllAppointments",appointmentController.getAllAppointments);
router.get("/getAppointmentsByStaffId/:id",appointmentController.getAppointmentByStaffId);
router.put("/updateAppointment/:id",appointmentController.updateAppointment);
router.delete("/deleteAppointment/:id",appointmentController.deleteAppointment);
