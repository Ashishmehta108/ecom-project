"use server";

import { db } from "@/lib/db";
import { product, productImage } from "@/lib/db/schema";
import { and, eq, ilike, or } from "drizzle-orm";
import { arrayContains } from "drizzle-orm";

export async function searchProducts(query: string) {
  if (!query || query.trim().length < 2) return [];

  const q = `%${query}%`;

  return await db
    .select({
      id: product.id,
      name: product.productName,
      brand: product.brand,
      model: product.model,
      tags: product.tags,
      image: productImage.url,
    })
    .from(product)
    .leftJoin(
      productImage,
      and(
        eq(productImage.productId, product.id),
        eq(productImage.position, "0")
      )
    )
    .where(
      or(
        ilike(product.productName, q),
        ilike(product.brand, q),
        ilike(product.model, q),
        arrayContains(product.tags, [query.toLowerCase()]),
        arrayContains(product.tags, [query.toUpperCase()]),
        arrayContains(product.tags, [query])
      )
    )
    .limit(6);
}
