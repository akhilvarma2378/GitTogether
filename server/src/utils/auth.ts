import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "ABC123DEF456";

export const generateToken = (userId: number) => {
  return jwt.sign({ userId }, SECRET, { expiresIn: "1d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET) as { userId: number };
};