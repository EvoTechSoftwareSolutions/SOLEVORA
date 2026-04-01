import Contact from "../models/contact.js";

export const submitContact = async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    // validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const newContact = await Contact.create({
      name,
      phone,
      email,
      subject,
      message,
    });

    res.status(201).json({
      message: "Message sent successfully",
      data: newContact,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await Contact.count({
      where: {
        isRead: false
      }
    });
    res.status(200).json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact message not found" });
    }
    
    contact.isRead = true;
    await contact.save();
    
    res.status(200).json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};