import { z } from "zod";

export const orderSchema = z.object({
  userId: z.coerce.number().optional(),

  customerName: z.string().optional().default("Guest User"),
  email: z.string().email("Invalid email").or(z.string().length(0)).optional(),
  contactNumber: z.string().optional().default("0000000000"),
  shippingAddress: z.string().optional().default("N/A"),

  paymentMethod: z.enum(["COD", "ONLINE"]),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED"]).optional(),

  status: z.enum([
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED"
  ]).optional(),

  carrier: z.string().optional(), 
  trackingNumber: z.string().optional(),
  estimatedDelivery: z.string().optional(),
  actualDelivery: z.string().optional(),

  // ✅ ITEMS
  items: z.array(
    z.object({
      productId: z.coerce.number(),
      size: z.coerce.string().default("N/A"),
      quantity: z.coerce.number().min(1),
      price: z.coerce.number().optional().default(0)
    })
  ).min(1, "At least one item required"),

  shippingCharge: z.coerce.number().optional(),
  promoDiscount: z.coerce.number().optional(),
  promoCode: z.string().optional(),
  totalAmount: z.coerce.number().optional()
});