import prisma from "../prisma/client.js";
import nodemailer from 'nodemailer';

// Get all messages
export const getAllMessages = async (req, res) => {
  try {
    const messages = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get unread messages count
export const getUnreadMessagesCount = async (req, res) => {
  try {
    const count = await prisma.contact.count({
      where: { isRead: false }
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark message as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await prisma.contact.update({
      where: { id: Number(id) },
      data: { isRead: true }
    });
    res.json({ success: true, message: "Message marked as read", data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create message (Public endpoint)
export const createMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const newMessage = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        subject,
        message
      }
    });
    res.status(201).json({ success: true, message: "Message sent successfully", data: newMessage });

    // Send automated reply email
    try {
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
        subject: "We've received your message! - SoleVora",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #f97316;">Hello ${name},</h2>
            <p>Thank you for reaching out to SoleVora. We have received your message regarding "<strong>${subject || 'General Inquiry'}</strong>".</p>
            <p>Our team will review your message and get back to you as soon as possible (usually within 24-48 hours).</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <p style="margin: 0; font-size: 14px; color: #666;">Your Message Summary:</p>
              <p style="font-style: italic; color: #333;">"${message}"</p>
            </div>
            <p style="margin-top: 30px;">Best regards,<br/>The SoleVora Team</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.error("Error sending contact reply email:", err);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send Administrative Reply
export const sendReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    const originalMessage = await prisma.contact.findUnique({
      where: { id: Number(id) }
    });

    if (!originalMessage) {
      return res.status(404).json({ success: false, message: "Original message not found" });
    }

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
      from: `"SoleVora Support" <${process.env.GMAIL_USER}>`,
      to: originalMessage.email,
      subject: `Re: ${originalMessage.subject || 'General Inquiry'} - SoleVora`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #f97316;">Hello ${originalMessage.name},</h2>
          <p>Thank you for your patience. Regarding your message:</p>
          <div style="background: #f0f0f0; padding: 10px; border-radius: 5px; margin-bottom: 20px; color: #555; font-size: 13px;">
            "${originalMessage.message}"
          </div>
          <div style="line-height: 1.6; color: #333;">
            ${reply.replace(/\n/g, '<br/>')}
          </div>
          <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; font-size: 12px; color: #888;">
            Step confidently with SoleVora.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    
    // Mark as read if it wasn't
    await prisma.contact.update({
      where: { id: Number(id) },
      data: { isRead: true }
    });

    res.json({ success: true, message: "Reply sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
