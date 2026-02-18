import express from "express";
import { controllers } from "../controllers/index.js";
import { authorizeRoles, verifyToken } from "../middleware/authMiddleware.js";

export const router = express.Router();
let roomController = controllers.roomController;
router.get(
  "/",
  verifyToken,
  authorizeRoles("Manager", "Vet", "Caretaker"),
  roomController.getAllRooms,
);
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("Manager", "Vet", "Caretaker"),
  roomController.getRoomById,
);
router.post(
  "/",
  verifyToken,
  authorizeRoles("Manager"),
  roomController.createRoom,
);
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("Manager"),
  roomController.updateRoom,
);
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("Manager"),
  roomController.deleteRoom,
);
