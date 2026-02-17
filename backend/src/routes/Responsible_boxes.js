import express from "express";
import { controllers } from "../controllers/index.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
export const router = express.Router();
let responsibleController = controllers.responsibleController;
router.post(
  "/",
  verifyToken,
  authorizeRoles("Manager"),
  responsibleController.createResponsibleBox,
);
router.get(
  "/",
  verifyToken,
  authorizeRoles("Manager"),
  responsibleController.getAllResponsibles,
);
router.get(
  "/boxes/:id",
  verifyToken,
  authorizeRoles("Manager", "Vet", "Caretaker"),
  responsibleController.getResponsiblesByBoxId,
);
router.get(
  "/staff/:id",
  verifyToken,
  authorizeRoles("Manager", "Caretaker"),
  responsibleController.getBoxesByStaffId,
);
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("Manager"),
  responsibleController.deleteBoxResponsible,
);
