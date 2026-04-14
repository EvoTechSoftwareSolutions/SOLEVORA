import nodemailer from 'nodemailer';

// Gmail transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        // Prefer env vars; fall back to hardcoded credentials for demo/local dev
        user: process.env.GMAIL_USER || 'prasadkumarasinghe725@gmail.com',
        pass: process.env.GMAIL_PASS || 'cagjsncvfzgyejcm',
    },
});

/**
 * Sends a generic email
 */
export const sendEmail = async ({ to, subject, html }) => {
    try {
        console.log(`Attempting to send email to: ${to} with subject: ${subject}`);
        const info = await transporter.sendMail({
            from: process.env.GMAIL_USER || 'prasadkumarasinghe725@gmail.com',
            to,
            subject,
            html,
        });
        console.log('Email sent successfully:', info.messageId);
        return { success: true };
    } catch (error) {
        console.error('CRITICAL: Email sending failed!');
        console.error('Error details:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Sends an Order Confirmation email
 */
export const sendOrderConfirmationEmail = async (order, items) => {
    const isCOD = order.payment_method === 'cod';
    const statusText = isCOD ? 'Order Placed (COD)' : 'Order Confirmed & Paid';
    
    // Generate items HTML
    const itemsHtml = items.map(item => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
                <strong>${item.product?.name || 'Product'}</strong><br/>
                <small>Size: ${item.size || 'N/A'}</small>
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${Number(item.price_at_purchase || 0).toFixed(2)}</td>
        </tr>
    `).join('');

    const html = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
            <div style="background: #1a1a2e; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="color: #f97316; margin: 0; font-size: 28px;">SoleVora</h1>
                <p style="color: #fff; margin: 10px 0 0; opacity: 0.9;">${statusText}</p>
            </div>
            
            <div style="background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                <h2 style="font-size: 20px; margin-top: 0; color: #1a1a2e;">Thank you for your order!</h2>
                <p>Hello,</p>
                <p>We've received your order <strong>#${order.id}</strong> and we're getting it ready for you.</p>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0;">
                    <h3 style="font-size: 16px; margin-top: 0; color: #1a1a2e; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Order Summary</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="font-size: 12px; color: #64748b; text-transform: uppercase;">
                                <th style="text-align: left; padding: 10px 0;">Item</th>
                                <th style="text-align: center; padding: 10px 0;">Qty</th>
                                <th style="text-align: right; padding: 10px 0;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>
                    
                    <div style="margin-top: 15px; text-align: right;">
                        <p style="margin: 5px 0; font-size: 14px; opacity: 0.8;">Shipping: Free</p>
                        <p style="margin: 5px 0; font-size: 18px; font-weight: 700; color: #1a1a2e;">Total: $${Number(order.total_amount).toFixed(2)}</p>
                    </div>
                </div>

                <div style="margin: 25px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <h4 style="margin: 0 0 8px; font-size: 13px; color: #64748b; text-transform: uppercase;">Shipping To:</h4>
                        <p style="margin: 0; font-size: 14px;">${order.shipping_address}</p>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 40px; padding-top: 25px; border-top: 1px solid #e5e7eb;">
                    <a href="http://localhost:5173/track-order" style="display: inline-block; padding: 12px 25px; background: #f97316; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px;">Track Your Order</a>
                </div>
            </div>
            
            <div style="text-align: center; padding: 20px; font-size: 12px; color: #94a3b8;">
                <p>&copy; ${new Date().getFullYear()} SoleVora. All rights reserved.</p>
                <p>If you have any questions, reply to this email or contact support.</p>
            </div>
        </div>
    `;

    return sendEmail({
        to: order.email,
        subject: `SoleVora Order Confirmation: #${order.id}`,
        html,
    });
};
