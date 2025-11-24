"use server";

import {
  category,
  product,
  productCategory,
  productImage,
} from "@/lib/db/schema";
import { db } from "@/lib/db";
import { and, eq, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";
import { Product } from "../types/product.types";

// =====================================================================================
// HELPERS
// =====================================================================================

// Create a category only if it doesn't exist already
async function createCategoryIfNotExists(name: string) {
  const existing = await db.query.category.findFirst({
    where: (c, { eq }) => eq(c.name, name),
  });

  if (existing) return existing;

  const newCat = {
    id: nanoid(),
    name,
    imageUrl: "default",
  };

  await db.insert(category).values(newCat);
  return newCat;
}

// Get full product with relations
export async function getProductById(id: string) {
  return await db.query.product.findFirst({
    where: eq(product.id, id),
    with: {
      productImages: true,
      productCategories: {
        with: { category: true },
      },
    },
  });
}

export async function getProducts() {
  return await db.query.product.findMany({
    with: {
      productImages: true,
      productCategories: {
        with: { category: true },
      },
    },
  });
}

export const getEarbuds = async () => {
  const earbuds = await db.query.product.findMany({
    where: (product, { exists, eq, and }) =>
      exists(
        db
          .select()
          .from(productCategory)
          .where(
            and(
              eq(productCategory.productId, product.id),
              // correlate category.id with productCategory.categoryId
              exists(
                db
                  .select()
                  .from(category)
                  .where(
                    and(
                      eq(category.id, productCategory.categoryId), // <--- added correlation
                      eq(category.name, "Earphones")
                    )
                  )
              )
            )
          )
      ),
    with: {
      productImages: true,
      productCategories: {
        with: {
          category: true,
        },
      },
    },
  });

  // optional: remove or adjust logging in production
  console.log(earbuds);
  return earbuds;
};

export async function createProduct(p: Partial<Product>) {
  const id = nanoid();

  await db.insert(product).values({
    id,
    productName: p.productName!,
    brand: p.brand!,
    model: p.model ?? "",
    subCategory: p.subCategory ?? "",
    description: p.description ?? "",
    features: p.features ?? [],
    pricing: p.pricing ?? {
      price: 0,
      currency: "eur",
      discount: 0,
      inStock: true,
      stockQuantity: 10,
    },
    specifications: p.specifications,
    tags: p.tags ?? [],
  });

  // Categories
  const categoriesToInsert = [];
  for (const name of p.categories ?? []) {
    categoriesToInsert.push(await createCategoryIfNotExists(name));
  }

  if (categoriesToInsert.length) {
    await db.insert(productCategory).values(
      categoriesToInsert.map((c) => ({
        productId: id,
        categoryId: c.id,
      }))
    );
  }

  // Images
  if (p.productImages?.length) {
    await db.insert(productImage).values(
      p.productImages.map((img, index) => ({
        id: nanoid(),
        productId: id,
        url: img.url,
        fileId: img.fileId!,
        position: String(index),
      }))
    );
  }

  return getProductById(id);
}

// =====================================================================================
// UPDATE PRODUCT — FULLY OPTIMIZED WITH DIFF
// =====================================================================================

export async function updateProduct(id: string, p: Partial<Product>) {
  // 1. Update base product fields
  await db
    .update(product)
    .set({
      productName: p.productName,
      brand: p.brand,
      model: p.model,
      subCategory: p.subCategory,
      description: p.description,
      features: p.features ?? [],
      pricing: p.pricing,
      specifications: p.specifications,
      tags: p.tags ?? [],
    })
    .where(eq(product.id, id));

  // ============================================================================
  // 2. CATEGORY DIFF
  // ============================================================================

  // Existing categories
  const existingCategoryLinks = await db.query.productCategory.findMany({
    where: eq(productCategory.productId, id),
  });

  const existingIds = new Set(existingCategoryLinks.map((c) => c.categoryId));

  // Incoming categories (create if missing)
  const incomingCats = [];
  for (const name of p.categories ?? []) {
    incomingCats.push(await createCategoryIfNotExists(name));
  }
  const incomingIds = new Set(incomingCats.map((c) => c.id));

  // Compute diff
  const toAdd = [...incomingIds].filter((cid) => !existingIds.has(cid));
  const toRemove = [...existingIds].filter((cid) => !incomingIds.has(cid));

  // Add new category relations
  if (toAdd.length) {
    await db.insert(productCategory).values(
      toAdd.map((categoryId) => ({
        productId: id,
        categoryId,
      }))
    );
  }

  // Remove outdated category relations
  if (toRemove.length) {
    await db
      .delete(productCategory)
      .where(
        and(
          eq(productCategory.productId, id),
          inArray(productCategory.categoryId, toRemove)
        )
      );
  }

  const existingImages = await db.query.productImage.findMany({
    where: eq(productImage.productId, id),
  });

  const existingMap = new Map(existingImages.map((img) => [img.fileId, img]));
  const incomingMap = new Map(
    (p.productImages ?? []).map((img, idx) => [
      img.fileId!,
      { ...img, position: String(idx) },
    ])
  );

  const imagesToAdd: any[] = [];
  const imagesToUpdate: any[] = [];
  const imagesToRemove: string[] = [];

  // Determine images to add or update
  for (const [fileId, newImg] of incomingMap) {
    if (!existingMap.has(fileId)) {
      imagesToAdd.push(newImg);
    } else {
      const oldImg = existingMap.get(fileId)!;
      if (oldImg.position !== newImg.position) {
        imagesToUpdate.push({ oldImg, newImg });
      }
    }
  }

  // Determine images to remove
  for (const [fileId, oldImg] of existingMap) {
    if (!incomingMap.has(fileId)) {
      imagesToRemove.push(oldImg.fileId);
    }
  }

  // Apply removals
  if (imagesToRemove.length) {
    await db
      .delete(productImage)
      .where(
        and(
          eq(productImage.productId, id),
          inArray(productImage.fileId, imagesToRemove)
        )
      );
  }

  // Apply additions
  if (imagesToAdd.length) {
    await db.insert(productImage).values(
      imagesToAdd.map((img) => ({
        id: nanoid(),
        productId: id,
        url: img.url,
        fileId: img.fileId!,
        position: img.position,
      }))
    );
  }

  // Apply updates (position)
  for (const { oldImg, newImg } of imagesToUpdate) {
    await db
      .update(productImage)
      .set({ position: newImg.position })
      .where(eq(productImage.id, oldImg.id));
  }

  // ============================================================================
  // Return updated product
  // ============================================================================
  return getProductById(id);
}

// =====================================================================================
// DELETE PRODUCT
// =====================================================================================

export async function deleteProduct(id: string) {
  await db.delete(product).where(eq(product.id, id));
  return { success: true };
}
