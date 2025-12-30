"use server";

import { db } from "@/lib/db";
import { product, productImage } from "@/lib/db/schema";
import { and, eq, ilike, or, sql } from "drizzle-orm";
import { arrayContains } from "drizzle-orm";

export async function searchProducts(query: string) {
  if (!query || query.trim().length < 1) return [];

  const q = `%${query}%`;
  const queryLower = query.toLowerCase();

  return await db
    .select({
      id: product.id,
      name: product.productName, // Multilingual object {en: string, pt: string}
      brand: product.brand,
      model: product.model,
      tags: product.tags, // Multilingual object {en: string[], pt: string[]}
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
        // Search in English product name
        sql`LOWER(${product.productName}->>'en') LIKE ${q.toLowerCase()}`,
        // Search in Portuguese product name
        sql`LOWER(${product.productName}->>'pt') LIKE ${q.toLowerCase()}`,
        // Search in brand
        ilike(product.brand, q),
        // Search in model
        ilike(product.model, q),
        // Search in English tags
        sql`EXISTS (
          SELECT 1 FROM jsonb_array_elements_text(${product.tags}->'en') AS tag
          WHERE LOWER(tag) LIKE ${q.toLowerCase()}
        )`,
        // Search in Portuguese tags
        sql`EXISTS (
          SELECT 1 FROM jsonb_array_elements_text(${product.tags}->'pt') AS tag
          WHERE LOWER(tag) LIKE ${q.toLowerCase()}
        )`
      )
    )
    .limit(6);
}
