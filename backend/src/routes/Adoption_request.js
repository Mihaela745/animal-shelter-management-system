import express from "express";
import { controller } from "../controllers/AdoptionRequest.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

export const router = express.Router();

router.post("/", verifyToken, controller.createRequest);


router.get("/me", verifyToken, controller.getMyRequests);

router.get(
  "/",
  verifyToken,
  authorizeRoles("Manager", "Vet"),
  controller.getAllRequests,
);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles("Manager", "Vet"),
  controller.updateRequestStatus,
);