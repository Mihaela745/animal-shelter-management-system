import express from "express";
import {router as otherRouter} from "./other.js"
import {router as adoptionHistoryRouter} from"./Adoption_history.js"
export const router=express.Router();
router.use("/",otherRouter);
router.use("/",adoptionHistoryRouter);