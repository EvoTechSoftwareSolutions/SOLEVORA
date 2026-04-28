import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // VERIFY TOKEN 
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // CHECK BLACKLIST (tolerate missing table in dev environments)
    let blacklisted = null;
    const blacklistModel = prisma.blacklistedToken;

    try {
      if (!blacklistModel?.findFirst) {
        console.warn("Blacklist model missing; skipping token blacklist check.");
      } else {
        blacklisted = await blacklistModel.findFirst({
          where: { token },
        });
      }
    } catch (err) {
      const isMissingTable = err?.code === "P2021" || /does not exist/i.test(err?.message || "");
      if (!isMissingTable) {
        throw err;
      }
      console.warn("Blacklist table missing; skipping token blacklist check.");
    }

    if (blacklisted) {
      return res.status(401).json({
        message: "Token is blacklisted (logged out)",
      });
    }

    req.user = decoded;
    req.token = token;

    next();
  } catch (error) {
    return res.status(500).json({ message: "Auth error" });
  }
};