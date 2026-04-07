import { sendEmail } from "../utils/sentEmail.js";
import fs from "fs";
import path from "path";
import Subscriber from "../models/Subscriber.js";

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existing = await Subscriber.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email already subscribed" });
    }

    await Subscriber.create({ email });

    const templatePath = path.join(process.cwd(), "template", "subscribe.html");
    let htmlTemplate = fs.readFileSync(templatePath, "utf-8");

    htmlTemplate = htmlTemplate.replace("{{email}}", email);

    // Prepare attachments for embedded images (CIDs)
    const imagesDir = path.join(process.cwd(), "public", "images");
    const emailImagesDir = path.join(imagesDir, "email");

    const attachments = [
      { filename: 'logo.png', path: path.join(imagesDir, 'logo.png'), cid: 'logo' },
      { filename: 'grey-shoe.png', path: path.join(emailImagesDir, 'grey-shoe.png'), cid: 'grey-shoe' },
      { filename: 'lime-shoe.png', path: path.join(emailImagesDir, 'lime-shoe.png'), cid: 'lime-shoe' },
      { filename: 'orange-shoe.png', path: path.join(emailImagesDir, 'orange-shoe.png'), cid: 'orange-shoe' },
      { filename: 'tan-shoe.png', path: path.join(emailImagesDir, 'tan-shoe.png'), cid: 'tan-shoe' },
      { filename: 'product-4.png', path: path.join(emailImagesDir, 'product-4.png'), cid: 'product-4' },
      { filename: 'product-6.png', path: path.join(emailImagesDir, 'product-6.png'), cid: 'product-6' },
      { filename: 'product-8.png', path: path.join(emailImagesDir, 'product-8.png'), cid: 'product-8' },
    ];

    await sendEmail(
      email,
      "🎉 Welcome to SoleVora! 10% OFF your first order",
      htmlTemplate,
      attachments
    );

    // Send notification to admin
    const adminEmail = "sajeesajeevan1998@gmail.com"; 
    const adminSubject = "New Newsletter Subscription - SoleVora";
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px; margin: auto;">
        <h2 style="color: #ff4d4d; border-bottom: 2px solid #ff4d4d; padding-bottom: 10px;">New subscriber Alert!</h2>
        <p style="font-size: 16px; color: #333;">Great news! A new user has just subscribed to your newsletter.</p>
        <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 18px;"><strong>Subscriber Email:</strong> <span style="color: #ff4d4d;">${email}</span></p>
        </div>
        <p style="color: #666; font-size: 14px;">This user is now eligible for the 10% discount offered in the welcome email.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="text-align: center; color: #999; font-size: 12px;">© 2026 SoleVora Dashboard</p>
      </div>
    `;

    await sendEmail(adminEmail, adminSubject, adminHtml);

    res.status(200).json({ message: "Thank you for subscribing 🎉" });

  } catch (error) {
    console.log("Email error:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Email already subscribed" });
    }

    res.status(500).json({ message: "Server error" });
  }
};

export const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(subscribers);
  } catch (error) {
    console.log("Error fetching subscribers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    const subscriber = await Subscriber.findByPk(id);
    
    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }

    await subscriber.destroy();
    res.status(200).json({ message: "Subscriber deleted successfully" });
  } catch (error) {
    console.log("Error deleting subscriber:", error);
    res.status(500).json({ message: "Server error" });
  }
};