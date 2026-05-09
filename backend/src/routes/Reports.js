import express from "express";
import { controllers } from "../controllers/index.js";
import { authorizeRoles, verifyToken } from "../middleware/authMiddleware.js";

export const router = express.Router();
const allowedRoles = ["Manager", "Caretaker", "Vet"];
const reportsController = controllers.reportsController;

router.get(
  "/animals",
  verifyToken,
  authorizeRoles(...allowedRoles),
  reportsController.getAnimalsReport,
);

router.get(
  "/adoption-requests",
  verifyToken,
  authorizeRoles(...allowedRoles),
  reportsController.getAdoptionRequestsReport,
);

router.get(
  "/appointments",
  verifyToken,
  authorizeRoles(...allowedRoles),
  reportsController.getAppointmentsReport,
);

router.get(
  "/medications",
  verifyToken,
  authorizeRoles(...allowedRoles),
  reportsController.getMedicationsReport,
);

router.get(
  "/boxes/occupancy",
  verifyToken,
  authorizeRoles(...allowedRoles),
  reportsController.getBoxesOccupancyReport,
);
