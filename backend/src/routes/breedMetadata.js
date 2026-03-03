import express from "express";
import { controllers } from "../controllers/index.js";
export const router=express.Router(); 
const breedRouter=controllers.Breed_MetadataController
router.get("/:breed", breedRouter.getBreedMetadataByName);
