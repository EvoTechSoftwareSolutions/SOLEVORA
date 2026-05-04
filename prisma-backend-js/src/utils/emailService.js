import nodemailer from 'nodemailer';

// Create a transporter function to ensure env vars are loaded
const getTransporter = () => {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_PASS?.replace(/\s/g, '');

  if (!user || !pass) {
    console.error('❌ Email credentials missing in environment variables');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user,
      pass: pass,
    },
  });
};

/**
 * Send Order Confirmation Email
 * @param {Object} order - The order object from database
 * @param {Array} items - List of items in the order
 */
export const sendOrderConfirmationEmail = async (order, items) => {
  try {
    const { id, customerName, email, totalAmount, shippingAddress, paymentMethod, trackingNumber } = order;

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';
    
    const itemsHtml = items.map(item => {
      let imgUrl = 'https://via.placeholder.com/80';
      
      const productImg = item.product?.productimage?.[0]?.url;
      if (productImg) {
        if (productImg.startsWith('http')) {
          imgUrl = productImg;
        } else {
          // Ensure no double slashes and use absolute backend URL
          const cleanPath = productImg.startsWith('/') ? productImg : `/${productImg}`;
          imgUrl = `${backendUrl}${cleanPath}`;
        }
      }

      return `
        <tr style="border-bottom: 1px solid #eeeeee;">
          <td style="padding: 15px 10px; text-align: left; vertical-align: top;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td width="60" style="vertical-align: top; padding-right: 15px;">
                  <img src="${imgUrl}" alt="${item.productName}" width="50" height="50" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid #eeeeee; display: block;" />
                </td>
                <td style="vertical-align: top;">
                  <div style="font-family: Arial, sans-serif; font-weight: bold; color: #1a1a2e; font-size: 14px; margin-bottom: 4px;">${item.productName || 'Product'}</div>
                  <div style="font-family: Arial, sans-serif; font-size: 12px; color: #64748b;">Size: ${item.size} | Qty: ${item.quantity}</div>
                </td>
              </tr>
            </table>
          </td>
          <td style="padding: 15px 10px; text-align: right; color: #1a1a2e; vertical-align: middle; font-family: Arial, sans-serif; font-weight: 600; font-size: 14px;">
            Rs. ${item.sellingPrice.toLocaleString()}
          </td>
        </tr>
      `;
    }).join('');


    const mailOptions = {
      from: `"SoleVora" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Order Confirmed: #${id} - SoleVora`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
          <!-- Header -->
          <div style="background-color: #1a1a2e; padding: 30px; text-align: center;">
            <h1 style="color: #f97316; margin: 0; font-size: 28px; letter-spacing: 2px;">SOLEVORA</h1>
            <p style="color: #ffffff; margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase;">Premium Footwear Experience</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px;">
            <h2 style="color: #1a1a2e; margin-top: 0;">Thank you for your order, ${customerName}!</h2>
            <p style="color: #555; line-height: 1.6;">We're excited to let you know that your order <strong>#${id}</strong> has been received and is now being processed.</p>
            
            <!-- Order Summary -->
            <div style="margin-top: 30px; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
              <h3 style="margin-top: 0; font-size: 16px; color: #1a1a2e; border-bottom: 2px solid #1a1a2e; padding-bottom: 8px;">Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 1px solid #ddd;">
                    <th style="padding: 10px; text-align: left; font-size: 13px; color: #666;">ITEM</th>
                    <th style="padding: 10px; text-align: right; font-size: 13px; color: #666;">PRICE</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
              
              <div style="margin-top: 15px; text-align: right;">
                <p style="margin: 5px 0; color: #666;">Subtotal: <span style="color: #333;">Rs. ${totalAmount.toLocaleString()}</span></p>
                <p style="margin: 5px 0; color: #666;">Shipping: <span style="color: #16a34a;">FREE</span></p>
                <h3 style="margin: 10px 0 0 0; color: #1a1a2e; font-size: 20px;">Total: Rs. ${totalAmount.toLocaleString()}</h3>
              </div>
            </div>
            
            <!-- Details -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 30px;">
              <tr>
                <td style="padding-bottom: 20px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td width="50%" style="vertical-align: top; padding-right: 10px;">
                        <h4 style="margin: 0 0 10px 0; color: #1a1a2e; font-family: Arial, sans-serif;">Shipping Address</h4>
                        <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.5; font-family: Arial, sans-serif;">${shippingAddress}</p>
                      </td>
                      <td width="50%" style="vertical-align: top; padding-left: 10px;">
                        <h4 style="margin: 0 0 10px 0; color: #1a1a2e; font-family: Arial, sans-serif;">Payment Method</h4>
                        <p style="margin: 0; color: #64748b; font-size: 13px; font-family: Arial, sans-serif;">${paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}</p>
                        
                        <h4 style="margin: 15px 0 10px 0; color: #1a1a2e; font-family: Arial, sans-serif;">Tracking Number</h4>
                        <p style="margin: 0; color: #f97316; font-weight: bold; font-size: 13px; font-family: Arial, sans-serif;">${trackingNumber}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            
            <!-- Button -->
            <div style="text-align: center; margin-top: 40px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile/orders" style="background-color: #1a1a2e; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-family: Arial, sans-serif; font-size: 14px;">Track Your Order</a>
            </div>
          </div>

          
          <!-- Footer -->
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #999;">
            <p style="margin: 0 0 10px 0;">If you have any questions, please contact our support team at support@solevora.com</p>
            <p style="margin: 0;">© 2026 SoleVora Inc. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    const transporter = getTransporter();
    if (!transporter) return null;

    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    // Don't throw error to avoid breaking the order process, just log it
    return null;
  }
};
