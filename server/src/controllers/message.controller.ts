import { Response } from "express";
import { prisma } from "../config/db";
import { AuthRequest } from "../middleware/auth.middleware";


export const getChatHistory = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.userId;
    const { projectId } = req.params;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!projectId) return res.status(404).json({ message: "Project Id not found" });

    // 1. Find the Group ID for this Project
    const chatGroup = await prisma.chatGroup.findUnique({
      where: { projectId: parseInt(projectId) },
      include: { members: { select: { id: true } } }
    });

    if (!chatGroup) return res.status(404).json({ message: "Chat group not found" });

    // 2. Security: Am I a member of this group?
    const isMember = chatGroup.members.some(m => m.id === userId);
    if (!isMember) return res.status(403).json({ message: "Access denied" });

    // 3. Fetch Messages
    const messages = await prisma.message.findMany({
      where: { groupId: chatGroup.id },
      include: {
        sender: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: "asc" } // Oldest first (Standard chat order)
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};