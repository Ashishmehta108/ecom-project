"use server";

import {
  category,
  product,
  productCategory,
  productImage,
  review,
} from "@/lib/db/schema";
import { db } from "@/lib/db";
import { and, eq, gte, inArray, sql, or } from "drizzle-orm";
import { nanoid } from "nanoid";
import { Product } from "../types/product.types";
import { revalidatePath } from "next/cache";
import { resolveProductForLanguage } from "@/lib/utils/language";
import type { Language } from "@/lib/types/product.types";

// Categories are now passed as IDs directly - no need for name-based creation
// This prevents duplicate categories from being created during product updates

export async function getProductById(id: string, lang: Language = "en") {
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

  // Resolve multilingual fields
  const resolved = resolveProductForLanguage(result, lang);

  return {
    ...resolved,
    categories: result.productCategories?.map((pc) => ({
      id: pc.category.id,
      name: pc.category.name,
    })),
  };
}

// Add new function to get raw product data (without language resolution)
export async function getProductByIdRaw(id: string) {
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

  return {
    ...result,
    categories: result.productCategories?.map((pc) => ({
      id: pc.category.id,
      name: pc.category.name,
    })),
  };
}

export async function getProducts(lang: Language = "en") {
  const products = await db.query.product.findMany({
    with: {
      productImages: true,
      productCategories: {
        with: {
          category: true,
        },
      },
    },
  });

  // Return original products with multilingual objects (not resolved)
  // This allows client-side components to translate dynamically when language changes
  return products;
}

export const getEarbuds = async (lang: Language = "en") => {
  const rows = await db.query.product.findMany({
    where: (p, { exists, eq: eqFn, and: andFn }) =>
      exists(
        db
          .select()
          .from(productCategory)
          .where(
            andFn(
              eqFn(productCategory.productId, p.id),
              exists(
                db
                  .select()
                  .from(category)
                  .where(
                    andFn(
                      eqFn(category.id, productCategory.categoryId),
                      or(
                        sql`${category.name}->>'en' = 'Earphones'`,
                        sql`${category.name}->>'pt' = 'Fones de ouvido'`
                      )
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

  // Return raw products with multilingual objects (not resolved)
  // This allows client-side components to translate dynamically when language changes
  return rows;
};


export async function createProduct(p: Partial<Product>) {
  const id = nanoid();
  if (!p) {
    throw new Error("Product is required");
  }

  // Ensure multilingual structure
  const productName = typeof p.productName === 'string' 
    ? { en: p.productName, pt: '' }
    : (p.productName || { en: '', pt: '' });

  const subCategory = typeof p.subCategory === 'string'
    ? { en: p.subCategory, pt: '' }
    : (p.subCategory || { en: '', pt: '' });

  const description = typeof p.description === 'string'
    ? { en: p.description, pt: '' }
    : (p.description || { en: '', pt: '' });

  const features = Array.isArray(p.features)
    ? { en: p.features, pt: [] }
    : (p.features || { en: [], pt: [] });

  const tags = Array.isArray(p.tags)
    ? { en: p.tags, pt: [] }
    : (p.tags || { en: [], pt: [] });

  await db.insert(product).values({
    id: id,
    productName: productName,
    brand: p.brand!,
    model: p.model ?? "",
    subCategory: subCategory,
    description: description,
    features: features,
    pricing: {
      price: p.pricing?.price,
      currency: "eur",
      discount: p.pricing?.discount,
      inStock: p.pricing?.inStock ?? true,
      stockQuantity: p.pricing?.stockQuantity,
    },
    specifications: p.specifications,
    tags: tags,
    variantGroupId: p.variantGroupId ?? null,
    variantLabel: p.variantLabel ?? null,
  });

  // Categories are now passed as IDs - use them directly
  const categoryIds = (p.categories ?? []).filter(Boolean);

  if (categoryIds.length) {
    await db.insert(productCategory).values(
      categoryIds.map((categoryId: string) => ({
        productId: id,
        categoryId,
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

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  return getProductById(id);
}

export async function updateProduct(id: string, p: Partial<Product>) {
  // Ensure multilingual structure
  const productName = typeof p.productName === 'string' 
    ? { en: p.productName, pt: '' }
    : p.productName;

  const subCategory = typeof p.subCategory === 'string'
    ? { en: p.subCategory, pt: '' }
    : (p.subCategory || { en: '', pt: '' });

  const description = typeof p.description === 'string'
    ? { en: p.description, pt: '' }
    : p.description;

  const features = Array.isArray(p.features)
    ? { en: p.features, pt: [] }
    : (p.features || { en: [], pt: [] });

  const tags = Array.isArray(p.tags)
    ? { en: p.tags, pt: [] }
    : (p.tags || { en: [], pt: [] });

  await db
    .update(product)
    .set({
      productName: productName,
      brand: p.brand,
      model: p.model,
      subCategory: subCategory,
      description: description,
      features: features,
      pricing: p.pricing,
      specifications: p.specifications,
      tags: tags,
      variantGroupId: p.variantGroupId !== undefined ? p.variantGroupId : undefined,
      variantLabel: p.variantLabel !== undefined ? p.variantLabel : undefined,
    })
    .where(eq(product.id, id));

  const existingCategoryLinks = await db.query.productCategory.findMany({
    where: eq(productCategory.productId, id),
  });

  const existingIds = new Set(existingCategoryLinks.map((c) => c.categoryId));

  // Categories are now passed as IDs - use them directly
  const incomingIds = new Set((p.categories ?? []).filter(Boolean));

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
  
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);

  return getProductById(id);
}

export async function deleteProduct(id: string) {
  await db.delete(product).where(eq(product.id, id));
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  return { success: true };
}

// Get all sibling variants in the same variant group (excluding current product)
export async function getVariantsByGroupId(groupId: string, excludeId?: string) {
  const rows = await db.query.product.findMany({
    where: (p, { eq: eqFn, and: andFn, ne }) =>
      excludeId
        ? andFn(eqFn(p.variantGroupId, groupId), ne(p.id, excludeId))
        : eqFn(p.variantGroupId, groupId),
    with: {
      productImages: true,
    },
  });
  return rows;
}

// Lightweight list for admin variant-linking dropdown
export async function getAllProductsBasic() {
  const rows = await db
    .select({
      id: product.id,
      productName: product.productName,
      brand: product.brand,
      variantGroupId: product.variantGroupId,
      variantLabel: product.variantLabel,
    })
    .from(product);
  return rows;
}
