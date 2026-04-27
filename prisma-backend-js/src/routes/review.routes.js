import express from "express";
import {
  getReviewsByProductId,
  createReview
} from "../controllers/review.controller.js";

const router = express.Router();

router.get("/:productId", getReviewsByProductId);
router.post("/", createReview);

export default router;
