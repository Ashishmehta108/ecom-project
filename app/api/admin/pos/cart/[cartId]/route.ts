// app/api/admin/pos/cart/[cartId]/route.ts
import { db } from "@/lib/db";
import { adminCustomerCartItem, product } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { cartId: string } }
) {
  const items = await db
    .select({
      id: adminCustomerCartItem.id,
      productId: adminCustomerCartItem.productId,
      name: adminCustomerCartItem.name,
      price: adminCustomerCartItem.price,
      quantity: adminCustomerCartItem.quantity,
      productName: product.productName,
      brand: product.brand,
      model: product.model,
    })
    .from(adminCustomerCartItem)
    .leftJoin(product, eq(product.id, adminCustomerCartItem.productId))
    .where(eq(adminCustomerCartItem.cartId, params.cartId));

  const subtotal = items.reduce(
    (sum, i) => sum + Number(i.price) * i.quantity,
    0
  );

  return NextResponse.json({ items, subtotal });
}
