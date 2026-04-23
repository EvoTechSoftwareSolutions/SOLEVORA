import prisma from "../prisma/client.js";

//  ADD STOCK (FIFO BATCH)
export const addStock = async (req, res) => {
  try {
    const { productId, size, costPrice, quantity } = req.body;

    if (!productId || !size || !costPrice || !quantity) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    // CHECK IF SAME BATCH EXISTS
    const existingStock = await prisma.productStock.findFirst({
      where: {
        productId: Number(productId),
        size: size,
        costPrice: parseFloat(costPrice)
      }
    });

    let stock;

    if (existingStock) {
      // UPDATE QUANTITY (same batch)
      stock = await prisma.productStock.update({
        where: { id: existingStock.id },
        data: {
          quantity: {
            increment: Number(quantity)
          }
        }
      });

    } else {
      //  CREATE NEW BATCH (different cost price)
      stock = await prisma.productStock.create({
        data: {
          productId: Number(productId),
          size,
          costPrice: parseFloat(costPrice),
          quantity: Number(quantity)
        }
      });
    }

    return res.status(201).json({
      success: true,
      message: "Stock added successfully",
      data: stock
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};;
// ✅ GET STOCK BY PRODUCT
export const getStockByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const stock = await prisma.productStock.findMany({
      where: {
        productId: Number(productId)
      },
      orderBy: {
        createdAt: "asc" // FIFO order
      }
    });

    res.json({
      success: true,
      data: stock
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// ✅ DELETE STOCK BATCH
export const deleteStock = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.productStock.delete({
      where: {
        id: Number(id)
      }
    });

    res.json({
      success: true,
      message: "Stock deleted"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};