// src/routes/chat.routes.ts
import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getChatHistory } from "../controllers/message.controller"; 
import { getMyChats } from "../controllers/chat.controller";// <--- Import

const router = Router();

router.get("/", authenticate, getMyChats);

// ADD THIS: Fetch history for a specific project
router.get("/:projectId/messages", authenticate, getChatHistory);

export default router;