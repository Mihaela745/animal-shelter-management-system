import express from "express";
import { controllers } from "../controllers/index.js";
import { authorizeRoles, verifyToken } from "../middleware/authMiddleware.js";

export const router=express.Router();
let positionController=controllers.positionController;

router.get("/",verifyToken,authorizeRoles("Manager"),positionController.getAllPositions);