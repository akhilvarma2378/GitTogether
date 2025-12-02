
import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware";

const prisma = new PrismaClient();


export const applyToProject = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.userId;
    const { projectId } = req.params; // Get ID from URL (/projects/:projectId/apply)

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!projectId) return res.status(400).json({ message: "Project ID is required" });

  
    const project = await prisma.project.findUnique({
      where: { id: parseInt(projectId) },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

   
    if (project.ownerId === userId) {
      return res.status(400).json({ message: "You cannot apply to your own project" });
    }

   
    const application = await prisma.application.create({
      data: {
        userId,
        projectId: parseInt(projectId),
        status: "PENDING",
      },
    });

    res.status(201).json({ message: "Applied successfully", application });

  } catch (error: any) {
    
    if (error.code === 'P2002') {
      return res.status(400).json({ message: "You have already applied to this project" });
    }
    res.status(500).json({ message: "Server error", error });
  }
};


export const getProjectApplications = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.userId;
    const { projectId } = req.params;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!projectId) return res.status(400).json({ message: "Project ID is required" });

   
    const project = await prisma.project.findUnique({
      where: { id: parseInt(projectId) },
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    
    if (project.ownerId !== userId) {
      return res.status(403).json({ message: "Access denied. Only the owner can view applicants." });
    }

  
    const applications = await prisma.application.findMany({
      where: { projectId: parseInt(projectId) },
      include: {
        user: {
          select: { id: true, name: true, email: true, skills: true, bio: true },
        },
      },
    });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const updateApplicationStatus = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.userId;
    const { applicationId } = req.params; // from URL (/applications/:applicationId/status)
    const { status } = req.body; // { status: "ACCEPTED" } or "REJECTED"

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!applicationId) return res.status(400).json({ message: "Application ID is required" });

 
    const application = await prisma.application.findUnique({
      where: { id: parseInt(applicationId) },
      include: { project: true }, 
    });

    if (!application) return res.status(404).json({ message: "Application not found" });


    if (application.project.ownerId !== userId) {
      return res.status(403).json({ message: "Access denied. Only the owner can update status." });
    }


    const updatedApplication = await prisma.application.update({
      where: { id: parseInt(applicationId) },
      data: { status: status }, // "ACCEPTED" | "REJECTED"
    });

    // TODO: Phase 4 - If status === 'ACCEPTED', create Chat Group here.
    
    res.json({ message: `Application ${status}`, application: updatedApplication });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};