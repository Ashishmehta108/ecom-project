"use server";
import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { cart, cartItem, productImage } from "../db/schema";
import { nanoid } from "nanoid";

export const createCartIfNotExists = async (userId: string) => {
  const existing = await db.query.cart.findFirst({
    where: (table, { eq }) => eq(table.userId, userId),
  });

  if (existing) return existing;

  const [newCart] = await db
    .insert(cart)
    .values({
      id: nanoid(),
      userId: userId,
    })
    .returning();

  return newCart;
};

import {
  CartItem as TCartItem,
  CartData,
  GetCartResponse,
} from "@/lib/types/cart.types";

export const getCart = async (userId: string): Promise<GetCartResponse> => {
  if (!userId) {
    return {
      success: false,
      data: null,
      error: "User ID not found",
    };
  }

  // Create cart if not exists (typed)
  const cartData = (await createCartIfNotExists(userId)) as CartData;

  // Fetch items
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

  // Cast output items to type
  const typedItems = items as TCartItem[];

  return {
    success: true,
    data: { cart: cartData, items: typedItems },
    error: null,
  };
};

export const addItemToCart = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  const cartData = await createCartIfNotExists(userId);
  const cartId = cartData.id;

  const [existingItem] = await db
    .select()
    .from(cartItem)
    .where(and(eq(cartItem.cartId, cartId), eq(cartItem.productId, productId)));

  if (existingItem) {
    const updated = await db
      .update(cartItem)
      .set({
        quantity: existingItem.quantity + quantity,
      })
      .where(eq(cartItem.id, existingItem.id))
      .returning();

    return {
      success: true,
      data: updated[0],
      error: null,
      message: "Item quantity updated",
    };
  }

  const prod = await db.query.product.findFirst({
    where: (table, { eq }) => eq(table.id, productId),
    with: {
      productCategories: {
        with: {
          category: true,
        },
      },
      productImages: {
        limit: 1,
        orderBy: (table, { asc }) => [asc(table.position)],
      },
    },
  });

  const [created] = await db
    .insert(cartItem)
    .values({
      id: nanoid(),
      cartId,
      productId,
      quantity,
      name: prod?.productName || "Product",
      price: String(prod?.pricing.price),
    })
    .returning();

  return {
    success: true,
    data: created,
    error: null,
    message: "Item added to cart",
  };
};

export const updateItemQuantity = async (
  cartItemId: string,
  newQuantity: number
) => {
  const [updated] = await db
    .update(cartItem)
    .set({ quantity: newQuantity })
    .where(eq(cartItem.id, cartItemId))
    .returning();

  if (!updated) {
    return { success: false, error: { message: "Item not found" }, data: {} };
  }

  return {
    success: true,
    data: updated,
    error: null,
    message: "Item quantity updated",
  };
};

export const removeItemFromCart = async (cartItemId: string) => {
  const [removed] = await db
    .delete(cartItem)
    .where(eq(cartItem.id, cartItemId))
    .returning();

  return {
    success: true,
    data: removed,
    error: null,
    message: "Item removed from cart",
  };
};

export const clearCart = async (userId: string) => {
  const existing = await db.query.cart.findFirst({
    where: (table, { eq }) => eq(table.userId, userId),
  });

  if (!existing) {
    return { success: true, message: "Cart already empty" };
  }

  await db.delete(cartItem).where(eq(cartItem.cartId, existing.id));

  return {
    success: true,
    message: "Cart cleared",
  };
};
