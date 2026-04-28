import prisma from "../prisma/client.js";

export const getReviewsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await prisma.reviews.findMany({
      where: { productId: Number(productId) },
      include: {
        users: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    
    // Map to match frontend expectation (user.name)
    const formattedReviews = reviews.map(r => ({
      ...r,
      user: r.users
    }));
    
    res.json(formattedReviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

export const createReview = async (req, res) => {
  try {
    const { rating, comment, userId, productId } = req.body;
    
    const review = await prisma.reviews.create({
      data: {
        rating: Number(rating),
        comment,
        userId: Number(userId),
        productId: Number(productId),
        updatedAt: new Date()
      },
      include: {
        users: {
          select: { name: true }
        }
      }
    });
    
    res.status(201).json({
      review: {
        ...review,
        user: review.users
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit review" });
  }
};
