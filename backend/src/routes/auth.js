import express from "express";
import {controllers} from "../controllers/index.js"
export const router=express.Router();
const authController=controllers.authController;

router.post("/auth/register",authController.addUser);
router.put("/auth/updatePassword",authController.updatePassword);
router.post("/auth/login",authController.loginUser);