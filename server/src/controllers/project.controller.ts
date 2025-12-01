import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth.middleware"; // Import our custom interface

const prisma = new PrismaClient();

export const createProject = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { title, description, requiredSkills, capacity } = req.body;
    const userId = req.user?.userId; 

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        requiredSkills: requiredSkills || [], 
        capacity: parseInt(capacity),
        ownerId: userId, 
      },
    });

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: "Error creating project", error });
  }
};


export const getProjects = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    
    const { skills } = req.query;

    let filter = {};

    if (skills) {
      const skillsArray = (skills as string).split(",");
      filter = {
        requiredSkills: {
          hasSome: skillsArray, // Prisma Magic: Matches if any skill overlaps
        },
      };
    }

    const projects = await prisma.project.findMany({
      where: filter,
      include: {
        owner: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" }, 
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error });
  }
};