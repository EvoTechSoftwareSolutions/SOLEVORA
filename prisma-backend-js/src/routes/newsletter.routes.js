import express from "express";
import { getNewsletterSubscribers } from "../controllers/admin.controller.js";
import prisma from "../prisma/client.js";

const router = express.Router();

router.get("/subscribers", getNewsletterSubscribers);

router.delete("/subscribers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.update({
      where: { id: Number(id) },
      data: { newsletter: false }
    });
    res.json({ success: true, message: "Unsubscribed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "Email not found. Please register an account first to subscribe to our newsletter." 
      });
    }

    await prisma.user.update({
      where: { email },
      data: { newsletter: true }
    });

    res.json({ success: true, message: "Thank you for subscribing!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
