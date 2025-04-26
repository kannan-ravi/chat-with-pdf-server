import express from "express";
import upload from "../middleware/multer.middleware.js";
import uploadController from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/pdf", upload.single("pdf-file"), uploadController.uploadPDFFile);

export default router;
