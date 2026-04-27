import prisma from "../prisma/client.js";


// CREATE PRODUCT

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      discountPrice,
      categoryId,
      gender,
      stocks
    } = req.body;

    const files = req.files || [];

    let parsedStocks = [];
    try {
      parsedStocks = JSON.parse(stocks || "[]");
    } catch {
      parsedStocks = [];
    }

    //  CHECK EXISTING PRODUCT BY SLUG
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
      include: { stocks: true }
    });

    // iF PRODUCT EXISTS → UPDATE STOCK
    if (existingProduct) {

      for (const s of parsedStocks) {
        const existingStock = await prisma.productStock.findFirst({
          where: {
            productId: existingProduct.id,
            size: s.size,
            costPrice: Number(s.costPrice)
          }
        });

        if (existingStock) {
          // increment quantity
          await prisma.productStock.update({
            where: { id: existingStock.id },
            data: {
              quantity: {
                increment: Number(s.quantity)
              }
            }
          });
        } else {
          // create new batch
          await prisma.productStock.create({
            data: {
              productId: existingProduct.id,
              size: s.size,
              costPrice: Number(s.costPrice),
              quantity: Number(s.quantity)
            }
          });
        }
      }

      return res.status(200).json({
        success: true,
        message: "Stock updated (existing product)",
        data: existingProduct
      });
    }

    //  CREATE NEW PRODUCT

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        categoryId: Number(categoryId),
        gender,

        images: {
          create: files.map(file => ({
            url: `/uploads/${file.filename}`
          }))
        },

        stocks: {
          create: parsedStocks.map(s => ({
            size: s.size,
            costPrice: Number(s.costPrice),
            quantity: Number(s.quantity)
          }))
        }
      },
      include: {
        category: true,
        images: true,
        stocks: true
      }
    });

    res.status(201).json({
      success: true,
      message: "Product created",
      data: product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


// GET PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      include: {
        category: true,
        images: true,
        stocks: true
      }
    });

    res.json({
      success: true,
      data: products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
export const getProductsAll = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: true,
        stocks: true
      }
    });

    res.json({
      success: true,
      data: products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

//
// GET PRODUCT BY ID
//
export const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        category: true,
        images: true,
        stocks: true
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "there is no product"
      });
    }

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
export const getProductBySlug = async (req, res) => {
  try {
      const { slug } = req.params;
    const product = await prisma.product.findUnique({
      where: { slug: (slug), },
      include: {
        category: true,
        images: true,
        stocks: true
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "there is no product"
      });
    }

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

//
//  UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { stocks, name, slug, description, price, discountPrice, categoryId, gender } = req.body;
    const files = req.files || [];

    // 1. ROBUST PARSING: Ensure stocks is an array
    let parsedStocks = [];
    if (stocks) {
      try {
        // Handle both stringified JSON and already parsed objects
        parsedStocks = typeof stocks === "string" ? JSON.parse(stocks) : stocks;
      } catch (err) {
        return res.status(400).json({ success: false, message: "Invalid stocks format" });
      }
    }

    // 2. Prepare update object
    const updateData = {};
    if (name) updateData.name = name;
    if (slug) updateData.slug = slug;
    if (description) updateData.description = description;
    if (gender) updateData.gender = gender;
    if (price) updateData.price = parseFloat(price);
    if (categoryId) updateData.categoryId = Number(categoryId);
    if (discountPrice !== undefined) {
      updateData.discountPrice = discountPrice ? parseFloat(discountPrice) : null;
    }

    // 3. DATABASE TRANSACTION
    const result = await prisma.$transaction(async (tx) => {
      // Update basic fields
      const product = await tx.product.update({
        where: { id: Number(id) },
        data: updateData,
      });

      // Handle Stocks (Update existing or Create new)
      if (parsedStocks.length > 0) {
        for (const s of parsedStocks) {
          const existingStock = await tx.productStock.findFirst({
            where: {
              productId: product.id,
              size: s.size,
              costPrice: Number(s.costPrice),
            },
          });

          if (existingStock) {
            await tx.productStock.update({
              where: { id: existingStock.id },
              data: { quantity: Number(s.quantity) },
            });
          } else {
            await tx.productStock.create({
              data: {
                productId: product.id,
                size: s.size,
                costPrice: Number(s.costPrice),
                quantity: Number(s.quantity),
              },
            });
          }
        }
      }

      // Add new images if any
      if (files.length > 0) {
        await tx.productImage.createMany({
          data: files.map((file) => ({
            productId: product.id,
            url: `/uploads/${file.filename}`,
          })),
        });
      }

      return await tx.product.findUnique({
        where: { id: product.id },
        include: { stocks: true, images: true },
      });
    });

    res.json({ success: true, message: "Updated successfully", data: result });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
//  DELETE PRODUCT
//
export const deleteProduct = async (req, res) => {
  try {
    const updated = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: {
        isActive: false,
      },
    });

    res.json({
      success: true,
      message: "Product deactivated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};



// for autocomplete GET /api/products/search?name=shoe
export const searchProducts = async (req, res) => {
  try {
    const { name } = req.query;

    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      take: 10,
    });

    res.json({
      success: true,
      data: products,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};