import express from "express";
import { router as otherRouter } from "./other.js";
import { router as adoptionHistoryRouter } from "./Adoption_history.js";
import { router as animalsRouter } from "./Animals.js";
import {router as breedRouter} from "./Breed.js"
import {router as speciesRouter} from "./Species.js"
import {router as authRouter} from "./auth.js"
import {router as appointmentRouter} from "./Appointments.js"
export const router = express.Router();

router.use("/", otherRouter);
router.use("/", adoptionHistoryRouter);
router.use("/", animalsRouter);
router.use("/",speciesRouter);
router.use("/",breedRouter);
router.use("/",authRouter);
router.use("/",appointmentRouter);

