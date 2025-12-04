import { Response } from "express";
import { prisma } from "../config/db";
import { AuthRequest } from "../middleware/auth.middleware";

// --- Get All Chat Groups for the Logged-in User ---
export const getMyChats = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Find groups where the current user is in the 'members' list
    const chats = await prisma.chatGroup.findMany({
      where: {
        members: {
          some: {
            id: userId, 
          },
        },
      },
      // Include details for the UI
      include: {
        project: {
          select: {
            id: true,
            title: true,
            ownerId: true,
          },
        },
        // Include members so you know who you are talking to
        members: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        // Optional: Get the last message for the "preview" text
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching chats", error });
  }
};