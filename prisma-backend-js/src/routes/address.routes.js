import express from "express";
import {
  getAddressesByUserId,
  getAddressDetails,
  createAddress,
  updateAddress,
  deleteAddress
} from "../controllers/address.controller.js";

const router = express.Router();

router.get("/:userId", getAddressesByUserId);
router.get("/details/:id", getAddressDetails);
router.post("/", createAddress);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);

export default router;
