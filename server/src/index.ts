import app from "./app";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { prisma } from "./config/db"; // <--- FIXED: Import Singleton

dotenv.config();

const PORT = parseInt(process.env.PORT || "3000");
const SECRET = process.env.JWT_SECRET || "fallback_secret";
const CLIENT_URL = process.env.CLIENT_URL || "*"; // Default to * for safety if var is missing

// 1. Basic Security
app.use(helmet());

// 2. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later."
});
app.use("/api", limiter);

const server = http.createServer(app);

// 3. Socket Setup with Strict CORS
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL, 
    methods: ["GET", "POST"],
    credentials: true
  },
});

// --- SOCKET MIDDLEWARE (Authentication) ---
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication error: No token"));

  try {
    const decoded = jwt.verify(token, SECRET) as { userId: number };
    socket.data.userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});

// --- SOCKET LOGIC (The part that was missing/hidden) ---
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id} (User ID: ${socket.data.userId})`);

  socket.on("join_room", (projectId) => {
    socket.join(projectId.toString());
    console.log(`User ${socket.data.userId} joined room: ${projectId}`);
  });

  socket.on("send_message", async (data) => {
    try {
      const { projectId, content } = data;
      const senderId = socket.data.userId;

      // 1. Find Chat Group
      const group = await prisma.chatGroup.findUnique({
        where: { projectId: parseInt(projectId) }
      });

      if (!group) return;

      // 2. Save Message to DB (Using Singleton Prisma)
      const savedMessage = await prisma.message.create({
        data: {
          content,
          senderId,
          groupId: group.id,
        },
        include: {
          sender: { select: { id: true, name: true } }
        }
      });

      // 3. Broadcast to Room
      io.to(projectId.toString()).emit("receive_message", savedMessage);
      
    } catch (error) {
      console.error("Message Error:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

async function main() {
  try {
    // No need to call $connect() manually with the singleton, it handles it lazily
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server Failed to Start", error);
    process.exit(1);
  }
}

main();