import prisma from "../prisma/client.js";

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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
