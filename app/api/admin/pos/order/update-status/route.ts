// app/api/admin/pos/order/update-status/route.ts
import { db } from "@/lib/db";
import { adminCustomerOrder } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { orderId, status } = await req.json();

  await db
    .update(adminCustomerOrder)
    .set({ status, orderStatus: status })
    .where(eq(adminCustomerOrder.id, orderId));

  return NextResponse.json({ success: true });
}
