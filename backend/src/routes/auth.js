import express from "express";
import {controllers} from "../controllers/index.js"
export const router=express.Router();
const authController=controllers.authController;

router.post("/createUser",authController.addUser);
router.put("/updatePassword",authController.updatePassword);
router.post("/login",authController.loginUser);