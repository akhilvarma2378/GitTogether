import app from "./app";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

async function main() {
  try {
    // Check DB Connection
    await prisma.$connect();
    console.log("✅ Database Connected Successfully");

    // Start Server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database Connection Failed", error);
    process.exit(1);
  }
}

main();