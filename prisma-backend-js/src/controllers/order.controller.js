import prisma from "../prisma/client.js";
import { orderSchema } from "../validators/order.validator.js";
import { generateTrackingNumber, getEstimatedDelivery } from "../utils/TrackOrder.js";
import { sendOrderConfirmationEmail } from "../utils/emailService.js";
// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const result = orderSchema.safeParse(req.body);

    if (!result.success) {
      console.log("ORDER_VALIDATION_ERROR:", JSON.stringify(result.error.format(), null, 2));
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map(err => ({
          field: err.path[0],
          message: err.message
        }))
      });
    }

    const userId = req.user?.id ? Number(req.user.id) : (req.body.userId ? Number(req.body.userId) : null);
    const { 
      items, 
      paymentMethod, 
      customerName, 
      email, 
      contactNumber, 
      shippingAddress, 
      promoCode, 
      promoDiscount, 
      shippingCharge, 
      totalAmount 
    } = req.body;

    if (!items || items.length === 0) {
      console.log("ORDER_ERROR: Cart is empty", JSON.stringify(req.body, null, 2));
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // WRAP EVERYTHING IN A TRANSACTION
    const finalOrder = await prisma.$transaction(async (tx) => {
      
      // 1. Initial Order Creation (inside transaction)
      const order = await tx.order.create({
        data: {
          userId,
          customerName,
          email,
          contactNumber,
          shippingAddress,
          paymentMethod: paymentMethod.toUpperCase(),
          paymentStatus: "PENDING",
          status: "PENDING",
          trackingNumber: generateTrackingNumber(),
          carrier: "AUTO-COURIER",
          estimatedDelivery: getEstimatedDelivery(),
          totalAmount: totalAmount || 0,
          shippingCharge: shippingCharge || 0,
          promoDiscount: promoDiscount || 0,
          promoCode: promoCode || null,
          updatedAt: new Date()
        }
      });

      let total = 0;

      for (const item of items) {
        // 2. Validate Product Existence
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        // 3. Check and Deduct Stock (using tx)
        // Normalize size (e.g., "9.0" -> "9")
        const normalizedSize = String(parseFloat(item.size) || item.size);

        const stocks = await tx.productstock.findMany({
          where: { productId: item.productId, size: normalizedSize, quantity: { gt: 0 } },
          orderBy: { createdAt: "asc" }
        });

        const totalStock = stocks.reduce((sum, s) => sum + s.quantity, 0);
        if (totalStock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name} - Size ${item.size}`);
        }

        let remainingQty = item.quantity;
        let totalItemPrice = 0;

        for (const stock of stocks) {
          if (remainingQty <= 0) break;
          const deduct = Math.min(stock.quantity, remainingQty);
          
          await tx.productstock.update({
            where: { id: stock.id },
            data: { quantity: stock.quantity - deduct }
          });

          // Use the batch's sellingPrice if available (>0), else fallback to product price
          const batchSellingPrice = (Number(stock.sellingPrice) > 0) 
            ? Number(stock.sellingPrice) 
            : Number(product.price);

          // 4. Create Order Item for this specific batch
          await tx.orderitem.create({
            data: {
              orderId: order.id,
              productId: item.productId,
              productName: product.name,
              size: item.size,
              quantity: deduct,
              sellingPrice: batchSellingPrice,
              costPrice: Number(stock.costPrice)
            }
          });

          totalItemPrice += (deduct * batchSellingPrice);
          remainingQty -= deduct;
        }

        total += totalItemPrice;
      }

      // 5. Handle Promo Code Usage
      if (promoCode) {
        const promo = await tx.promocode.findUnique({
          where: { code: promoCode.toUpperCase() }
        });

        if (promo) {
          if (!promo.isActive) throw new Error("This promo code is no longer active");
          if (promo.expiresAt && new Date() > new Date(promo.expiresAt)) throw new Error("This promo code has expired");
          if (promo.maxUses && promo.usedCount >= promo.maxUses) throw new Error("This promo code has reached its usage limit");

          // Increment usedCount
          await tx.promocode.update({
            where: { id: promo.id },
            data: { usedCount: { increment: 1 } }
          });
        }
      }

      // 6. Finalize Total (items sum − promo discount + shipping)
      const finalTotal = Math.max(0, total - (promoDiscount || 0) + (shippingCharge || 0));
      return await tx.order.update({
        where: { id: order.id },
        data: { 
          totalAmount: finalTotal,
          updatedAt: new Date()
        }
      });
    });

    // 6. Send Confirmation Email (Async - don't block response)
    // Only send here for COD. Online payments send after successful payment notification.
    if (finalOrder.paymentMethod === 'COD') {
      const orderItems = await prisma.orderitem.findMany({
        where: { orderId: finalOrder.id },
        include: {
          product: {
            include: { productimage: true }
          }
        }
      });
      sendOrderConfirmationEmail(finalOrder, orderItems);
    }

    // If we reached here, everything succeeded and is committed to DB
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        orderId: finalOrder.id,
        trackingNumber: finalOrder.trackingNumber,
        totalAmount: finalOrder.totalAmount
      }
    });

  } catch (error) {
    console.error("ORDER_CREATION_TRANSACTION_ERROR:", error.message);
    // If ANY error happened inside the transaction, nothing is saved.
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL ORDERS (ADMIN / STORE MANAGER)
export const getAllOrders = async (req, res) => {
  try {
    const { status, startDate, endDate, search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {};

    if (status && status !== 'All Orders') {
      where.status = status.toUpperCase();
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    if (search) {
      where.OR = [
        { id: isNaN(Number(search)) ? undefined : Number(search) },
        { email: { contains: search, mode: 'insensitive' } },
        { trackingNumber: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } }
      ].filter(Boolean);
    }

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: true,
          orderitem: {
            include: {
              product: {
                include: { productimage: true }
              }
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.order.count({ where })
    ]);

    const mappedOrders = orders.map(order => ({
      ...order,
      total_amount: order.totalAmount,
      contact_number: order.contactNumber,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      shipping_address: order.shippingAddress,
      tracking_number: order.trackingNumber,
      carrier: order.carrier,
      estimated_delivery: order.estimatedDelivery,
      items: order.orderitem.map(item => ({
        ...item,
        price_at_purchase: item.sellingPrice
      }))
    }));

    res.status(200).json({
      success: true,
      data: mappedOrders,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAllOrdersByUserID = async (req, res) => {
  try {
    const userId = req.user?.id; 

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: Number(userId) 
      },
      include: {
        user: true,
        orderitem: {
          include: {
            product: {
              include: { productimage: true }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    const mappedOrders = orders.map(order => ({
      ...order,
      total_amount: order.totalAmount,
      contact_number: order.contactNumber,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      shipping_address: order.shippingAddress,
      tracking_number: order.trackingNumber,
      carrier: order.carrier,
      estimated_delivery: order.estimatedDelivery,
      items: order.orderitem.map(item => ({
        ...item,
        price_at_purchase: item.sellingPrice
      }))
    }));

    res.status(200).json({
      success: true,
      data: mappedOrders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//  GET SINGLE ORDER BY ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: true,
        orderitem: {
          include: {
            product: {
              include: { productimage: true }
            }
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const mappedOrder = {
      ...order,
      total_amount: order.totalAmount,
      contact_number: order.contactNumber,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      shipping_address: order.shippingAddress,
      tracking_number: order.trackingNumber,
      carrier: order.carrier,
      estimated_delivery: order.estimatedDelivery,
      items: order.orderitem.map(item => ({
        ...item,
        price_at_purchase: item.sellingPrice
      }))
    };

    res.status(200).json({
      success: true,
      data: mappedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE ORDER STATUS (ADMIN / STORE MANAGER)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus, tracking_number, carrier, estimated_delivery } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        orderitem: true
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Restore stock when status changes to CANCELLED
    const newStatus = status ? status.toUpperCase() : order.status;
    const wasCancelled = order.status === 'CANCELLED';
    if (newStatus === 'CANCELLED' && !wasCancelled) {
      for (const item of order.orderitem) {
        const normalizedSize = String(parseFloat(item.size) || item.size);
        const stockEntry = await prisma.productstock.findFirst({
          where: { productId: item.productId, size: normalizedSize }
        });
        if (stockEntry) {
          await prisma.productstock.update({
            where: { id: stockEntry.id },
            data: { quantity: { increment: item.quantity } }
          });
        }
      }

      // Decrement promo usedCount when order is cancelled
      if (order.promoCode) {
        const promo = await prisma.promocode.findUnique({ where: { code: order.promoCode } });
        if (promo && promo.usedCount > 0) {
          await prisma.promocode.update({
            where: { id: promo.id },
            data: { usedCount: { decrement: 1 } }
          });
        }
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: {
        status: newStatus,
        paymentStatus: paymentStatus
          ? paymentStatus.toUpperCase()
          : order.paymentStatus,
        ...(tracking_number !== undefined && { trackingNumber: tracking_number }),
        ...(carrier !== undefined && { carrier }),
        ...(estimated_delivery !== undefined && { estimatedDelivery: estimated_delivery ? new Date(estimated_delivery) : null }),
        updatedAt: new Date()
      },
      include: {
        user: true,
        orderitem: {
          include: {
            product: {
              include: { productimage: true }
            }
          }
        }
      }
    });

    // Send confirmation email if manually marked as PAID and it wasn't paid before
    if (paymentStatus?.toUpperCase() === 'PAID' && order.paymentStatus !== 'PAID') {
      try {
        sendOrderConfirmationEmail(updatedOrder, updatedOrder.orderitem);
      } catch (emailError) {
        console.error('Failed to send manual payment confirmation email:', emailError);
      }
    }

    const mappedOrder = {
      ...updatedOrder,
      total_amount: updatedOrder.totalAmount,
      contact_number: updatedOrder.contactNumber,
      payment_method: updatedOrder.paymentMethod,
      payment_status: updatedOrder.paymentStatus,
      shipping_address: updatedOrder.shippingAddress,
      tracking_number: updatedOrder.trackingNumber,
      carrier: updatedOrder.carrier,
      estimated_delivery: updatedOrder.estimatedDelivery,
      items: updatedOrder.orderitem.map(item => ({
        ...item,
        price_at_purchase: item.sellingPrice
      }))
    };

    res.json({
      success: true,
      message: "Order updated successfully",
      data: mappedOrder
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE ORDER (ADMIN / STORE MANAGER) — restores stock automatically via Cascade
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: { orderitem: true }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Restore stock for non-cancelled orders before deleting
    if (order.status !== 'CANCELLED') {
      for (const item of order.orderitem) {
        const normalizedSize = String(parseFloat(item.size) || item.size);
        const stockEntry = await prisma.productstock.findFirst({
          where: { productId: item.productId, size: normalizedSize }
        });
        if (stockEntry) {
          await prisma.productstock.update({
            where: { id: stockEntry.id },
            data: { quantity: { increment: item.quantity } }
          });
        }
      }
    }

    // Decrement promo usedCount when order is deleted (if not already cancelled — cancelled orders already decremented)
    if (order.promoCode && order.status !== 'CANCELLED') {
      const promo = await prisma.promocode.findUnique({ where: { code: order.promoCode } });
      if (promo && promo.usedCount > 0) {
        await prisma.promocode.update({
          where: { id: promo.id },
          data: { usedCount: { decrement: 1 } }
        });
      }
    }

    // Delete the order (orderitems cascade-deleted via schema)
    await prisma.order.delete({ where: { id: Number(id) } });

    res.json({ success: true, message: "Order deleted and stock restored successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// TOGGLE ORDER STATUS (ACTIVE / INACTIVE)
export const toggleOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: Number(id) }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: { isActive: !order.isActive }
    });

    res.json({ 
      success: true, 
      message: `Order marked as ${updatedOrder.isActive ? 'Active' : 'Inactive'}`,
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// SEARCH ORDERS BY EMAIL (Public)
export const searchOrders = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const orders = await prisma.order.findMany({
      where: { email },
      include: {
        orderitem: {
          include: {
            product: {
              include: { productimage: true }
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const mappedOrders = orders.map(order => ({
      ...order,
      total_amount: order.totalAmount,
      contact_number: order.contactNumber,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      shipping_address: order.shippingAddress,
      tracking_number: order.trackingNumber,
      carrier: order.carrier,
      estimated_delivery: order.estimatedDelivery,
      items: order.orderitem.map(item => ({
        ...item,
        price_at_purchase: item.sellingPrice
      }))
    }));

    res.status(200).json(mappedOrders); // TrackOrder.jsx expects response.data to be the array
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// CANCEL ORDER (USER)
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        orderitem: true
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Check ownership
    if (order.userId !== Number(userId)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this order"
      });
    }

    // Check if order can be cancelled (only if pending or processing)
    if (!['PENDING', 'PROCESSING'].includes(order.status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}`
      });
    }

    // Restore stock
    for (const item of order.orderitem) {
      const normalizedSize = String(parseFloat(item.size) || item.size);
      const stockEntry = await prisma.productstock.findFirst({
        where: { productId: item.productId, size: normalizedSize }
      });
      if (stockEntry) {
        await prisma.productstock.update({
          where: { id: stockEntry.id },
          data: { quantity: { increment: item.quantity } }
        });
      }
    }

    // Decrement promo usedCount when user cancels order
    if (order.promoCode) {
      const promo = await prisma.promocode.findUnique({ where: { code: order.promoCode } });
      if (promo && promo.usedCount > 0) {
        await prisma.promocode.update({
          where: { id: promo.id },
          data: { usedCount: { decrement: 1 } }
        });
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: {
        status: 'CANCELLED',
        updatedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: updatedOrder
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
