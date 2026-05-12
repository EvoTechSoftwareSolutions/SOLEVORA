import prisma from "../prisma/client.js";

// ─── Helper: auto-deactivate any product whose total stock = 0 ───────────────
const autoDeactivateZeroStock = async () => {
  const activeProducts = await prisma.product.findMany({
    where: { isActive: true },
    include: { productstock: true },
  });

  const toDeactivate = activeProducts
    .filter((p) => p.productstock.reduce((sum, s) => sum + s.quantity, 0) === 0)
    .map((p) => p.id);

  if (toDeactivate.length > 0) {
    await prisma.product.updateMany({
      where: { id: { in: toDeactivate } },
      data: { isActive: false },
    });
  }
};

// ─── CREATE PRODUCT ───────────────────────────────────────────────────────────
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      descriptionOne,
      descriptionTwo,
      descriptionThree,
      specifications,
      price,
      discountPrice,
      categoryId,
      gender,
      stocks,
    } = req.body;

    // Validation
    if (!name?.trim())
      return res.status(400).json({ success: false, message: "Product name is required" });
    if (!slug?.trim())
      return res.status(400).json({ success: false, message: "Slug is required" });
    if (!descriptionOne?.trim())
      return res.status(400).json({ success: false, message: "Description one is required" });
    if (!price)
      return res.status(400).json({ success: false, message: "Price is required" });
    if (!categoryId)
      return res.status(400).json({ success: false, message: "Category is required" });

    const files = req.files || [];
    if (files.length > 10)
      return res.status(400).json({ success: false, error: "Maximum 10 images are allowed per product." });

    // Parse stocks & specifications
    let parsedStocks = [];
    try {
      parsedStocks = typeof stocks === "string" ? JSON.parse(stocks || "[]") : stocks || [];
    } catch { parsedStocks = []; }

    let parsedSpecifications = [];
    try {
      parsedSpecifications = typeof specifications === "string" ? JSON.parse(specifications || "[]") : specifications || [];
    } catch { parsedSpecifications = []; }

    // Determine isActive: only active if there is stock
    const totalQty = parsedStocks.reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);
    const isActive = totalQty > 0;

    // Check if product already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
      include: { productstock: true },
    });

    if (existingProduct) {
      // Update stocks
      for (const s of parsedStocks) {
        const existingStock = await prisma.productstock.findFirst({
          where: { productId: existingProduct.id, size: s.size, costPrice: Number(s.costPrice) },
        });

        if (existingStock) {
          await prisma.productstock.update({
            where: { id: existingStock.id },
            data: {
              quantity: { increment: Number(s.quantity) },
              sellingPrice: Number(s.sellingPrice && s.sellingPrice != 0 ? s.sellingPrice : s.costPrice || existingProduct.price || 0),
            },
          });
        } else {
          await prisma.productstock.create({
            data: {
              productId: existingProduct.id,
              size: s.size,
              costPrice: Number(s.costPrice),
              sellingPrice: Number(s.sellingPrice && s.sellingPrice != 0 ? s.sellingPrice : s.costPrice || existingProduct.price || 0),
              quantity: Number(s.quantity),
            },
          });
        }
      }

      // Recalculate isActive after stock update
      const allStocks = await prisma.productstock.findMany({ where: { productId: existingProduct.id } });
      const newTotal = allStocks.reduce((sum, s) => sum + s.quantity, 0);

      await prisma.product.update({
        where: { id: existingProduct.id },
        data: {
          name,
          descriptionOne,
          descriptionTwo: descriptionTwo || null,
          descriptionThree: descriptionThree || null,
          price: parseFloat(price),
          discountPrice: discountPrice ? parseFloat(discountPrice) : null,
          categoryId: Number(categoryId),
          gender,
          isActive: newTotal > 0,
          updatedAt: new Date(),
        },
      });

      await prisma.productspecification.deleteMany({ where: { productId: existingProduct.id } });
      if (parsedSpecifications.length > 0) {
        await prisma.productspecification.createMany({
          data: parsedSpecifications.map((spec) => ({ productId: existingProduct.id, key: spec.key, value: spec.value })),
        });
      }

      if (files.length > 0) {
        await prisma.productimage.createMany({
          data: files.map((file) => ({ url: `/uploads/${file.filename}`, productId: existingProduct.id })),
        });
      }

      const updatedProduct = await prisma.product.findUnique({
        where: { id: existingProduct.id },
        include: { category: true, productimage: true, productstock: true, specifications: true },
      });

      return res.status(200).json({ success: true, message: "Existing product updated successfully", data: updatedProduct });
    }

    // Create new product
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        descriptionOne,
        descriptionTwo: descriptionTwo || null,
        descriptionThree: descriptionThree || null,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        categoryId: Number(categoryId),
        gender,
        isActive,
        updatedAt: new Date(),
        productimage: { create: files.map((file) => ({ url: `/uploads/${file.filename}` })) },
        productstock: {
          create: parsedStocks.map((s) => ({
            size: s.size,
            costPrice: Number(s.costPrice),
            sellingPrice: Number(s.sellingPrice && s.sellingPrice != 0 ? s.sellingPrice : s.costPrice || price || 0),
            quantity: Number(s.quantity),
          })),
        },
        specifications: { create: parsedSpecifications.map((spec) => ({ key: spec.key, value: spec.value })) },
      },
      include: { category: true, productimage: true, productstock: true, specifications: true },
    });

    res.status(201).json({ success: true, message: "Product created successfully", data: product });
  } catch (error) {
    console.error("CREATE_PRODUCT_ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─── GET ALL PRODUCTS (admin — no isActive filter) ────────────────────────────
export const getProductsAll = async (req, res) => {
  try {
    // Auto-deactivate zero-stock products before returning
    await autoDeactivateZeroStock();

    const products = await prisma.product.findMany({
      include: {
        category: true,
        productimage: true,
        productstock: { orderBy: { id: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    const mappedProducts = products.map((p) => ({
      ...p,
      images: p.productimage,
      stocks: p.productstock,
      stock_quantity: p.productstock.reduce((sum, s) => sum + s.quantity, 0),
    }));

    res.json({ success: true, data: mappedProducts });
  } catch (error) {
    console.error("GET_PRODUCTS_ALL_ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─── GET PRODUCTS (public — active only, with filters & pagination) ────────────
export const getProducts = async (req, res) => {
  try {
    const { category, gender, size, minPrice, maxPrice, sortBy } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const where = { isActive: true };

    if (category && category !== "All") where.category = { name: category };
    if (gender && gender !== "All") where.gender = { in: [gender.toUpperCase(), "ALL"] };
    if (size) where.productstock = { some: { size: String(size) } };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    let orderBy = { createdAt: "desc" };
    if (sortBy === "low-high") orderBy = { price: "asc" };
    else if (sortBy === "high-low") orderBy = { price: "desc" };

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          productimage: true,
          productstock: { orderBy: { id: "asc" } },
          specifications: true,
          reviews: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const mappedProducts = products.map((p) => {
  const totalReviews = p.reviews.length;

  const averageRating =
    totalReviews > 0
      ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  return {
    ...p,
    images: p.productimage,
    stocks: p.productstock,
    stock_quantity: p.productstock.reduce(
      (sum, s) => sum + s.quantity,
      0
    ),
    averageRating,
    totalReviews,
  };
});

    res.json({
      success: true,
      data: mappedProducts,
      pagination: { totalCount, totalPages: Math.ceil(totalCount / limit), currentPage: page, limit },
    });
  } catch (error) {
    console.error("GET_PRODUCTS_ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─── GET PRODUCT BY ID ────────────────────────────────────────────────────────
export const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        category: true,
        productimage: true,
        productstock: { orderBy: { id: "asc" } },
      },
    });

    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.json({
      success: true,
      data: {
        ...product,
        images: product.productimage,
        stocks: product.productstock,
        stock_quantity: product.productstock.reduce((sum, s) => sum + s.quantity, 0),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET PRODUCT BY SLUG
export const getProductBySlug = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        category: true,
        productimage: true,
        productstock: { orderBy: { id: "asc" } },
        specifications: true,
      },
    });

    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.json({
      success: true,
      data: {
        ...product,
        images: product.productimage,
        stocks: product.productstock,
        stock_quantity: product.productstock.reduce((sum, s) => sum + s.quantity, 0),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// UPDATE PRODUCT 
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      stocks,
      specifications,
      name,
      slug,
      descriptionOne,
      descriptionTwo,
      descriptionThree,
      price,
      discountPrice,
      categoryId,
      gender,
    } = req.body;

    const files = req.files || [];

    // Check image limit
    const currentImageCount = await prisma.productimage.count({ where: { productId: Number(id) } });
    if (currentImageCount + files.length > 10) {
      return res.status(400).json({
        success: false,
        error: `Maximum 10 images allowed. Product already has ${currentImageCount} images.`,
      });
    }

    // Parse stocks
    let parsedStocks = [];
    if (stocks) {
      try {
        parsedStocks = typeof stocks === "string" ? JSON.parse(stocks) : stocks;
      } catch {
        return res.status(400).json({ success: false, message: "Invalid stocks format" });
      }
    }

    // Parse specifications
    let parsedSpecifications = [];
    if (specifications) {
      try {
        parsedSpecifications = typeof specifications === "string" ? JSON.parse(specifications) : specifications;
      } catch {
        return res.status(400).json({ success: false, message: "Invalid specifications format" });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (slug) updateData.slug = slug;
    if (descriptionOne !== undefined) updateData.descriptionOne = descriptionOne;
    if (descriptionTwo !== undefined) updateData.descriptionTwo = descriptionTwo;
    if (descriptionThree !== undefined) updateData.descriptionThree = descriptionThree;
    if (gender) updateData.gender = gender;
    if (price) updateData.price = parseFloat(price);
    if (categoryId) updateData.categoryId = Number(categoryId);
    if (discountPrice !== undefined) updateData.discountPrice = discountPrice ? parseFloat(discountPrice) : null;

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.update({ where: { id: Number(id) }, data: updateData });

      // Manage stocks
      const currentStocks = await tx.productstock.findMany({ where: { productId: product.id }, select: { id: true } });
      const currentIds = currentStocks.map((s) => s.id);
      const receivedIds = parsedStocks.map((s) => s.id).filter((sid) => sid != null && sid !== "");

      const idsToDelete = currentIds.filter((sid) => !receivedIds.includes(sid));
      if (idsToDelete.length > 0) {
        await tx.productstock.deleteMany({ where: { id: { in: idsToDelete } } });
      }

      for (const s of parsedStocks) {
        if (s.id && currentIds.includes(Number(s.id))) {
          await tx.productstock.update({
            where: { id: Number(s.id) },
            data: {
              size: String(s.size),
              costPrice: Number(s.costPrice || 0),
              sellingPrice: Number(s.sellingPrice && s.sellingPrice != 0 ? s.sellingPrice : s.costPrice || product.price || 0),
              quantity: Number(s.quantity || 0),
            },
          });
        } else {
          await tx.productstock.create({
            data: {
              productId: product.id,
              size: String(s.size),
              costPrice: Number(s.costPrice || 0),
              sellingPrice: Number(s.sellingPrice && s.sellingPrice != 0 ? s.sellingPrice : s.costPrice || product.price || 0),
              quantity: Number(s.quantity || 0),
            },
          });
        }
      }

      // Auto-set isActive based on remaining stock
      const allStocks = await tx.productstock.findMany({ where: { productId: product.id } });
      const newTotal = allStocks.reduce((sum, s) => sum + s.quantity, 0);
      await tx.product.update({ where: { id: product.id }, data: { isActive: newTotal > 0 } });

      // Specifications
      await tx.productspecification.deleteMany({ where: { productId: product.id } });
      const validSpecs = parsedSpecifications.filter((s) => s.key && s.value);
      if (validSpecs.length > 0) {
        await tx.productspecification.createMany({
          data: validSpecs.map((s) => ({ productId: product.id, key: s.key, value: s.value })),
        });
      }

      // Images
      if (files.length > 0) {
        await tx.productimage.createMany({
          data: files.map((file) => ({ productId: product.id, url: `/uploads/${file.filename}` })),
        });
      }

      const updatedProduct = await tx.product.findUnique({
        where: { id: product.id },
        include: { productstock: true, productimage: true, specifications: true },
      });

      return {
        ...updatedProduct,
        stocks: updatedProduct.productstock,
        images: updatedProduct.productimage,
      };
    });

    res.json({ success: true, message: "Product updated successfully", data: result });
  } catch (error) {
    console.error("UPDATE_PRODUCT_ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

//  TOGGLE ACTIVE STATUS
export const toggleProductActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (isActive === undefined || isActive === null) {
      return res.status(400).json({ success: false, message: "isActive field is required" });
    }

    const activate = isActive === 1 || isActive === true;

    // If trying to activate, check stock first
    if (activate) {
      const stocks = await prisma.productstock.findMany({ where: { productId: Number(id) } });
      const totalQty = stocks.reduce((sum, s) => sum + s.quantity, 0);
      if (totalQty === 0) {
        return res.status(400).json({
          success: false,
          message: "Cannot activate product with zero stock. Add stock first.",
        });
      }
    }

    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data: { isActive: activate },
    });

    res.json({
      success: true,
      message: `Product ${activate ? "activated" : "deactivated"} successfully`,
      data: updated,
    });
  } catch (error) {
    console.error("TOGGLE_ACTIVE_ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

//  DELETE PRODUCT (hard soft-delete — kept for route compatibility) 
export const deleteProduct = async (req, res) => {
  try {
    const updated = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: { isActive: false },
    });
    res.json({ success: true, message: "Product deactivated successfully", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//  SEARCH PRODUCTS (autocomplete)
export const searchProducts = async (req, res) => {
  try {
    const { name } = req.query;
    const products = await prisma.product.findMany({
      where: { name: { contains: name, mode: "insensitive" } },
      take: 10,
    });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// for high rated product
export const getTopRatedProducts = async (req, res) => {
  try {
    // Get products with reviews
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        reviews: true,
        productimage: true,
      },
    });

    // Calculate average rating
    const formattedProducts = products.map((product) => {
      const totalReviews = product.reviews.length;

      const averageRating =
        totalReviews > 0
          ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
            totalReviews
          : 0;

      return {
        ...product,
        image: product.productimage.length > 0 ? product.productimage[0].url : null,
        averageRating,
        totalReviews,
      };
    });

    // Sort highest rating first
    const sortedProducts = formattedProducts.sort(
      (a, b) => b.averageRating - a.averageRating
    );

    // Take top 3
    const topProducts = sortedProducts.slice(0, 3);

    res.json(topProducts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to fetch top rated products",
    });
  }
};