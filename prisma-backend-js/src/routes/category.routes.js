import express from "express";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import upload from "../utils/multer.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();
//for public acces
router.get("/", getAllCategories);


router.post(
  "/",
  authMiddleware,
  requireRole(["admin", "store_manager"]),
   upload.single("image"), createCategory
);

router.put(
  "/:id",
  authMiddleware,
  requireRole(["admin", "store_manager"]),
  updateCategory
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole(["admin", "store_manager"]),
  deleteCategory
);

export default router;