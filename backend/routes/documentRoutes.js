import express from "express";
import multer from "multer";
import { uploadDocument, chatWithDocument } from "../controllers/documentController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), uploadDocument);
router.post("/chat", chatWithDocument);

export default router;
