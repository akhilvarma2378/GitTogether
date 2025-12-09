import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth"; // <--- Import the helper


export interface AuthRequest extends Request {
  user?: { userId: number };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1]; // Remove "Bearer "\

  if (!token) {
    res.status(401).json({ message: "Invalid token format" });
    return;
  }

  try {
    
    const decoded = verifyToken(token); 
    
    req.user = { userId: decoded.userId};
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};