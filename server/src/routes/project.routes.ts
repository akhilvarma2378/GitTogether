import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createProject, getProjects } from "../controllers/project.controller";

const router = Router();


router.post("/", authenticate, createProject);


router.get("/", getProjects);

export default router;