import crypto from "crypto";
import prisma from "../prisma/client.js";
import { sendOrderConfirmationEmail } from "../utils/emailService.js";
import {
  generateTrackingNumber,
  getEstimatedDelivery,
} from "../utils/TrackOrder.js";
import { sendStockSMS } from "../utils/stockSms.js";

const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID;
const PAYHERE_SECRET = process.env.PAYHERE_SECRET;

if (!PAYHERE_MERCHANT_ID || !PAYHERE_SECRET) {
  console.error("Missing PayHere credentials in environment variables");
}

/* 
   1. Generate PayHere Hash
 */
export const generatePaymentHash = async (req, res) => {
  try {
    const {
      amount,
      currency = "LKR",

      userId,
      customerName,
      email,
      contactNumber,
      shippingAddress,
      items,
      shippingCharge,
      promoDiscount,
      promoCode,
    } = req.body;

    if (!amount || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters: amount, items",
      });
    }

    if (!PAYHERE_MERCHANT_ID || !PAYHERE_SECRET) {
      return res.status(500).json({
        success: false,
        message: "PayHere credentials not configured",
      });
    }

    // IMPORTANT: normalize amount once only
    const normalizedAmount = Number(amount).toFixed(2);
    const currencyStr = currency.toUpperCase();

    console.log("[PayHere] Amount received:", normalizedAmount);

    // Store pending payment
    const pendingPayment = await prisma.pendingpayment.create({
      data: {
        userId: userId ? Number(userId) : null,
        customerName,
        email,
        contactNumber,
        shippingAddress,
        items: JSON.stringify(items),

        shippingCharge: Number(shippingCharge || 0),
        promoDiscount: Number(promoDiscount || 0),

        promoCode: promoCode || null,

        // IMPORTANT: store exact normalized amount
        totalAmount: Number(normalizedAmount),

        currency: currencyStr,
        status: "PENDING",

        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });

    // Generate PayHere hash
    const hashedSecret = crypto
      .createHash("md5")
      .update(PAYHERE_SECRET)
      .digest("hex")
      .toUpperCase();

    const hashString =
      `${PAYHERE_MERCHANT_ID}` +
      `${pendingPayment.id}` +
      `${normalizedAmount}` +
      `${currencyStr}` +
      `${hashedSecret}`;

    const hash = crypto
      .createHash("md5")
      .update(hashString)
      .digest("hex")
      .toUpperCase();

    console.log(
      `[PayHere] Hash generated for pending payment #${pendingPayment.id}`,
    );

    return res.status(200).json({
      success: true,
      data: {
        hash,
        merchant_id: PAYHERE_MERCHANT_ID,
        pending_payment_id: pendingPayment.id,
        amount: normalizedAmount,
      },
    });
  } catch (error) {
    console.error("[PayHere] generatePaymentHash error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate payment hash",
    });
  }
};

/* 
   2. PayHere Webhook Notification
 */
export const handlePaymentNotification = async (req, res) => {
  console.log(" WEBHOOK HIT");
  console.log("IP:", req.ip);
  console.log("BODY:", req.body);
  res.status(200).send("OK");

  try {
    const {
      order_id,
      payment_id,
      status_code,
      payhere_amount,
      payhere_currency,
      md5sig,
    } = req.body;

    console.log("[PayHere] Notification received:", req.body);

    if (!PAYHERE_MERCHANT_ID || !PAYHERE_SECRET) {
      console.error("[PayHere] Missing credentials");
      return;
    }

    // Verify signature
    const hashedSecret = crypto
      .createHash("md5")
      .update(PAYHERE_SECRET)
      .digest("hex")
      .toUpperCase();

    const hashString =
      `${PAYHERE_MERCHANT_ID}` +
      `${order_id}` +
      `${payhere_amount}` +
      `${payhere_currency}` +
      `${status_code}` +
      `${hashedSecret}`;

    const expectedHash = crypto
      .createHash("md5")
      .update(hashString)
      .digest("hex")
      .toUpperCase();

    if ((md5sig || "").toUpperCase() !== expectedHash) {
      console.error("[PayHere] INVALID SIGNATURE");

      await prisma.pendingpayment.update({
        where: { id: Number(order_id) },
        data: { status: "FAILED" },
      });

      return;
    }

    const statusCode = Number(status_code);

    // Find pending payment
    const pending = await prisma.pendingpayment.findUnique({
      where: { id: Number(order_id) },
    });

    if (!pending) {
      console.error(`[PayHere] Pending payment #${order_id} not found`);
      return;
    }

    // Prevent duplicate webhook processing
    if (pending.status === "COMPLETED") {
      console.warn(`[PayHere] Duplicate notification for #${order_id}`);
      return;
    }

    // Verify amount
    const expectedAmount = Number(pending.totalAmount).toFixed(2);

    const receivedAmount = Number(payhere_amount).toFixed(2);

    if (expectedAmount !== receivedAmount) {
      console.error(
        `[PayHere] Amount mismatch. Expected ${expectedAmount}, Received ${receivedAmount}`,
      );

      await prisma.pendingpayment.update({
        where: { id: Number(order_id) },
        data: { status: "FAILED" },
      });

      return;
    }

    /*  SUCCESS  */
    if (statusCode === 2) {
      const items = JSON.parse(pending.items);

      const order = await prisma.$transaction(async (tx) => {
        // Create order
        const newOrder = await tx.order.create({
          data: {
            userId: pending.userId,

            customerName: pending.customerName,
            email: pending.email,
            contactNumber: pending.contactNumber,
            shippingAddress: pending.shippingAddress,

            paymentMethod: "ONLINE",
            paymentStatus: "PAID",

            status: "PROCESSING",

            trackingNumber: generateTrackingNumber(),
            carrier: "AUTO-COURIER",
            estimatedDelivery: getEstimatedDelivery(),

            totalAmount: pending.totalAmount,

            shippingCharge: pending.shippingCharge,
            promoDiscount: pending.promoDiscount,
            promoCode: pending.promoCode || null,

            payherePaymentId: payment_id,

            updatedAt: new Date(),
          },
        });

        // Process items + reduce stock
        for (const item of items) {
          const product = await tx.product.findUnique({
            where: { id: Number(item.productId) },
          });

          if (!product) {
            throw new Error(`Product not found: ${item.productId}`);
          }

          const normalizedSize = String(parseFloat(item.size) || item.size);

          const stocks = await tx.productstock.findMany({
            where: {
              productId: Number(item.productId),
              size: normalizedSize,
              quantity: { gt: 0 },
            },
            orderBy: {
              createdAt: "asc",
            },
          });

          const totalStock = stocks.reduce((sum, s) => sum + s.quantity, 0);

          if (totalStock < item.quantity) {
            throw new Error(
              `Insufficient stock for ${product.name} - Size ${item.size}`,
            );
          }

          let remainingQty = Number(item.quantity);

          for (const stock of stocks) {
            if (remainingQty <= 0) break;

            const deduct = Math.min(stock.quantity, remainingQty);

            const oldQty = stock.quantity;
            const newQty = stock.quantity - deduct;

            await tx.productstock.update({
              where: { id: stock.id },
              data: { quantity: newQty },
            });

            // send only when crossing threshold
            if (oldQty > 10 && newQty <= 10) {
              await sendStockSMS({
                productId: product.id,
                name: product.name,
                size: stock.size,
                qty: newQty,
              });
            }

            // out of stock alert (only once)
            if (oldQty > 0 && newQty === 0) {
              await sendStockSMS({
                productId: product.id,
                name: product.name,
                size: stock.size,
                qty: 0,
              });
            }

            const batchSellingPrice =
              Number(stock.sellingPrice) > 0
                ? Number(stock.sellingPrice)
                : Number(product.price);

            // Create order item
            await tx.orderitem.create({
              data: {
                orderId: newOrder.id,

                productId: Number(item.productId),

                productName: product.name,

                size: item.size,

                quantity: deduct,

                sellingPrice: batchSellingPrice,

                costPrice: Number(stock.costPrice),
              },
            });

            remainingQty -= deduct;
          }
        }

        // Update promo usage
        if (pending.promoCode) {
          const promo = await tx.promocode.findUnique({
            where: {
              code: pending.promoCode.toUpperCase(),
            },
          });

          if (
            promo &&
            promo.isActive &&
            (!promo.maxUses || promo.usedCount < promo.maxUses)
          ) {
            await tx.promocode.update({
              where: { id: promo.id },
              data: {
                usedCount: {
                  increment: 1,
                },
              },
            });
          }
        }

        // IMPORTANT:
        // NEVER recalculate total after payment
        return await tx.order.update({
          where: { id: newOrder.id },
          data: {
            totalAmount: pending.totalAmount,
            updatedAt: new Date(),
          },
        });
      });

      // Mark pending payment completed
      await prisma.pendingpayment.update({
        where: { id: Number(order_id) },
        data: {
          status: "COMPLETED",
          orderId: order.id,
        },
      });

      // Send confirmation email
      const orderItems = await prisma.orderitem.findMany({
        where: {
          orderId: order.id,
        },
        include: {
          product: {
            include: {
              productimage: true,
            },
          },
        },
      });

      await sendOrderConfirmationEmail(order, orderItems);

      console.log(`[PayHere] Order #${order.id} created successfully`);
    } else if (statusCode === 0) {

    /*  PENDING  */
      console.log(`[PayHere] Payment pending for #${order_id}`);
    } else {

    /*  FAILED  */
      await prisma.pendingpayment.update({
        where: { id: Number(order_id) },
        data: { status: "FAILED" },
      });

      console.log(`[PayHere] Payment failed for #${order_id}`);
    }
  } catch (error) {
    console.error("[PayHere] handlePaymentNotification error:", error);
  }
};

/* 
   3. Poll Pending Payment
 */
export const getOrderFromPendingPayment = async (req, res) => {
  try {
    const { pendingId } = req.params;

    const pending = await prisma.pendingpayment.findUnique({
      where: {
        id: Number(pendingId),
      },
    });

    if (!pending) {
      return res.status(404).json({
        success: false,
        message: "Pending payment not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        status: pending.status,
        orderId: pending.orderId || null,
      },
    });
  } catch (error) {
    console.error("[PayHere] getOrderFromPendingPayment error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
