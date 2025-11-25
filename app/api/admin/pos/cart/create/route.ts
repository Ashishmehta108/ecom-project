// app/api/admin/pos/order/create/route.ts
import { db } from "@/lib/db";
import {
  adminCustomerCartItem,
  adminCustomerOrder,
  adminCustomerOrderItem,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const {
    cartId,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
  } = await req.json();

  const items = await db
    .select()
    .from(adminCustomerCartItem)
    .where(eq(adminCustomerCartItem.cartId, cartId));

  const subtotal = items.reduce(
    (sum, i) => sum + Number(i.price) * i.quantity,
    0
  );

  const orderId = nanoid();

  // Create order
  await db.insert(adminCustomerOrder).values({
    id: orderId,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    subtotal,

    shippingFee: "0",
    total: subtotal,
    currency: "INR",
  });

  for (const item of items) {
    await db.insert(adminCustomerOrderItem).values({
      id: nanoid(),
      orderId,
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    });
  }

  // Clear cart
  await db
    .delete(adminCustomerCartItem)
    .where(eq(adminCustomerCartItem.cartId, cartId));

  return NextResponse.json({ orderId });
}
