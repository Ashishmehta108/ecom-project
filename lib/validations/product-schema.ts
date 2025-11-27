import { z } from "zod";

const specPair = z.object({ key: z.string().min(1), value: z.string().min(1) });
export const generalSpecsSchema = z.array(specPair).default([]);
export const technicalSpecsSchema = z.array(specPair).default([]);

export const pricingSchema = z.object({
  price: z.coerce.number().min(0),
  currency: z.string().default("EUR"),
  discount: z.coerce.number().min(0).max(100).default(0),
  inStock: z.boolean().default(true),
  stockQuantity: z.coerce.number().min(0).default(0),
});

export const productImageSchema = z.object({
  url: z.url(),
  fileId: z.string().optional(),
});

export const productSchema = z.object({
  id: z.string().optional(),
});
export const productFormSchema = z.object({
  id: z.string().optional(),
  productName: z.string().min(1),
  brand: z.string().min(1),
  model: z.string().default(""),
  subCategory: z.string().default(""),
  description: z.string().default(""),
  categories: z.array(z.string()).default([]),
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
export type ProductFormFormValues = z.input<typeof productFormSchema> &
  ProductFormValues;
