import express from "express";
import {controllers} from "../controllers/index.js";
import { verifyToken } from "../middleware/authMiddleware.js";

export const router=express.Router();

router.get("/",verifyToken,controllers.speciesController.getSpecies);