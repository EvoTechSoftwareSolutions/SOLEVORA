import prisma from "../prisma/client.js";

export const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const exists = await prisma.wishlist.findFirst({
      where: { userId, productId }
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Already in wishlist"
      });
    }

    const wishlist = await prisma.wishlist.create({
      data: {
        userId: Number(userId),
        productId: Number(productId)
      }
    });

    res.status(201).json({
      success: true,
      data: wishlist
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


export const removeFromWishlist = async (req, res) => {
  try {
    const userId = Number(req.params.uid);
    const productId = Number(req.params.productId);

    const deleted = await prisma.wishlist.deleteMany({
      where: {
        userId,
        productId
      }
    });

    if (deleted.count === 0) {
      return res.status(404).json({
        success: false,
        message: "Item not found in wishlist"
      });
    }

    res.json({
      success: true,
      message: "Item removed from wishlist"
    });

  } catch (error) {
    console.error("Wishlist delete error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while removing wishlist item",
      error: error.message
    });
  }
};



export const getWishlist = async (req, res) => {
  try {
    const userId = Number(req.params.uid);

    // 🔥 validation
    if (!userId || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    const wishlist = await prisma.wishlist.findMany({
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

    if (!wishlist.length) {
      return res.json({
        success: true,
        data: [],
        message: "Wishlist is empty"
      });
    }

    res.json({
      success: true,
      data: wishlist
    });

  } catch (error) {
    console.error("Wishlist error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
      error: error.message 
    });
  }
};