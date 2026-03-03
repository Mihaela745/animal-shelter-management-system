import express from "express";
import { controllers } from "../controllers/index.js"; 
import { authorizeRoles, verifyToken } from "../middleware/authMiddleware.js";

export const router = express.Router();

const staffController = controllers.staffController;

router.post(
  "/",
  verifyToken,
  authorizeRoles("Manager"),
  staffController.createStaff,
);

router.get(
  "/",
  verifyToken,
  authorizeRoles("Manager"),
  staffController.getAllStaff,
);

router.get(
  "/:id",
  verifyToken,
  authorizeRoles("Manager"),
  staffController.getStaffById,
);

router.get("/me", verifyToken, staffController.getMyProfile);
router.put("/me", verifyToken, staffController.updateMyProfile);
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("Manager"),
  staffController.updateStaff,
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("Manager"),
  staffController.deleteStaff,
);
