"use server";

import {
  category,
  product,
  productCategory,
  productImage,
  review,
} from "@/lib/db/schema";
import { db } from "@/lib/db";
import { and, eq, gte, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";
import { Product } from "../types/product.types";

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

export async function getProductById(id: string) {
  const result = await db.query.product.findFirst({
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

  if (!result) return null;

  const obj = {
    ...result,

    categories: result.productCategories?.map((pc) => ({
      id: pc.category.id,
      name: pc.category.name,
    })),
  };
  console.log(obj)

  return {
    ...result,

    categories: result.productCategories?.map((pc) => ({
      id: pc.category.id,
      name: pc.category.name,
    })),
  };
}

export async function getProducts() {
  return await db.query.product.findMany({
    with: {
      productImages: true,
      productCategories: true,
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
                      eq(category.id, productCategory.categoryId),
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

  console.log(earbuds);
  return earbuds;
};

export async function createProduct(p: Partial<Product>) {
  const id = nanoid();
  if (!p) {
    throw new Error("Product is required");
  }

  await db.insert(product).values({
    id: id,
    productName: p.productName!,
    brand: p.brand!,
    model: p.model ?? "",
    subCategory: p.subCategory ?? "",
    description: p.description ?? "",
    features: p.features ?? [],
    pricing: {
      price: p.pricing?.price,
      currency: "eur",
      discount: p.pricing?.discount,
      inStock: p.pricing?.inStock ?? true,
      stockQuantity: p.pricing?.stockQuantity,
    },
    specifications: p.specifications,
    tags: p.tags ?? [],
  });

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

export async function updateProduct(id: string, p: Partial<Product>) {
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

  const existingCategoryLinks = await db.query.productCategory.findMany({
    where: eq(productCategory.productId, id),
  });

  const existingIds = new Set(existingCategoryLinks.map((c) => c.categoryId));

  const incomingCats = [];
  for (const name of p.categories ?? []) {
    incomingCats.push(await createCategoryIfNotExists(name));
  }
  const incomingIds = new Set(incomingCats.map((c) => c.id));

  const toAdd = [...incomingIds].filter((cid) => !existingIds.has(cid));
  const toRemove = [...existingIds].filter((cid) => !incomingIds.has(cid));

  if (toAdd.length) {
    await db.insert(productCategory).values(
      toAdd.map((categoryId) => ({
        productId: id,
        categoryId,
      }))
    );
  }

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

  for (const [fileId, oldImg] of existingMap) {
    if (!incomingMap.has(fileId)) {
      imagesToRemove.push(oldImg.fileId);
    }
  }

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

  for (const { oldImg, newImg } of imagesToUpdate) {
    await db
      .update(productImage)
      .set({ position: newImg.position })
      .where(eq(productImage.id, oldImg.id));
  }

  return getProductById(id);
}
export async function deleteProduct(id: string) {
  await db.delete(product).where(eq(product.id, id));
  return { success: true };
}
