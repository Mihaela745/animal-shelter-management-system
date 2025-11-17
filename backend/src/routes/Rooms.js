import express from "express";
import { controllers } from "../controllers/index.js";

export const router=express.Router();
let roomController=controllers.roomController;
router.get("/getAllRooms",roomController.getAllRooms);
router.get("/getRoomById/:id",roomController.getRoomById);
router.post("/createRoom",roomController.createRoom);
router.put("/updateRoom/:id",roomController.updateRoom);
router.delete("/deleteRoom/:id",roomController.deleteRoom);

