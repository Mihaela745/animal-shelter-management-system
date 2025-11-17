import express from "express";
import { controllers } from "../controllers/index.js";

export const router=express.Router();
let userController=controllers.userController;

router.get("/getAllUsers",userController.getAllUsers);
router.get("/getUserById/:id",userController.getUserById);
router.delete("/deleteUser/:id",userController.deleteUser);