import express from "express";
import { controllers } from "../controllers/index.js";
import { verifyToken } from "../middleware/authMiddleware.js";

export const router = express.Router();
const AIController = controllers.AIController;

router.post("/search",  AIController.searchAnimal);
