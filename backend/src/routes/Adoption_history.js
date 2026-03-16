import express from "express";
import { controllers } from "../controllers/index.js";
import { verifyToken,authorizeRoles } from "../middleware/authMiddleware.js";
export const router = express.Router();
const adoptionController = controllers.adoptionController;

router.get("/me",verifyToken, adoptionController.getAdoptionHistoryByUserId);
router.get("/",verifyToken,authorizeRoles("Manager"),adoptionController.getAllAdoptions)
router.get("/:id",verifyToken, adoptionController.getAdoptionById);
router.delete("/:id",verifyToken,authorizeRoles("Manager"), adoptionController.deleteAdoption);

export default router;
