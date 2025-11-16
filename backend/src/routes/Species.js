import express from "express";
import {controllers} from "../controllers/index.js";

export const router=express.Router();

router.post("/createSpecies",controllers.speciesController.initializeSpecies);
router.get("/getSpecies",controllers.speciesController.getSpecies);