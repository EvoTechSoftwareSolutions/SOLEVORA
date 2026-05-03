import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getAllOrdersByUserID,
  searchOrders
} from "../controllers/order.controller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/search", searchOrders);

router.get(
  "/",
  authMiddleware,
  requireRole("admin", "store_manager"),
  getAllOrders,
);

router.get("/:id", authMiddleware, getOrderById);
router.get("/user/:id", authMiddleware, getAllOrdersByUserID);

router.put(
  "/:id/status",
  authMiddleware,
  requireRole("admin", "store_manager"),
  updateOrderStatus,
);

router.put(
  "/:id",
  authMiddleware,
  requireRole("admin", "store_manager"),
  updateOrderStatus,
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin", "store_manager"),
  deleteOrder,
);

export default router;
