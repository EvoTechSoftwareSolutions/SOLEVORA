import nodemailer from "nodemailer";

export const sendStockEmail = async ({ productId, name, size, qty }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.verify(); // IMPORTANT DEBUG STEP

    let subject = qty <= 0 ? "❌ STOCK FINISHED" : "⚠ LOW STOCK ALERT";
    let color = qty <= 0 ? "#dc2626" : "#f59e0b";

    const html = `
      <div style="font-family:Arial;background:#f4f6f8;padding:20px">
        <div style="max-width:600px;margin:auto;background:white;border-radius:10px;overflow:hidden">

          <div style="background:${color};color:white;padding:15px;text-align:center">
            <h2>${subject}</h2>
          </div>

          <div style="padding:20px">
            <p><b>Product ID:</b> ${productId}</p>
            <p><b>Name:</b> ${name}</p>
            <p><b>Size:</b> ${size}</p>
            <p><b>Stock:</b> ${qty}</p>
          </div>

        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Stock System" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject,
      html,
    });

    console.log("EMAIL SENT:", info.messageId);

  } catch (err) {
    console.log("EMAIL ERROR:", err.message);
  }
};