import prisma from "../prisma/client.js";

//  GET ALL CATEGORIES
export const getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [categories, totalCount] = await Promise.all([
      prisma.category.findMany({
        include: {
          product: true
        },
        skip,
        take: limit,
        orderBy: { name: 'asc' }
      }),
      prisma.category.count()
    ]);

    res.status(200).json({
      success: true,
      data: categories,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        limit
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


//
//  CREATE CATEGORY
//
export const createCategory = async (req, res) => {
  try {
    const { name, slug, description, isActive, sortOrder } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name and slug are required"
      });
    }


    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists"
      });
    }

    const image = req.file;

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        isActive: isActive === "true",
        sortOrder: sortOrder ? Number(sortOrder) : 0,
        image: image ? image.path : null
      }
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


//
// UPDATE CATEGORY
//
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, slug, sortOrder, isActive } = req.body;

    const existing = await prisma.category.findUnique({
      where: { id: Number(id) }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    const category = await prisma.category.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        slug,
        sortOrder: sortOrder ? Number(sortOrder) : undefined,
        isActive
      }
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


//
//  DELETE CATEGORY
//
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.category.findUnique({
      where: { id: Number(id) }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    await prisma.category.delete({
      where: { id: Number(id) }
    });

    res.status(200).json({
      success: true,
      message: "Category deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};