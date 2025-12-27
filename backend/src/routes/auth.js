import express from "express";
import {controllers} from "../controllers/index.js"
import { verifyToken } from "../middleware/authMiddleware.js";
const authController=controllers.authController;

export const router = express.Router();
router.post("/register", authController.addUser);

router.post("/login", authController.loginUser);

router.put("/update-password", verifyToken, authController.updatePassword);


router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);