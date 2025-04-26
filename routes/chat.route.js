import express from "express";
import chatController from "../controllers/chat.controller.js";
const router = express.Router();

router.get("/", chatController.getChat);

export default router;
