import express from "express";
import {
  getAddressesByUserId,
  getAddressDetails,
  createAddress,
  updateAddress,
  deleteAddress
} from "../controllers/address.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:userId", authMiddleware, getAddressesByUserId);
router.get("/details/:id", authMiddleware, getAddressDetails);
router.post("/", authMiddleware, createAddress);
router.put("/:id", authMiddleware, updateAddress);
router.delete("/:id", authMiddleware, deleteAddress);

export default router;
