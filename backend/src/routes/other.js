import express from "express";
import {controllers} from "../controllers/index.js";

export const router=express.Router();
const otherController=controllers.other;
router.get("/reset",otherController.resetDb);