import { z } from "zod";

export const schema = z.object({
  orderId: z.string(),
  dress: z.string(),
  cost: z.union([z.number(), z.string()]),
  status: z.string(),
  image: z.string(),

  size: z.union([z.number(), z.string()]),
  PreferredStyle: z.string(),
  YardEstimate: z.union([z.number(), z.string()]),
  PricePerYard: z.union([z.number(), z.string()]),
  TotalAmount: z.union([z.number(), z.string()]),
  paymentMethod: z.string(),

  customerMeasurements: z.object({
    Bust: z.number(),
    Waist: z.number(),
    Hips: z.number(),
    Shoulder: z.number(),
    Height: z.union([z.number(), z.string()]),
    SkinTone: z.string(),
  }),

  deliveryInformation: z.object({
    name: z.string(),
    email: z.string().email(),
    address: z.string(),
    city: z.string(),
    phone: z.string(),
  }),

  riderInformation: z
    .object({
      name: z.string(),
      phone: z.string(),
      vehicleNumber: z.string(),
      trackingId: z.string().optional(),
    })
    .optional(),

  additionalInfo: z.string().optional(),
});

export type Schema = z.infer<typeof schema>;
