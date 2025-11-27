// app/api/admin/pos/cart/add/route.ts
import { db } from "@/lib/db";
import { adminCustomerCartItem, product } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { cartId, productId } = await req.json();

  const [p] = await db.select().from(product).where(eq(product.id, productId));

  await db.insert(adminCustomerCartItem).values({
    id: nanoid(),
    cartId,
    productId,
    name: p.productName,
    price: p.pricing.price,
    quantity: 1,
  });

  return NextResponse.json({ success: true });
}
