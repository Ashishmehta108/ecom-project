// app/api/admin/pos/order/route.ts
import { db } from "@/lib/db";
import { adminCustomerOrder } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const orders = await db
    .select()
    .from(adminCustomerOrder)
    .orderBy(adminCustomerOrder.createdAt);

  return NextResponse.json(orders);
}
