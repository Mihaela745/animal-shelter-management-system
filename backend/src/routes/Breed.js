import express from "express";
import {controllers} from "../controllers/index.js";

export const router=express.Router();

router.get("/getBreedBySpecies/:id",controllers.breedController.getBreedsBySpecies);
