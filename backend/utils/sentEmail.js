// backend/utils/sendEmail.js
import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    secure: true,
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: "sajeesajeevan1998@gmail.com", 
      pass: "wtkdjjqxisvhaqty",
    },
  });

  await transporter.sendMail({
    from: `"SoleVora" <sajeesajeevan1998@gmail.com>`,
    to,
    subject,
    html,
  });
};