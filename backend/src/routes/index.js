import express from "express";
import {router as otherRouter} from "./other.js"

export const router=express.Router();
router.use("/",otherRouter);