import express from "express";
import { controllers } from "../controllers/index.js";
import { verifyToken,authorizeRoles } from "../middleware/authMiddleware.js";
export const router = express.Router();
const adoptionController = controllers.adoptionController;

//get by user
router.get("/me",verifyToken, adoptionController.getAdoptionHistoryByUserId);

//get by id
router.get("/:id",verifyToken, adoptionController.getAdoptionById);

//delete
router.delete("/:id",verifyToken,authorizeRoles("Manager"), adoptionController.deleteAdoption);

//get pe toate 
router.get("/",verifyToken,authorizeRoles("Manager"),adoptionController.getAllAdoptions)

export default router;