import express from "express";
import {
  getAllShippingZones,
  getShippingPrice,
  createShippingZone,
  updateShippingZone,
  deleteShippingZone,
  getShippingByDistrict,
} from "../controllers/shippingPrice.controller.js";

const router = express.Router();

router.get("/", getAllShippingZones);
router.get("/price", getShippingPrice);
router.get("/:district", getShippingByDistrict);
router.post("/", createShippingZone);

router.put("/", updateShippingZone);

router.delete("/", deleteShippingZone);

export default router;