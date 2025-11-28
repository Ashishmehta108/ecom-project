"use server";

import { db } from "@/lib/db";
import { product } from "@/lib/db/schema";

export async function getTopSmartphones() {
  // Fetch products with relations
  const rows = await db.query.product.findMany({
    with: {
      productImages: true,
      productCategories: {
        with: {
          category: true,
        },
      },
    },
  });

  // Filter by category "Phones"
  const filtered = rows.filter((p) =>
    p.productCategories.some((c) => c.category.name === "Phones")
  );

  // Map to your desired frontend structure
  const smartphones = filtered.map((p) => ({
    id: p.id,
    name: p.productName,
    price: p.pricing.price,
    discount: p.pricing.discount,
    image: p.productImages?.[0]?.url || "/placeholder.png",
  }));

  return smartphones;
}
