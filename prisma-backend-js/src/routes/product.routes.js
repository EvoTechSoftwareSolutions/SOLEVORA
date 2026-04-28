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
import upload from "../utils/multer.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// PUBLIC
router.get("/", getProducts);
router.get("/all", getProductsAll);
router.get("/id/:id", getProductById);
router.get("/slug/:slug", getProductBySlug);


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
