import dotenv from "dotenv";
import app from "./app.js";
import prisma from "./prisma/client.js";
import { cleanupBlacklistedTokens } from "./utils/cleanupBlacklistedTokens.js";

dotenv.config();

cleanupBlacklistedTokens();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ DB Connection failed", err);
  }
};

startServer();