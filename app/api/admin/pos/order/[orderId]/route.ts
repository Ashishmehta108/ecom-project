// app/api/admin/pos/order/[orderId]/route.ts
import { db } from "@/lib/db";
import { adminCustomerOrder, adminCustomerOrderItem } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  const [order] = await db
    .select()
    .from(adminCustomerOrder)
    .where(eq(adminCustomerOrder.id, params.orderId));

  const items = await db
    .select()
    .from(adminCustomerOrderItem)
    .where(eq(adminCustomerOrderItem.orderId, params.orderId));

  return NextResponse.json({ order, items });
}
