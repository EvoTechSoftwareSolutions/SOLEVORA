import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* ─────────────────────────────
   SRI LANKA DISTRICTS (25)
───────────────────────────── */
const DISTRICTS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
];

/* ─────────────────────────────
   GET ALL SHIPPING ZONES
───────────────────────────── */
export const getAllShippingZones = async (req, res) => {
  try {
    const zones = await prisma.shippingZone.findMany({
      orderBy: [{ district: "asc" }, { method: "asc" }],
    });

    res.json({
      success: true,
      data: zones,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────────────────────────────
   GET SHIPPING PRICE
   /shipping/price?district=Colombo&method=express
───────────────────────────── */
export const getShippingPrice = async (req, res) => {
  try {
    const { district, method } = req.query;

    if (!district || !method) {
      return res.status(400).json({
        success: false,
        message: "District and method required",
      });
    }

    const zone = await prisma.shippingZone.findUnique({
      where: {
        district_method: {
          district,
          method,
        },
      },
    });

    if (!zone) {
      return res.status(404).json({
        success: false,
        message: "Shipping zone not found",
      });
    }

    res.json({
      success: true,
      data: {
        district,
        method,
        price: Number(zone.price),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────────────────────────────
   CREATE SHIPPING ZONE (ADMIN)
───────────────────────────── */
export const createShippingZone = async (req, res) => {
  try {
    const { district, method, price } = req.body;

    const zone = await prisma.shippingZone.create({
      data: {
        district,
        method,
        price: Number(price),
      },
    });

    res.status(201).json({
      success: true,
      message: "Shipping zone created",
      data: zone,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────────────────────────────
   UPDATE SHIPPING ZONE
───────────────────────────── */
export const updateShippingZone = async (req, res) => {
  try {
    const { district, method, price } = req.body;

    const updated = await prisma.shippingZone.update({
      where: {
        district_method: {
          district,
          method,
        },
      },
      data: {
        price: Number(price),
      },
    });

    res.json({
      success: true,
      message: "Updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─────────────────────────────
   DELETE SHIPPING ZONE
───────────────────────────── */
export const deleteShippingZone = async (req, res) => {
  try {
    const { district, method } = req.body;

    await prisma.shippingZone.delete({
      where: {
        district_method: {
          district,
          method,
        },
      },
    });

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getShippingByDistrict = async (req, res) => {
  try {
    const { district } = req.params;

    const shipping = await prisma.shippingZone.findMany({
      where: {
        district: district,
      },
    });

    return res.json({
      success: true,
      data: shipping,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch shipping methods",
    });
  }
};