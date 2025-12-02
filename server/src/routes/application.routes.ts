// src/routes/application.routes.ts
import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { 
  applyToProject, 
  getProjectApplications, 
  updateApplicationStatus 
} from "../controllers/application.controller";

const router = Router();

// 1. Apply to a Project
// POST /api/applications/project/:projectId
router.post("/project/:projectId", authenticate, applyToProject);

// 2. View Applicants for a Project
// GET /api/applications/project/:projectId
router.get("/project/:projectId", authenticate, getProjectApplications);

// 3. Update Application Status (Accept/Reject)
// PATCH /api/applications/:applicationId
router.patch("/:applicationId", authenticate, updateApplicationStatus);

export default router;