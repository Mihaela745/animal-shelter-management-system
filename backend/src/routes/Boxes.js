import express from "express";
import { controllers } from "../controllers/index.js";
import { authorizeRoles, verifyToken } from "../middleware/authMiddleware.js";
export const router = express.Router();
const boxesController = controllers.boxController;

router.post(
  "/",
  verifyToken,
  authorizeRoles("Manager"),
  boxesController.createBoxes,
);
router.get(
  "/",
  verifyToken,
  authorizeRoles("Manager", "Vet", "Caretaker"),
  boxesController.getAllBoxes,
);
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("Manager", "Vet", "Caretaker"),
  boxesController.getBoxById,
);
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("Manager"),
  boxesController.deleteBox,
);
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("Manager"),
  boxesController.updateBox,
);
