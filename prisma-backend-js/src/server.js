import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import prisma from "./prisma/client.js";
import { cleanupBlacklistedTokens } from "./utils/cleanupBlacklistedTokens.js";

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database Connected");

    // Cleanup old blacklisted tokens on startup
    await cleanupBlacklistedTokens();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ DB Connection failed", err);
  }
};

startServer();