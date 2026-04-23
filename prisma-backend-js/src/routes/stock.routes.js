import express from "express";
import {
  addStock,
  getStockByProduct,
  deleteStock
} from "../controllers/stockController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

//  ADD STOCK (ADMIN + STORE MANAGER ONLY)
router.post(
  "/",
  authMiddleware,
  requireRole("admin", "store_manager"),
  addStock
);

// GET STOCK BY PRODUCT (PUBLIC or ADMIN)
router.get(
  "/product/:productId",
  getStockByProduct
);

//  DELETE STOCK (ADMIN ONLY)
router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  deleteStock
);

export default router;