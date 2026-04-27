import prisma from "../prisma/client.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
// import { sendEmail } from "../utils/emailService.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, location } = req.body;

    if (!name || name.trim().length < 3) {
      return res.status(400).json({ message: "Name must be at least 3 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        location,
      },
    });

    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
};

// SOCIAL REGISTER
export const socialRegister = async (req, res) => {
  try {
    const { name, email } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.json({ message: "User already exists. Social login successful" });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await bcrypt.hash("social_login", 10),
      },
    });

    res.json({
      message: "Social login successful",
      userId: user.id,
    });
  } catch (error) {
    res.status(500).json({ message: "Social registration failed" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.status === 0) return res.status(403).json({ message: "User inactive" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    let loginMessage = "Login successful";
    if (user.role === "admin") loginMessage = "Welcome Admin Dashboard";
    else if (user.role === "store_manager") loginMessage = "Welcome Manager Panel";

    res.json({
      message: loginMessage,
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    await prisma.user.update({
      where: { email },
      data: {
        resetToken: tokenHash,
        resetTokenExpires: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    const resetLink = `http://localhost:5173/reset-password/${rawToken}`;

    // await sendEmail({
    //   to: email,
    //   subject: "Password Reset",
    //   html: `<a href="${resetLink}">Reset Password</a>`,
    // });

    res.json({
      message: "Reset link sent",
      debugUrl: resetLink,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email" });
  }
};

// VERIFY RESET TOKEN
export const verifyResetToken = async (req, res) => {
  try {
    const tokenHash = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        resetToken: tokenHash,
        resetTokenExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    res.json({ message: "Token valid", role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Token verification failed" });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    const tokenHash = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        resetToken: tokenHash,
        resetTokenExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Reset failed" });
  }
};

// GET ACTIVE USERS
export const getActiveUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        status: 1,
      },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch active users" });
  }
};

// GET USER
export const getUser = async (req, res) => {
  try {
    const requestedUserId = Number(req.params.id);
    const loggedUser = req.user;

    if (loggedUser.role === "customer" && loggedUser.id !== requestedUserId) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: requestedUserId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const requestedUserId = Number(req.params.id);
    const loggedUser = req.user;

    if (loggedUser.role === "customer" && loggedUser.id !== requestedUserId) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const data = { ...req.body };

    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }

    const user = await prisma.user.update({
      where: { id: requestedUserId },
      data,
    });

    res.json({
      message: "Profile updated",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

// UPDATE PASSWORD
export const updatePassword = async (req, res) => {
  try {
    const requestedUserId = Number(req.params.id);
    const loggedUser = req.user;

    if (loggedUser.id !== requestedUserId) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: requestedUserId },
    });

    const isMatch = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const hashed = await bcrypt.hash(req.body.newPassword, 10);

    await prisma.user.update({
      where: { id: requestedUserId },
      data: { password: hashed },
    });

    res.json({ message: "Password updated" });
  } catch (error) {
    res.status(500).json({ message: "Failed" });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.update({
      where: { id: Number(id) },
      data: {
        status: 0,
      },
    });

    res.json({ message: "User deactivated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    await prisma.blacklistedToken.create({
      data: { token },
    });

    return res.json({
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Logout failed",
    });
  }
};