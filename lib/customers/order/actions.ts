"use server";

import { db } from "@/lib/db";
import {
  posCart,
  posCartItem,
  posCustomer,
  product,
  posOrder,
  posOrderItem,
  posPayment,
} from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getPosCart, clearPosCart } from "@/lib/queries/admin-cart";
export async function savePosCustomerDetailsAction(
  customerId: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  }
) {
  await db.update(posCustomer).set(data).where(eq(posCustomer.id, customerId));
}

async function ensureCartForCustomer(customerId: string) {
  const existing = await db.query.posCart.findFirst({
    where: eq(posCart.customerId, customerId),
  });
  console.log(existing)

  if (existing) return existing;

  const [cart] = await db
    .insert(posCart)
    .values({
      id: nanoid(),
      customerId,
      currency: "EUR",
    })
    .returning();

  return cart;
}

export async function addToCustomerCartAction(
  customerId: string,
  productId: string
) {
  // 1. Ensure cart exists
  const cart = await ensureCartForCustomer(customerId);

  // 2. Fetch product
  const [prod] = await db
    .select()
    .from(product)
    .where(eq(product.id, productId));

  if (!prod) {
    throw new Error("Product not found");
  }

  // 3. Check if item already exists in this cart
  const [existingItem] = await db
    .select()
    .from(posCartItem)
    .where(
      and(
        eq(posCartItem.cartId, cart.id),
        eq(posCartItem.productId, productId)
      )
    )
    .limit(1);

  let row;

  if (existingItem) {
    // 4a. Update quantity if exists
    const [updated] = await db
      .update(posCartItem)
      .set({ quantity: existingItem.quantity + 1 })
      .where(eq(posCartItem.id, existingItem.id))
      .returning();
    row = updated;
  } else {
    // 4b. Insert new item if not exists
    const [inserted] = await db
      .insert(posCartItem)
      .values({
        id: nanoid(),
        cartId: cart.id,
        productId: prod.id,
        name: prod.productName,
        brand: prod.brand,
        model: prod.model,
        quantity: 1,
        // adjust this if your column is numeric instead of text
        price: prod.pricing.price.toString(),
      })
      .returning();
    row = inserted;
  }

  return {
    success: true,
    data: row,
  };
}


export async function updateCartItemQtyAction(
  customerId: string,
  cartItemId: string,
  newQty: number
) {
  const cart = await ensureCartForCustomer(customerId);

  if (newQty <= 0) {
    await db.delete(posCartItem).where(eq(posCartItem.id, cartItemId));
    return;
  }

  await db
    .update(posCartItem)
    .set({ quantity: newQty })
    .where(eq(posCartItem.id, cartItemId));
}

export async function removeCartItemAction(
  customerId: string,
  cartItemId: string
) {
  await db.delete(posCartItem).where(eq(posCartItem.id, cartItemId));
}

export async function checkoutForCustomerAction(customerId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/admin/checkout`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId }),
    }
  );

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Checkout failed");
  }

  const data = await res.json();
  return data.url as string | undefined;
}
