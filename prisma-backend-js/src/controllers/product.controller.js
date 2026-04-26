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

//
//  UPDATE PRODUCT
//
export const updateProduct = async (req, res) => {
  try {
    const updated = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });

    res.json({
      success: true,
      data: updated
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

//
//  DELETE PRODUCT
//
export const deleteProduct = async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: Number(req.params.id) }
    });

    res.json({
      success: true,
      message: "Deleted"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};