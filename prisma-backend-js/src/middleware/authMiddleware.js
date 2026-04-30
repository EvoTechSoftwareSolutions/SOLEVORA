import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token || token === "null" || token === "undefined") {
      console.log("AUTH_ERROR: No token provided or invalid token string:", token);
      return res.status(401).json({ message: "No token provided", error: "missing_token" });
    }

    // VERIFY TOKEN 
    let decoded;
    try {
      // Use trim() to ensure no accidental whitespace in secret
      const secret = process.env.JWT_SECRET?.trim();
      decoded = jwt.verify(token, secret);
    } catch (err) {
      console.log("AUTH_ERROR: Token verification failed:", err.message);
      return res.status(401).json({ message: "Invalid token", error: err.message });
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