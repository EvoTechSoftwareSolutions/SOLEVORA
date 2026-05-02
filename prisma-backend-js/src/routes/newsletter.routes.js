import express from "express";
import { getNewsletterSubscribers } from "../controllers/admin.controller.js";
import prisma from "../prisma/client.js";
import nodemailer from 'nodemailer';

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

    // Ensure Promo Code exists in DB
    const promoCode = "WELCOME10";
    const existingPromo = await prisma.promocode.findUnique({
      where: { code: promoCode }
    });

    if (!existingPromo) {
      await prisma.promocode.create({
        data: {
          code: promoCode,
          discountPercent: 10,
          isActive: true,
          description: "Newsletter Welcome Discount",
          expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) // 1 year expiry
        }
      });
    }

    // Send Welcome Email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS?.replace(/\s/g, ''),
      },
    });

    const mailOptions = {
      from: `"SoleVora" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Welcome to SoleVora! 👟",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
          <div style="background: #1a1a2e; padding: 20px; text-align: center;">
            <h1 style="color: #f97316; margin: 0;">SOLEVORA</h1>
          </div>
          <div style="padding: 30px; line-height: 1.6; color: #333;">
            <h2>Thanks for joining us!</h2>
            <p>You're now subscribed to the SoleVora newsletter. Get ready for exclusive access to new drops, premium collections, and special offers.</p>
            <div style="background: #fdf2f0; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #666;">Use this code for 10% off your first order:</p>
              <h1 style="margin: 10px 0; color: #f97316; letter-spacing: 2px;">WELCOME10</h1>
            </div>
            <p>Step up your game with our latest arrivals.</p>
            <a href="http://localhost:5173/category" style="display: inline-block; background: #1a1a2e; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Shop Now</a>
          </div>
          <div style="background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999;">
            <p>© 2026 SoleVora Inc. All rights reserved.</p>
          </div>
        </div>
      `
    };

    transporter.sendMail(mailOptions).catch(err => console.error("Error sending welcome email:", err));

    res.json({ success: true, message: "Thank you for subscribing!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
