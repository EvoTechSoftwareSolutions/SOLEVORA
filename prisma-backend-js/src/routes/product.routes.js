import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsAll,
  getProductBySlug,
} from "../controllers/product.controller.js";
import { getPublicPromos } from "../controllers/admin.controller.js";
import { getAllStockBatches } from "../controllers/stockController.js";
import upload from "../utils/multer.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// PUBLIC
router.get("/", getProducts);
router.get("/all", getProductsAll);
router.get("/batches", getAllStockBatches);
router.get("/id/:id", getProductById);
router.get("/slug/:slug", getProductBySlug);
router.get("/promotions", getPublicPromos);


// ADMIN + STORE MANAGER ONLY
router.post(
  "/",
  authMiddleware,
  requireRole("admin", "store_manager"),
  upload.array("images", 10),
  createProduct,
);

router.put(
  "/:id",
  authMiddleware,
  requireRole("admin", "store_manager"),
  upload.array("images", 10),
  updateProduct,
);

// ADMIN ONLY (recommended)
router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin", "store_manager"),
  deleteProduct,
);

export default router;
