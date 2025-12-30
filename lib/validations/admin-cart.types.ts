import { z } from "zod";
import type { TranslatedField } from "@/lib/types/product.types";

export const customerInfoSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.email("Invalid email address"),
  customerPhone: z.string().min(10, "Phone must be at least 10 digits"),
  customerAddress: z.string().min(10, "Address must be at least 10 characters"),
});

export type CustomerInfo = z.infer<typeof customerInfoSchema>;

// Add to Cart Schema
export const addToCartSchema = z.object({
  cartId: z.string().min(1),
  productId: z.string().min(1),
  quantity: z.number().int().positive("Quantity must be positive"),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;

export const updateQuantitySchema = z.object({
  cartItemId: z.string().min(1),
  quantity: z.number().int().positive("Quantity must be positive"),
});

export type UpdateQuantityInput = z.infer<typeof updateQuantitySchema>;

export interface ProductWithImage {
  id: string;
  productName: TranslatedField; // Updated to match database schema
  brand: string;
  model: string;
  subCategory: TranslatedField; // Updated to match database schema
  description: TranslatedField; // Updated to match database schema
  pricing: {
    price: number;
    currency: string;
    discount: number;
    inStock: boolean;
    stockQuantity: number;
  };
  mainImage?: {
    url: string;
  };
}

export interface CartItemWithProduct {
  id: string;
  cartId: string;
  productId: string;
  name: string;
  price: string;
  quantity: number;
  addedAt: Date;
  product: ProductWithImage;
}

// Cart with Items
export interface AdminCartWithItems {
  id: string;
  createdAt: Date;
  items: CartItemWithProduct[];
}

// Custom Errors
export class InsufficientStockError extends Error {
  constructor(productName: string, available: number, requested: number) {
    super(
      `Insufficient stock for ${productName}. Available: ${available}, Requested: ${requested}`
    );
    this.name = "InsufficientStockError";
  }
}

export class ProductNotFoundError extends Error {
  constructor(productId: string) {
    super(`Product not found: ${productId}`);
    this.name = "ProductNotFoundError";
  }
}

export class CartNotFoundError extends Error {
  constructor(cartId: string) {
    super(`Cart not found: ${cartId}`);
    this.name = "CartNotFoundError";
  }
}
