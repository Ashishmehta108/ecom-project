"use server";

import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { cart, cartItem, productImage } from "../db/schema";
import { nanoid } from "nanoid";
import {
  CartItem as TCartItem,
  CartData,
  GetCartResponse,
} from "@/lib/types/cart.types";

export const createCartIfNotExists = async (userId: string) => {
  const existing = await db.query.cart.findFirst({
    where: (table, { eq }) => eq(table.userId, userId),
  });

  if (existing) return existing;

  const [newCart] = await db
    .insert(cart)
    .values({
      id: nanoid(),
      userId,
    })
    .returning();

  return newCart;
};

export const getCart = async (userId: string): Promise<GetCartResponse> => {
  if (!userId)
    return {
      success: false,
      data: null,
      error: "User ID missing",
    };

  const cartData = (await createCartIfNotExists(userId)) as CartData;

  const items = await db
    .select({
      id: cartItem.id,
      productId: cartItem.productId,
      name: cartItem.name,
      price: cartItem.price,
      quantity: cartItem.quantity,
      imageUrl: productImage.url,
    })
    .from(cartItem)
    .leftJoin(
      productImage,
      and(
        eq(cartItem.productId, productImage.productId),
        eq(productImage.position, "0")
      )
    )
    .where(eq(cartItem.cartId, cartData.id));

  return {
    success: true,
    data: { cart: cartData, items: items as TCartItem[] },
    error: null,
  };
};

export const addItemToCart = async (
  userId: string,
  productId: string,
  qty: number
) => {
  const cartData = await createCartIfNotExists(userId);

  const [existing] = await db
    .select()
    .from(cartItem)
    .where(
      and(eq(cartItem.cartId, cartData.id), eq(cartItem.productId, productId))
    );

  if (existing) {
    const [updated] = await db
      .update(cartItem)
      .set({ quantity: existing.quantity + qty })
      .where(eq(cartItem.id, existing.id))
      .returning();

    return { success: true, data: updated, error: null };
  }

  const prod = await db.query.product.findFirst({
    where: (t, { eq }) => eq(t.id, productId),
    with: {
      productImages: {
        limit: 1,
        orderBy: (t, { asc }) => [asc(t.position)],
      },
    },
  });

  const [created] = await db
    .insert(cartItem)
    .values({
      id: nanoid(),
      cartId: cartData.id,
      productId,
      quantity: qty,
      name: prod?.productName || "Product",
      price: String(prod?.pricing.price),
    })
    .returning();

  return { success: true, data: created, error: null };
};

export const updateItemQuantity = async (cartItemId: string, qty: number) => {
  const [updated] = await db
    .update(cartItem)
    .set({ quantity: qty })
    .where(eq(cartItem.id, cartItemId))
    .returning();

  return updated
    ? { success: true, data: updated, error: null }
    : { success: false, data: null, error: "Item not found" };
};

export const removeItemFromCart = async (cartItemId: string) => {
  const [removed] = await db
    .delete(cartItem)
    .where(eq(cartItem.id, cartItemId))
    .returning();

  return { success: true, data: removed, error: null };
};

export const clearCart = async (userId: string) => {
  const existing = await createCartIfNotExists(userId);

  await db.delete(cartItem).where(eq(cartItem.cartId, existing.id));

  return { success: true, message: "Cart cleared" };
};
