import prisma from "../prisma/client.js";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      categoryId,
      gender,
      sizes,
      sizeRange
    } = req.body;

    const files = req.files || [];

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        categoryId: categoryId ? BigInt(categoryId) : null,
        gender,
        sizes,
        sizeRange,
        imageUrl: files[0] ? `/uploads/${files[0].filename}` : null,
        imageUrl2: files[1] ? `/uploads/${files[1].filename}` : null,
        imageUrl3: files[2] ? `/uploads/${files[2].filename}` : null,
        imageUrl4: files[3] ? `/uploads/${files[3].filename}` : null,
      }
    });

    res.status(201).json(product);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        stocks: true
      }
    });

    // Format for frontend (matches the original backend format)
    const formattedProducts = products.map(p => {
      const images = [p.imageUrl, p.imageUrl2, p.imageUrl3, p.imageUrl4]
        .filter(url => url != null)
        .map(url => ({ url }));
      
      return {
        ...p,
        id: p.id.toString(),
        categoryId: p.categoryId?.toString(),
        images: images.length > 0 ? images : []
      };
    });

    // Return the array directly inside a 'data' property to match CategoryPage.jsx: data.data.map
    res.json({
      success: true,
      data: formattedProducts
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET PRODUCT BY ID
export const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: BigInt(req.params.id) },
      include: {
        category: true,
        stocks: true
      }
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const images = [product.imageUrl, product.imageUrl2, product.imageUrl3, product.imageUrl4]
      .filter(url => url != null)
      .map(url => ({ url }));

    const formattedProduct = {
      ...product,
      id: product.id.toString(),
      categoryId: product.categoryId?.toString(),
      images: images.length > 0 ? images : []
    };

    res.json({ success: true, data: formattedProduct });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const updated = await prisma.product.update({
      where: { id: BigInt(req.params.id) },
      data: req.body
    });

    res.json(updated);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: BigInt(req.params.id) }
    });

    res.json({ success: true, message: "Deleted" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};