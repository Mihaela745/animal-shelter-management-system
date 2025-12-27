import express from "express";
import { controller } from "../controllers/AdoptionRequest.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

export const router = express.Router();

router.post("/createRequest", verifyToken, controller.createRequest);


router.get("/myAdoptionRequests", verifyToken, controller.getMyRequests);

router.get(
  "/allRequests",
  verifyToken,
  authorizeRoles("Manager", "Vet"),
  controller.getAllRequests
);
router.put(
  "/updateRequestStatus/:id",
  verifyToken,
  authorizeRoles("Manager", "Vet"),
  controller.updateRequestStatus
);