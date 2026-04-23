import prisma from "../prisma/client.js";
import { orderSchema } from "../validators/order.validator.js";
import { generateTrackingNumber, getEstimatedDelivery } from "../utils/TrackOrder.js";
// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const result = orderSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.issues.map(err => ({
          field: err.path[0],
          message: err.message
        }))
      });
    }

    const userId = req.user?.id || req.body.userId;

    const {
      customerName,
      email,
      contactNumber,
      shippingAddress,
      items,
      paymentMethod
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // CREATE ORDER
    const order = await prisma.order.create({
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
        actualDelivery: null,
        totalAmount: 0
      }
    });

    let total = 0;

    for (const item of items) {

      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      // FIFO STOCK
      const stocks = await prisma.productStock.findMany({
        where: {
          productId: item.productId,
          size: item.size,
          quantity: { gt: 0 }
        },
        orderBy: { createdAt: "asc" } 
      });

      const totalStock = stocks.reduce((sum, s) => sum + s.quantity, 0);

      if (totalStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name} - Size ${item.size}`
        });
      }

      let remainingQty = item.quantity;
      let costPrice = 0;

      // FIFO DEDUCTION
      for (const stock of stocks) {
        if (remainingQty <= 0) break;

        const deduct = Math.min(stock.quantity, remainingQty);

        await prisma.productStock.update({
          where: { id: stock.id },
          data: {
            quantity: stock.quantity - deduct
          }
        });

        costPrice = stock.costPrice;
        remainingQty -= deduct;
      }

      const itemTotal = item.quantity * item.price;
      total += itemTotal;

      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          productName: product.name,
          size: item.size,
          quantity: item.quantity,
          sellingPrice: item.price,
          costPrice: costPrice
        }
      });
    }

    // UPDATE TOTAL
    await prisma.order.update({
      where: { id: order.id },
      data: { totalAmount: total }
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
        data: {
        orderId: order.id,
        trackingNumber: order.trackingNumber,
        estimatedDelivery: order.estimatedDelivery,
              totalAmount: total
      }
     
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL ORDERS (ADMIN / STORE MANAGER)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      data: orders,
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
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.status(200).json({
      success: true,
      data: orders
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
        items: {
          include: {
            product: true,
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

    res.status(200).json({
      success: true,
      data: order,
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
    const { status, paymentStatus } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: Number(id) }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: {
        status: status ? status.toUpperCase() : order.status,
        paymentStatus: paymentStatus
          ? paymentStatus.toUpperCase()
          : order.paymentStatus
      },
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: "Order updated successfully",
      data: updatedOrder
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
