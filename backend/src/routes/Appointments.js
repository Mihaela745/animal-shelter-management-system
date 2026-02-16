import express from "express";
export const router = express.Router();
import { controllers } from "../controllers/index.js";
import { authorizeRoles, verifyToken } from "../middleware/authMiddleware.js";
const appointmentController = controllers.appointmentController;

router.post("/", verifyToken, appointmentController.createAppointment);
router.get(
  "/",
  verifyToken,
  authorizeRoles("Manager"),
  appointmentController.getAllAppointments,
);
router.get("/me", verifyToken, appointmentController.getAppointmentsByUserId);
router.get(
  "/staff/:id",
  verifyToken,
  authorizeRoles("Manager", "Caretaker", "Vet"),
  appointmentController.getAppointmentByStaffId,
);
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("Manager", "Vet", "Caretaker"),
  appointmentController.updateAppointmentStatus,
);
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("Manager"),
  appointmentController.deleteAppointment,
);
