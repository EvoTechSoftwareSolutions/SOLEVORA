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

    await sendEmail(
      email,
      "🎉 Welcome to SoleVora! 10% OFF your first order",
      htmlTemplate
    );

    res.status(200).json({ message: "Thank you for subscribing 🎉" });

  } catch (error) {
    console.log("Email error:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Email already subscribed" });
    }

    res.status(500).json({ message: "Server error" });
  }
};