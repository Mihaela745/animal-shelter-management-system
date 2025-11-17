import express from "express";
import { controllers } from "../controllers/index.js";

export const router=express.Router();
let positionController=controllers.positionController;

router.get("/getAllPositions",positionController.getAllPositions);