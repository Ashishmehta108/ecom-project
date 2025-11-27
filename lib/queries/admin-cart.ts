// lib/queries/pos-cart.ts

import { db } from "@/lib/db";
import { posCart, posCartItem, posCustomer, product } from "@/lib/db/schema"; // adjust imports to your schema file
import { eq } from "drizzle-orm";

export async function getProductsForAdmin() {

  return await db.query.product.findMany({
    with: {
      productImages: true,
      productCategories: {
        with: {
          category: true,
        },
      },
    },
  });
}

export async function getPosCart(customerId: string) {
  const cartRow = await db.query.posCart.findFirst({
    where: eq(posCart.customerId, customerId),
  });

  if (!cartRow) return null;

  const items = await db
    .select({
      id: posCartItem.id,
      quantity: posCartItem.quantity,
      price: posCartItem.price,
      productId: posCartItem.productId,
      name: posCartItem.name,
      productName: product.productName,
      brand: product.brand,
      model: product.model,
    })
    .from(posCartItem)
    .innerJoin(product, eq(posCartItem.productId, product.id))
    .where(eq(posCartItem.cartId, cartRow.id));

  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.price);
    return sum + price * item.quantity;
  }, 0);

  return {
    cart: cartRow,
    items,
    subtotal,
  };
}

export async function clearPosCart(customerId: string) {
  const cartRow = await db.query.posCart.findFirst({
    where: eq(posCart.customerId, customerId),
  });

  if (!cartRow) return;

  await db.delete(posCartItem).where(eq(posCartItem.cartId, cartRow.id));
}

export async function ensurePosCustomerAndCart() {
  const { nanoid } = await import("nanoid");
  const customerId = nanoid();
  const cartId = nanoid();

  const [customer] = await db
    .insert(posCustomer)
    .values({ id: customerId })
    .returning();

  const [cart] = await db
    .insert(posCart)
    .values({
      id: cartId,
      customerId,
      currency: "EUR",
    })
    .returning();

  return { customer, cart };
}
