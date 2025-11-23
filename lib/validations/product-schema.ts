import { z } from "zod";

export const generalSpecsSchema = z.object({
  productName: z.string().default(""),
  brandName: z.string().default(""),
  colors: z.string().default(""),
  material: z.string().default(""),
  weight: z.string().default(""),
  sizeMm: z.string().default(""),
  privateMold: z.string().default(""),
  certificate: z.array(z.string()).default([]),
});

export const technicalSpecsSchema = z.object({
  bluetoothVersion: z.string().default(""),
  wirelessDelayTime: z.string().default(""),
  waterproofStandard: z.string().default(""),
  chipset: z.string().default(""),
  batteryCapacity: z.string().default(""),
  useTime: z.string().default(""),
  standbyTime: z.string().default(""),
});

export const pricingSchema = z.object({
  price: z.coerce.number().min(0),
  currency: z.string().default("INR"),
  discount: z.coerce.number().min(0).max(100).default(0),
  inStock: z.boolean().default(true),
  stockQuantity: z.coerce.number().min(0).default(0),
});

export const productImageSchema = z.object({
  url: z.url(),
  fileId: z.string().optional(),
});

export const productFormSchema = z.object({
  id: z.string().optional(),
  productName: z.string().min(1),
  brand: z.string().min(1),
  model: z.string().optional().default(""),

  categories: z.array(z.string()).default([]),

  subCategory: z.string().optional().default(""),
  description: z.string().optional().default(""),
  features: z.array(z.string()).default([]),

  pricing: pricingSchema,

  specifications: z.object({
    general: generalSpecsSchema,
    technical: technicalSpecsSchema,
  }),

  productImages: z.array(productImageSchema).default([]),

  tags: z.array(z.string()).default([]),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
