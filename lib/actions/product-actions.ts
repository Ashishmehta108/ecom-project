import {  product } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export const getProducts = async () => {
  const products = await db.select().from(product);
  return products;
};

export const getProductById = async (id: string) => {
  const Product = await db.select().from(product).where(eq(product.id, id));
  return Product;
};

export const createProduct = async (product: typeof product.$inferInsert) => {
  const [newProduct] = await db.insert(product).values(product).returning();
  return newProduct;
};

export const updateProduct = async (id: string, product: typeof product.$inferUpdate) => {
  const [updatedProduct] = await db.update(product).set(product).where(eq(product.id, id)).returning();
  return updatedProduct;
};

export const deleteProduct = async (id: string) => {
  const [deletedProduct] = await db.delete(product).where(eq(product.id, id)).returning();
  return deletedProduct;
};