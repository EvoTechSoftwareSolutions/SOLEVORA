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
      include: { productstock: true }
    });

    // iF PRODUCT EXISTS → UPDATE STOCK AND IMAGES
    if (existingProduct) {

      // Update/add stock
      for (const s of parsedStocks) {
        const existingStock = await prisma.productstock.findFirst({
          where: {
            productId: existingProduct.id,
            size: s.size,
            costPrice: Number(s.costPrice)
          }
        });

        if (existingStock) {
          // increment quantity and update selling price
          await prisma.productstock.update({
            where: { id: existingStock.id },
            data: {
              quantity: {
                increment: Number(s.quantity)
              },
              sellingPrice: Number(s.sellingPrice && s.sellingPrice != 0 ? s.sellingPrice : (s.costPrice || existingProduct.price || 0))
            }
          });
        } else {
          // create new batch
          await prisma.productstock.create({
            data: {
              productId: existingProduct.id,
              size: s.size,
              costPrice: Number(s.costPrice),
              sellingPrice: Number(s.sellingPrice && s.sellingPrice != 0 ? s.sellingPrice : (s.costPrice || existingProduct.price || 0)),
              quantity: Number(s.quantity)
            }
          });
        }
      }

      // Add new images if provided
      if (files && files.length > 0) {
        await prisma.productimage.createMany({
          data: files.map(file => ({
            url: `/uploads/${file.filename}`,
            productId: existingProduct.id
          }))
        });
      }

      // Return updated product with images
      const updatedProduct = await prisma.product.findUnique({
        where: { id: existingProduct.id },
        include: {
          category: true,
          productimage: true,
          productstock: true
        }
      });

      return res.status(200).json({
        success: true,
        message: "Product updated (existing product)",
        data: updatedProduct
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
        updatedAt: new Date(),

        productimage: {
          create: files.map(file => ({
            url: `/uploads/${file.filename}`
          }))
        },

        productstock: {
          create: parsedStocks.map(s => ({
            size: s.size,
            costPrice: Number(s.costPrice),
            sellingPrice: Number(s.sellingPrice && s.sellingPrice != 0 ? s.sellingPrice : (s.costPrice || price || 0)),
            quantity: Number(s.quantity)
          }))
        }
      },
      include: {
        category: true,
        productimage: true,
        productstock: true
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
    const { category, gender, size, minPrice, maxPrice, sortBy } = req.query;

    const where = {
      isActive: true,
    };

    if (category && category !== "All") {
      where.category = {
        name: category
      };
    }

    if (gender && gender !== "All") {
      where.gender = {
        in: [gender.toUpperCase(), "ALL"]
      };
    }

    if (size) {
      where.productstock = {
        some: {
          size: String(size)
        }
      };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    let orderBy = { createdAt: 'desc' };
    if (sortBy === 'low-high') orderBy = { price: 'asc' };
    else if (sortBy === 'high-low') orderBy = { price: 'desc' };
    else if (sortBy === 'newest') orderBy = { createdAt: 'desc' };
    else if (sortBy === 'featured') orderBy = { createdAt: 'desc' }; // Default or specific logic

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        productimage: true,
        productstock: true,
      },
      orderBy,
    });

    // Map to match frontend expectations (images, stocks)
    const mappedProducts = products.map(p => ({
      ...p,
      images: p.productimage,
      stocks: p.productstock,
      category: p.category
    }));

    res.json({
      success: true,
      data: mappedProducts
    });

  } catch (error) {
    console.error("GET_PRODUCTS_ERROR:", error);
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
        productimage: true,
        productstock: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Map to match frontend expectations
    const mappedProducts = products.map(p => ({
      ...p,
      images: p.productimage,
      stocks: p.productstock,
      category: p.category
    }));

    res.json({
      success: true,
      data: mappedProducts
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
        productimage: true,
        productstock: true
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "there is no product"
      });
    }

    const mappedProduct = {
      ...product,
      images: product.productimage,
      stocks: product.productstock
    };

    res.json({
      success: true,
      data: mappedProduct
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
        productimage: true,
        productstock: true
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "there is no product"
      });
    }

    const mappedProduct = {
      ...product,
      images: product.productimage,
      stocks: product.productstock
    };

    res.json({
      success: true,
      data: mappedProduct
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
          const existingStock = await tx.productstock.findFirst({
            where: {
              productId: product.id,
              size: s.size,
              costPrice: Number(s.costPrice),
            },
          });

          if (existingStock) {
            await tx.productstock.update({
              where: { id: existingStock.id },
              data: { 
                quantity: Number(s.quantity),
                sellingPrice: Number(s.sellingPrice && s.sellingPrice != 0 ? s.sellingPrice : (s.costPrice || product.price || 0))
              },
            });
          } else {
            await tx.productstock.create({
              data: {
                productId: product.id,
                size: s.size,
                costPrice: Number(s.costPrice),
                sellingPrice: Number(s.sellingPrice && s.sellingPrice != 0 ? s.sellingPrice : (s.costPrice || product.price || 0)),
                quantity: Number(s.quantity),
              },
            });
          }
        }
      }

      // Add new images if any
      if (files.length > 0) {
        await tx.productimage.createMany({
          data: files.map((file) => ({
            productId: product.id,
            url: `/uploads/${file.filename}`,
          })),
        });
      }

      return await tx.product.findUnique({
        where: { id: product.id },
        include: { productstock: true, productimage: true },
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