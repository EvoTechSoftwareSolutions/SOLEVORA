import prisma from "../prisma/client.js";
import { sendStockSMS } from "../utils/stockSms.js";
import { sendStockEmail } from "../utils/stockEmail.js";

//auto-deactivate any product whose total stock = 0 
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

//  get the FIFO selling price for a product 
const getFifoPrice = (stocks, size = null, fallbackPrice = 0) => {
  const candidates = stocks.filter(
    (s) => s.quantity > 0 && (size == null || String(s.size) === String(size))
  );

  if (candidates.length === 0) {
    const anyBatch = stocks.find((s) => s.quantity > 0);
    return anyBatch ? Number(anyBatch.sellingPrice) : Number(fallbackPrice);
  }

  return Number(candidates[0].sellingPrice);
};

//  resolve the effective selling price for a stock entry 
const resolveSellingPrice = (s, fallbackPrice = 0) =>
  Number(
    s.sellingPrice && Number(s.sellingPrice) !== 0
      ? s.sellingPrice
      : s.costPrice || fallbackPrice || 0
  );

//  CREATE PRODUCT 
// If the slug already exists the product is treated as a restocking event.
// FIFO batch rules applied when matching the existing product's stock records.
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

    //  Basic validation 
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

    let parsedStocks = [];
    try {
      parsedStocks = typeof stocks === "string" ? JSON.parse(stocks || "[]") : stocks || [];
    } catch { parsedStocks = []; }

    let parsedSpecifications = [];
    try {
      parsedSpecifications =
        typeof specifications === "string" ? JSON.parse(specifications || "[]") : specifications || [];
    } catch { parsedSpecifications = []; }

    //  Check for an existing product with the same slug 
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
      include: { productstock: { orderBy: { createdAt: "asc" } } },
    });

    if (existingProduct) {
      //apply FIFO batch rules 
      for (const s of parsedStocks) {
        const incomingSellingPrice = resolveSellingPrice(s, existingProduct.price);
        const incomingSize = String(s.size);

        /*
         * FIFO batch logic:
         *   - Same size AND same selling price  → increment quantity on that batch
         *   - Same size AND different price     → create a NEW batch (queued behind existing ones)
         */
        const matchingBatch = await prisma.productstock.findFirst({
          where: {
            productId: existingProduct.id,
            size: incomingSize,
            sellingPrice: incomingSellingPrice,
          },
        });

        if (matchingBatch) {
          // Same size + same price: increment
          await prisma.productstock.update({
            where: { id: matchingBatch.id },
            data: { quantity: { increment: Number(s.quantity) } },
          });
        } else {
          // Same size + different price (or completely new size): new batch
          await prisma.productstock.create({
            data: {
              productId: existingProduct.id,
              size: incomingSize,
              costPrice: Number(s.costPrice || 0),
              sellingPrice: incomingSellingPrice,
              quantity: Number(s.quantity),
            },
          });
        }
      }

      // Recalculate isActive
      const allStocks = await prisma.productstock.findMany({
        where: { productId: existingProduct.id },
      });
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

      // Refresh specifications
      await prisma.productspecification.deleteMany({ where: { productId: existingProduct.id } });
      if (parsedSpecifications.length > 0) {
        await prisma.productspecification.createMany({
          data: parsedSpecifications.map((spec) => ({
            productId: existingProduct.id,
            key: spec.key,
            value: spec.value,
          })),
        });
      }

      // Append any new images (images are optional on restock)
      if (files.length > 0) {
        await prisma.productimage.createMany({
          data: files.map((file) => ({
            url: `/uploads/${file.filename}`,
            productId: existingProduct.id,
          })),
        });
      }

      const updatedProduct = await prisma.product.findUnique({
        where: { id: existingProduct.id },
        include: {
          category: true,
          productimage: true,
          productstock: { orderBy: { createdAt: "asc" } },
          specifications: true,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Existing product restocked successfully",
        data: {
          ...updatedProduct,
          images: updatedProduct.productimage,
          stocks: updatedProduct.productstock,
        },
      });
    }

    //  brand-new product 
    const totalQty = parsedStocks.reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);

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
        isActive: totalQty > 0,
        updatedAt: new Date(),
        productimage: {
          create: files.map((file) => ({ url: `/uploads/${file.filename}` })),
        },
        productstock: {
          create: parsedStocks.map((s) => ({
            size: s.size,
            costPrice: Number(s.costPrice || 0),
            sellingPrice: resolveSellingPrice(s, price),
            quantity: Number(s.quantity),
          })),
        },
        specifications: {
          create: parsedSpecifications.map((spec) => ({ key: spec.key, value: spec.value })),
        },
      },
      include: {
        category: true,
        productimage: true,
        productstock: { orderBy: { createdAt: "asc" } },
        specifications: true,
      },
    });

    res.status(201).json({ success: true, message: "Product created successfully", data: product });
  } catch (error) {
    console.error("CREATE_PRODUCT_ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

//  GET ALL PRODUCTS (admin — no isActive filter) 
export const getProductsAll = async (req, res) => {
  try {
    await autoDeactivateZeroStock();

    const products = await prisma.product.findMany({
      include: {
        category: true,
        productimage: true,
        productstock: { orderBy: { createdAt: "asc" } },
        specifications: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const mappedProducts = products.map((p) => ({
      ...p,
      images: p.productimage,
      stocks: p.productstock,
      specifications: p.specifications,
      stock_quantity: p.productstock.reduce((sum, s) => sum + s.quantity, 0),
      currentFifoPrice: getFifoPrice(p.productstock, null, p.price),
    }));

    res.json({ success: true, data: mappedProducts });
  } catch (error) {
    console.error("GET_PRODUCTS_ALL_ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

//  GET PRODUCTS (public — active only, with filters & pagination) 
export const getProducts = async (req, res) => {
  try {
    const { category, gender, size, minPrice, maxPrice, sortBy } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const where = { isActive: true };

    if (category && category !== "All") where.category = { name: category };
    if (gender && gender !== "All") where.gender = { in: [gender.toUpperCase(), "ALL"] };
    if (size) where.productstock = { some: { size: String(size), quantity: { gt: 0 } } };
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
          productstock: { orderBy: { createdAt: "asc" } },
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

      const currentFifoPrice = getFifoPrice(p.productstock, size || null, p.price);

      return {
        ...p,
        images: p.productimage,
        stocks: p.productstock,
        specifications: p.specifications,
        stock_quantity: p.productstock.reduce((sum, s) => sum + s.quantity, 0),
        currentFifoPrice,
        averageRating,
        totalReviews,
      };
    });

    res.json({
      success: true,
      data: mappedProducts,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("GET_PRODUCTS_ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

//  GET PRODUCT BY ID 
export const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        category: true,
        productimage: true,
        productstock: { orderBy: { createdAt: "asc" } },
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
        specifications: product.specifications,
        stock_quantity: product.productstock.reduce((sum, s) => sum + s.quantity, 0),
        currentFifoPrice: getFifoPrice(product.productstock, null, product.price),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//  GET PRODUCT BY SLUG 
export const getProductBySlug = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        category: true,
        productimage: true,
        productstock: { orderBy: { createdAt: "asc" } },
        specifications: true,
      },
    });

    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // Build a per-size FIFO price map (only the oldest in-stock batch per size)
    const sizeFifoPriceMap = {};
    const seenSizes = new Set();
    for (const s of product.productstock) {
      if (s.quantity > 0 && !seenSizes.has(String(s.size))) {
        sizeFifoPriceMap[String(s.size)] = Number(s.sellingPrice);
        seenSizes.add(String(s.size));
      }
    }

    res.json({
      success: true,
      data: {
        ...product,
        images: product.productimage,
        stocks: product.productstock,
        specifications: product.specifications,
        stock_quantity: product.productstock.reduce((sum, s) => sum + s.quantity, 0),
        currentFifoPrice: getFifoPrice(product.productstock, null, product.price),
        sizeFifoPriceMap,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//  UPDATE PRODUCT 
// Called from the Edit modal.
// FIFO batch rule for stocks submitted from the Edit form:
//   • Stock row that already has an id  → direct update (admin consciously editing it)
//   • Stock row with no id              → treated as a NEW batch using FIFO rules:
//       - Same size + same selling price → increment the matching existing batch
//       - Same size + different price   → create a new batch
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
    const currentImageCount = await prisma.productimage.count({
      where: { productId: Number(id) },
    });
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
        parsedSpecifications =
          typeof specifications === "string" ? JSON.parse(specifications) : specifications;
      } catch {
        return res.status(400).json({ success: false, message: "Invalid specifications format" });
      }
    }

    // Build product-level update payload
    const updateData = {};
    if (name)                         updateData.name = name;
    if (slug)                         updateData.slug = slug;
    if (descriptionOne !== undefined) updateData.descriptionOne = descriptionOne;
    if (descriptionTwo !== undefined) updateData.descriptionTwo = descriptionTwo;
    if (descriptionThree !== undefined) updateData.descriptionThree = descriptionThree;
    if (gender)                       updateData.gender = gender;
    if (price)                        updateData.price = parseFloat(price);
    if (categoryId)                   updateData.categoryId = Number(categoryId);
    if (discountPrice !== undefined)  updateData.discountPrice = discountPrice ? parseFloat(discountPrice) : null;

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.update({
        where: { id: Number(id) },
        data: updateData,
      });

      //  Resolve existing stock ids 
      const currentStocks = await tx.productstock.findMany({
        where: { productId: product.id },
        select: { id: true },
      });
      const currentIds = currentStocks.map((s) => s.id);

      // Separate rows that already have a DB id from truly-new rows
      const rowsWithId    = parsedStocks.filter((s) => s.id && currentIds.includes(Number(s.id)));
      const rowsWithoutId = parsedStocks.filter((s) => !s.id || !currentIds.includes(Number(s.id)));

      // Delete any existing batch the admin explicitly removed from the form
      const receivedIds = rowsWithId.map((s) => Number(s.id));
      const idsToDelete  = currentIds.filter((sid) => !receivedIds.includes(sid));
      if (idsToDelete.length > 0) {
        await tx.productstock.deleteMany({ where: { id: { in: idsToDelete } } });
      }

      // ── Direct-update rows that already have a DB id 
      for (const s of rowsWithId) {
        const updatedStock = await tx.productstock.update({
          where: { id: Number(s.id) },
          data: {
            size:         String(s.size),
            costPrice:    Number(s.costPrice || 0),
            sellingPrice: resolveSellingPrice(s, product.price),
            quantity:     Number(s.quantity || 0),
          },
        });

        await sendStockSMS({
          productId: product.id,
          name:      product.name,
          size:      updatedStock.size,
          qty:       updatedStock.quantity,
        });
      }

      // ── FIFO batch rules for new rows (no id) 
      // Fetch fresh after possible deletions
      const freshStocks = await tx.productstock.findMany({
        where: { productId: product.id },
        orderBy: { createdAt: "asc" },
      });

      for (const s of rowsWithoutId) {
        const incomingSize         = String(s.size);
        const incomingSellingPrice = resolveSellingPrice(s, product.price);

        const matchingBatch = freshStocks.find(
          (b) =>
            String(b.size) === incomingSize &&
            Number(b.sellingPrice) === incomingSellingPrice
        );

        if (matchingBatch) {
          // Same size + same price → increment
          await tx.productstock.update({
            where: { id: matchingBatch.id },
            data: { quantity: { increment: Number(s.quantity) } },
          });
        } else {
          // Same size + different price (or new size) → new FIFO batch
          await tx.productstock.create({
            data: {
              productId:    product.id,
              size:         incomingSize,
              costPrice:    Number(s.costPrice || 0),
              sellingPrice: incomingSellingPrice,
              quantity:     Number(s.quantity),
            },
          });
        }
      }

      // Auto-set isActive based on total remaining stock
      const allStocks = await tx.productstock.findMany({
        where: { productId: product.id },
      });
      const newTotal = allStocks.reduce((sum, s) => sum + s.quantity, 0);
      await tx.product.update({
        where: { id: product.id },
        data: { isActive: newTotal > 0 },
      });

      // Refresh specifications
      await tx.productspecification.deleteMany({ where: { productId: product.id } });
      const validSpecs = parsedSpecifications.filter((s) => s.key && s.value);
      if (validSpecs.length > 0) {
        await tx.productspecification.createMany({
          data: validSpecs.map((s) => ({
            productId: product.id,
            key:       s.key,
            value:     s.value,
          })),
        });
      }

      // Append new images
      if (files.length > 0) {
        await tx.productimage.createMany({
          data: files.map((file) => ({
            productId: product.id,
            url: `/uploads/${file.filename}`,
          })),
        });
      }

      const updatedProduct = await tx.product.findUnique({
        where: { id: product.id },
        include: {
          productstock:  { orderBy: { createdAt: "asc" } },
          productimage:  true,
          specifications: true,
        },
      });

      return {
        ...updatedProduct,
        stocks:           updatedProduct.productstock,
        images:           updatedProduct.productimage,
        specifications:   updatedProduct.specifications,
        currentFifoPrice: getFifoPrice(updatedProduct.productstock, null, updatedProduct.price),
      };
    });

    res.json({ success: true, message: "Product updated successfully", data: result });
  } catch (error) {
    console.error("UPDATE_PRODUCT_ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ─── TOGGLE ACTIVE STATUS ─────────────────────────────────────────────────────
export const toggleProductActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (isActive === undefined || isActive === null) {
      return res.status(400).json({ success: false, message: "isActive field is required" });
    }

    const activate = isActive === 1 || isActive === true;

    if (activate) {
      const stocks = await prisma.productstock.findMany({
        where: { productId: Number(id) },
      });
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

// ─── DELETE PRODUCT (soft-delete) ─────────────────────────────────────────────
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

// ─── SEARCH PRODUCTS (autocomplete) ──────────────────────────────────────────
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

// ─── GET TOP RATED PRODUCTS ───────────────────────────────────────────────────
export const getTopRatedProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        reviews:      true,
        productimage: true,
        productstock: { orderBy: { createdAt: "asc" } },
      },
    });

    const formattedProducts = products.map((product) => {
      const totalReviews = product.reviews.length;
      const averageRating =
        totalReviews > 0
          ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
          : 0;

      return {
        ...product,
        image: product.productimage.length > 0 ? product.productimage[0].url : null,
        averageRating,
        totalReviews,
        currentFifoPrice: getFifoPrice(product.productstock, null, product.price),
      };
    });

    const topProducts = formattedProducts
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 3);

    res.json(topProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch top rated products" });
  }
};