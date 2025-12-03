import app from "./app";
import http from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || "fallback_secret";

// 1. Create Http Server & Socket Server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, change this to your Frontend URL (e.g. http://localhost:5173)
    methods: ["GET", "POST"],
  },
});

// 2. Middleware: Socket Authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token; // Client sends { auth: { token: "..." } }
  
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, SECRET) as { userId: number };
    socket.data.userId = decoded.userId; // Attach userId to socket session
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});

// 3. Connection Logic
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id} (User ID: ${socket.data.userId})`);

  // Event: Join a Chat Room
  socket.on("join_room", (projectId) => {
    // Make the socket join a specific "channel" named after the project
    socket.join(projectId.toString());
    console.log(`User ${socket.data.userId} joined room: ${projectId}`);
  });

  // Event: Send Message
  socket.on("send_message", async (data) => {
    // data expects: { projectId, content }
    try {
      const { projectId, content } = data;
      const senderId = socket.data.userId;

      // A. Find the ChatGroup ID for this project
      const group = await prisma.chatGroup.findUnique({
        where: { projectId: parseInt(projectId) }
      });

      if (!group) return; // Should handle error better in real app

      // B. Save to Database (Persistence)
      const savedMessage = await prisma.message.create({
        data: {
          content: content,
          senderId: senderId,
          groupId: group.id,
        },
        include: {
          sender: { select: { id: true, name: true } }
        }
      });

      // C. Broadcast to everyone in the room (including sender)
      io.to(projectId.toString()).emit("receive_message", savedMessage);
      
    } catch (error) {
      console.error("Message error:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// 4. Start Server
async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Database Connected Successfully");
    
    // Change app.listen to server.listen for Sockets to work!
    server.listen(
  { port: PORT, host: "0.0.0.0" },
  () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  }
);
  } catch (error) {
    console.error("❌ Database Connection Failed", error);
    process.exit(1);
  }
}

main();