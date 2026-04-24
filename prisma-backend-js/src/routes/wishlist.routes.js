import express from "express";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist
} from "../controllers/wishlish.controler.js";

const router = express.Router();

router.post("/", addToWishlist);
router.delete("/:uid/:productId", removeFromWishlist);
router.get("/:userId", getWishlist);

export default router;