// app/api/admin/pos/cart/remove/route.ts
import { db } from "@/lib/db";
import { adminCustomerCartItem } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { itemId } = await req.json();

  await db
    .delete(adminCustomerCartItem)
    .where(eq(adminCustomerCartItem.id, itemId));

  return NextResponse.json({ success: true });
}
