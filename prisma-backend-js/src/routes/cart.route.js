import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from "../controllers/cart.controller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addToCart);
router.get("/:userId", authMiddleware, getCart);
router.put("/:cartId", authMiddleware, updateCartItem);
router.delete("/:cartId", authMiddleware, removeFromCart);
router.delete("/clear/:userId", authMiddleware, clearCart);

export default router;