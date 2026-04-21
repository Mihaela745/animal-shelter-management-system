import express from "express";
import { controllers } from "../controllers/index.js";
import { authorizeRoles, verifyToken } from "../middleware/authMiddleware.js";

export const router=express.Router();
let userController=controllers.userController;

router.get("/",verifyToken,authorizeRoles("Manager"),userController.getAllUsers);
router.get("/me", verifyToken, userController.getMyProfile);
router.put("/me", verifyToken, userController.updateMyProfile);
router.get("/:id",verifyToken,userController.getUserById);
router.delete("/:id",verifyToken,authorizeRoles("Manager"),userController.deleteUser);
