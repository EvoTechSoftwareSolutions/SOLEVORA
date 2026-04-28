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

    // CHECK BLACKLIST
    const blacklisted = await prisma.blacklistedtoken.findFirst({
      where: { token },
    });

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