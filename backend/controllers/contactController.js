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