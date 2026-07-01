import express from "express";
import multer from "multer";
import { uploadDocument } from "../controllers/documentController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), uploadDocument);

export default router;
