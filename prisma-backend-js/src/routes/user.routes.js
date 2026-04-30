import express from "express";
import {
  register,
  socialRegister,
  login,
  logout,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  getUser,
  updateUser,
  updatePassword,
  deleteUser,
  getActiveUsers,
  googleLogin,
} from "../controllers/user.controller.js";

import { validateUser } from "../middleware/validateUser.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// AUTH ROUTES
router.post("/register", validateUser, register);
router.post("/social-register", socialRegister);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/logout", authMiddleware, logout);

// PASSWORD RESET
router.post("/forgot-password", forgotPassword);
router.get("/verify-reset-token/:token", verifyResetToken);
router.post("/reset-password/:token", resetPassword);

// USER ROUTES
router.get("/:id", authMiddleware, getUser);
router.put("/:id", authMiddleware, updateUser);
router.put("/:id/password", authMiddleware, updatePassword);

// ADMIN / MANAGER ROUTES
router.delete("/user/:id", authMiddleware, requireRole(["admin"]), deleteUser);

router.get(
  "/users/active",
  authMiddleware,
  requireRole(["admin", "store_manager"]),
  getActiveUsers
);

export default router;