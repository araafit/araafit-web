import { z } from "zod";

export const inventoryItemSchema = z.object({
  orderId: z.string(),
  Price: z.union([z.number(), z.string()]),
  DiscountsType: z.string(),
  stock: z.number(),
  status: z.string(),
  DiscountValue: z.union([z.number(), z.string()]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),

  generalInformation: z.object({
    name: z.string(),
    image: z.string(),
    category: z.enum(["dress", "fabric"]),
    ProductDescription: z.string(),
  }),

  // Dress-specific info
  dressInformation: z
    .object({
      materialType: z.string(),
      dressSize: z.union([z.number(), z.string()]),
      weight: z.union([z.number(), z.string()]),
      thickness: z.union([z.number(), z.string()]),
    })
    .optional(),

  // Fabric-specific info
  fabricInformation: z
    .object({
      materialType: z.string(),
      patternType: z.string(),
      style: z.string(),
      totalSize: z.union([z.number(), z.string()]),
      weight: z.union([z.number(), z.string()]),
      thickness: z.union([z.number(), z.string()]),
    })
    .optional(),

  skinTone: z.array(z.string()),
  quantity: z.union([z.number(), z.string()]),
});

export type OrderItem = z.infer<typeof inventoryItemSchema>;
