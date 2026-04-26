import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, html, attachments = []) => {
  const transporter = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      user: process.env.GMAIL_USER || 'sajeesajeevan1998@gmail.com',
      pass: process.env.GMAIL_PASS || 'wtkdjjqxisvhaqty',
    },
  });

  await transporter.sendMail({
    from: `"SoleVora" <${process.env.GMAIL_USER || 'sajeesajeevan1998@gmail.com'}>`,
    to,
    subject,
    html,
    attachments,
  });
};
