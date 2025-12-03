import app from "./app";
import http from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import helmet from "helmet"; // Security headers
import rateLimit from "express-rate-limit"; // Spam protection

dotenv.config();

const prisma = new PrismaClient();
const PORT = parseInt(process.env.PORT || "3000"); // Render gives you a PORT
const SECRET = process.env.JWT_SECRET || "fallback_secret";
// The URL of your Frontend (We will set this in Render dashboard later)
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// 1. Basic Security Middleware
app.use(helmet()); 

// 2. Rate Limiting (Stops one IP from spamming your API)
// Allow 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests, please try again later."
});
app.use("/api", limiter);

const server = http.createServer(app);

// 3. Strict CORS (Only allow YOUR frontend)
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL, // <--- Only this URL can connect
    methods: ["GET", "POST"],
    credentials: true
  },
});

// ... (Keep your existing Middleware & Socket Logic here) ...

async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Database Connected Successfully");
    
    // 4. Bind to 0.0.0.0 (REQUIRED for Render/Docker)
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database Connection Failed", error);
    process.exit(1);
  }
}

main();