import prisma from "../prisma/client.js";

//
// ADD STOCK (FIFO BATCH + SLUG SUPPORT)
//
export const addStock = async (req, res) => {
  try {
    const { productId, slug, size, costPrice, quantity } = req.body;

    // VALIDATION
    if ((!productId && !slug) || !size || !costPrice || !quantity) {
      return res.status(400).json({
        success: false,
        message: "productId or slug, size, costPrice, quantity are required",
      });
    }

    // STEP 1: FIND PRODUCT ID
    let finalProductId = productId;

    if (!finalProductId && slug) {
      const product = await prisma.product.findUnique({
        where: { slug },
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found with this slug",
        });
      }

      finalProductId = product.id;
    }

    const parsedCost = parseFloat(costPrice);
    const parsedQty = Number(quantity);

    if (isNaN(parsedCost) || isNaN(parsedQty)) {
      return res.status(400).json({
        success: false,
        message: "Invalid costPrice or quantity",
      });
    }

    // STEP 2: UPSERT STOCK (PREVENT DUPLICATE BATCH)
    const stock = await prisma.productstock.upsert({
      where: {
        productId_size_costPrice: {
          productId: Number(finalProductId),
          size: size,
          costPrice: parsedCost,
        },
      },
      update: {
        quantity: {
          increment: parsedQty,
        },
      },
      create: {
        productId: Number(finalProductId),
        size: size,
        costPrice: parsedCost,
        quantity: parsedQty,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Stock added/updated successfully",
      data: stock,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//
// GET STOCK BY PRODUCT (FIFO ORDER)
//
export const getStockByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const stock = await prisma.productstock.findMany({
      where: {
        productId: Number(productId),
      },
      orderBy: {
        createdAt: "asc", // FIFO
      },
    });

    return res.json({
      success: true,
      data: stock,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//
// DELETE STOCK BATCH
//
export const deleteStock = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.productstock.delete({
      where: {
        id: Number(id),
      },
    });

    return res.json({
      success: true,
      message: "Stock deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//
// GET ALL STOCK BATCHES (ADMIN VIEWS)
//
export const getAllStockBatches = async (req, res) => {
  try {
    const batches = await prisma.productstock.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            discountPrice: true,
            productimage: {
              take: 1,
              select: { url: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const mapped = batches.map((batch) => {
      const sellingPrice = batch.product?.discountPrice ?? batch.product?.price ?? 0;
      return {
        id: batch.id,
        createdAt: batch.createdAt,
        quantity: batch.quantity,
        original_quantity: batch.quantity,
        cost_price: Number(batch.costPrice || 0),
        selling_price: Number(sellingPrice || 0),
        product: batch.product
          ? {
              id: batch.product.id,
              name: batch.product.name,
              image_url: batch.product.productimage?.[0]?.url || "",
            }
          : null,
      };
    });

    return res.json(mapped);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};