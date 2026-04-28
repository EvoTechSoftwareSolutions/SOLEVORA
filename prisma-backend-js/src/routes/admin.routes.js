import express from "express";
import { 
  getAdminStats, 
  getAllCustomers, 
  deleteCustomer,
  getAllPromos,
  createPromo,
  updatePromo,
  deletePromo,
  getInventoryReport,
  getSettings,
  updateSettings,
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser
} from "../controllers/admin.controller.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Apply auth to all admin routes
router.use(authMiddleware);

router.get("/stats", getAdminStats);
router.get("/customers", getAllCustomers);
router.delete("/customers/:id", deleteCustomer);



// Promo Codes
router.get("/promo", getAllPromos);
router.post("/promo", createPromo);
router.put("/promo/:id", updatePromo);
router.delete("/promo/:id", deletePromo);

// Inventory
router.get("/inventory", getInventoryReport);

// System Settings - 🔒 Admin only
router.get("/settings", requireRole(['admin']), getSettings);
router.put("/settings", requireRole(['admin']), updateSettings);

// Staff Management - 🔒 Admin only
router.get("/admin-users", requireRole(['admin']), getAdminUsers);
router.post("/admin-users", requireRole(['admin']), createAdminUser);
router.put("/admin-users/:id", requireRole(['admin']), updateAdminUser);
router.delete("/admin-users/:id", requireRole(['admin']), deleteAdminUser);

export default router;
