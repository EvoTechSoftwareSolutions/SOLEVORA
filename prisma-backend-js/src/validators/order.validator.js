import { z } from "zod";

export const orderSchema = z.object({
  userId: z.number().optional(),

  customerName: z
    .string()
    .min(2, "Name too short")
    .max(100)
    .regex(/^[a-zA-Z\s]+$/, "Only letters allowed"),

  email: z.string().email("Invalid email"),

  contactNumber: z
    .string()
    .regex(/^[0-9]{10,15}$/, "Invalid phone number"),

  shippingAddress: z
    .string()
    .min(5, "Address too short")
    .max(255),

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
    .datetime()
    .optional(),

  actualDelivery: z
    .string()
    .datetime()
    .optional(),

  // ✅ ITEMS
  items: z.array(
    z.object({
      productId: z.number(),
      size: z.string().min(1),
      quantity: z.number().min(1),
      price: z.number().min(0)
    })
  ).min(1, "At least one item required")
});