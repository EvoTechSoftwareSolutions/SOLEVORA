import prisma from "../prisma/client.js";

// ADD TO CART
export const addToCart = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = Number(req.user.id);
    const { productId, size } = req.body;
    const parsedProductId = Number(productId);

    if (!parsedProductId || !size) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const existing = await prisma.cart.findFirst({
      where: { userId, productId: parsedProductId, size }
    });

    if (existing) {
      const updated = await prisma.cart.update({
        where: { id: existing.id },
        data: { 
          quantity: existing.quantity + 1,
          updatedAt: new Date()
        }
      });

      return res.json({
        success: true,
        data: updated
      });
    }

    const cart = await prisma.cart.create({
      data: {
        userId,
        productId: parsedProductId,
        size,
        quantity: 1,
        updatedAt: new Date()
      }
    });

    res.status(201).json({
      success: true,
      data: cart
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET USER CART
export const getCart = async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    const cart = await prisma.cart.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            productimage: true,
            category: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: cart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// UPDATE QUANTITY
export const updateCartItem = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1"
      });
    }

    const updated = await prisma.cart.update({
      where: { id: Number(cartId) },
      data: { 
        quantity,
        updatedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: "Cart updated",
      data: updated
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// REMOVE FROM CART
export const removeFromCart = async (req, res) => {
  try {
    const { cartId } = req.params;

    await prisma.cart.delete({
      where: { id: Number(cartId) }
    });

    res.json({
      success: true,
      message: "Item removed from cart"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// CLEAR CART
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    await prisma.cart.deleteMany({
      where: { userId: Number(userId) }
    });

    res.json({
      success: true,
      message: "Cart cleared after purchase"
    });

  } catch (error) {
    console.log("CLEAR_CART_ERROR:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};