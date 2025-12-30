import { z } from "zod";

// Multilingual field schemas
const translatedFieldSchema = z.object({
  en: z.string().min(1, "English text is required"),
  pt: z.string().default(""),
});

const specPair = z.object({ 
  key: z.string().min(1, "Key is required"), 
  value: translatedFieldSchema // Updated to support multilingual values
});

export const generalSpecsSchema = z.array(specPair).default([]);
export const technicalSpecsSchema = z.array(specPair).default([]);

export const pricingSchema = z.object({
  price: z.coerce.number().min(0, "Price must be 0 or greater"),
  currency: z.string().default("EUR"),
  discount: z.coerce.number().min(0, "Discount cannot be negative").max(100, "Discount cannot exceed 100%").default(0),
  inStock: z.boolean().default(true),
  stockQuantity: z.coerce.number().min(0, "Stock quantity must be 0 or greater").default(0),
});

export const productImageSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  fileId: z.string().optional(),
});

const translatedArraySchema = z.object({
  en: z.array(z.string()).default([]),
  pt: z.array(z.string()).default([]),
});

export const productSchema = z.object({
  id: z.string().optional(),
});

export const productFormSchema = z.object({
  id: z.string().optional(),
  productName: translatedFieldSchema,
  brand: z.string().min(1, "Brand is required"),
  model: z.string().default(""),
  subCategory: translatedFieldSchema, // Updated to TranslatedField to match database schema
  description: translatedFieldSchema,
  categories: z.array(z.string()).default([]),
  features: translatedArraySchema,
  pricing: pricingSchema,
  specifications: z.object({
    general: generalSpecsSchema,
    technical: technicalSpecsSchema,
  }),
  productImages: z.array(productImageSchema).default([]),
  tags: translatedArraySchema,
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
export type ProductFormFormValues = z.input<typeof productFormSchema> &
  ProductFormValues;