// app/api/admin/pos/cart/clear/route.ts
import { db } from "@/lib/db";
import { adminCustomerCartItem } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { cartId } = await req.json();

  await db
    .delete(adminCustomerCartItem)
    .where(eq(adminCustomerCartItem.cartId, cartId));

  return NextResponse.json({ success: true });
}
