import { z } from "zod";

export const orderSchema = z.object({
  userId: z.coerce.number().optional(),

  customerName: z
    .string()
    .min(2, "Name too short")
    .max(100), // Relaxed: removed strict letter-only regex

  email: z.string().email("Invalid email"),

  contactNumber: z
    .string()
    .min(10, "Phone number too short")
    .max(20, "Phone number too long"), // Relaxed regex

  shippingAddress: z
    .string()
    .min(5, "Address too short")
    .max(500), // Increased max length

  paymentMethod: z.enum(["COD", "ONLINE"]),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED"]).optional(),

  status: z.enum([
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED"
  ]).optional(),

  carrier: z.string().min(2).optional(), 
  trackingNumber: z.string().optional(),

  estimatedDelivery: z
    .string()
    .optional(), // Removed .datetime() as it might be a simple date string

  actualDelivery: z
    .string()
    .optional(),

  // ✅ ITEMS
  items: z.array(
    z.object({
      productId: z.coerce.number(),
      size: z.string().min(1),
      quantity: z.coerce.number().min(1),
      price: z.coerce.number().min(0)
    })
  ).min(1, "At least one item required"),

  // Add these as optional so they don't cause validation errors if sent
  shippingCharge: z.coerce.number().optional(),
  promoDiscount: z.coerce.number().optional(),
  promoCode: z.string().optional(),
  totalAmount: z.coerce.number().optional()
});