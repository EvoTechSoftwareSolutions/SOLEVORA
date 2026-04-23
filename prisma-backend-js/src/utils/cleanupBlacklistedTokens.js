import prisma from "../prisma/client.js";

export const cleanupBlacklistedTokens = async () => {
  try {
    await prisma.blacklistedToken.deleteMany({
      where: {
        createdAt: {
          lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    console.log("Old blacklisted tokens cleaned");
  } catch (error) {
    console.error("Cleanup error:", error);
  }
};