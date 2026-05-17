import axios from "axios";

export const sendStockSMS = async ({ productId, name, size, qty }) => {
  try {
    let message = "";

    if (qty <= 0) {
      message = ` STOCK FINISHED\nProduct ID: ${productId}\nName: ${name}\nSize: ${size}\nStock: 0`;
    } 
    else if (qty < 10) {
      message = `⚠ LOW STOCK ALERT\nProduct ID: ${productId}\nName: ${name}\nSize: ${size}\nStock: ${qty}`;
    }

    if (!message) return;

    const res = await axios.get("https://app.notify.lk/api/v1/send", {
      params: {
        user_id: process.env.NOTIFY_USER_ID,
        api_key: process.env.NOTIFY_API_KEY,
        sender_id: "NotifyDEMO",
        to: process.env.ADMIN_PHONE,
        message: message,
      },
    });

    console.log("SMS SENT:", res.data);

  } catch (err) {
    console.log("SMS ERROR:", err.response?.data || err.message);
  }
};