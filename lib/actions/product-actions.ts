import { product } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export const getProducts = async () => {
  const products = await db.select().from(product);
  return products;
};

export const getProductById = async (id: string) => {
  const prod = await db.query.product.findFirst({
    where: eq(product.id, id),
    with: {
      productImages: true,
      productCategories: {
        with: {
          category: true,
        },
      },
    },
  });

  if (!prod) {
    throw new Error(`Product with ID "${id}" not found`);
  }

  return prod;
};

export const createProduct = async (p: typeof product.$inferInsert) => {
  const [newProduct] = await db.insert(product).values(p).returning();
  return newProduct;
};

export const updateProduct = async (
  id: string,
  p: typeof product.$inferInsert
) => {
  const [updatedProduct] = await db
    .update(product)
    .set(product)
    .where(eq(product.id, id))
    .returning();
  return updatedProduct;
};

export const deleteProduct = async (id: string) => {
  const [deletedProduct] = await db
    .delete(product)
    .where(eq(product.id, id))
    .returning();
  return deletedProduct;
};
