"use server";

import { db } from "../db";
import { cart, cartItem, product, productImage } from "../db/schema";
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
import { v4 as uuidv4 } from "uuid";
import { eq, and } from "drizzle-orm";

export async function addItemToCart(
  userId: string,
  productId: string,
  quantityToAdd: number
) {
  if (quantityToAdd <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  return await db.transaction(async (tx) => {

    let userCart = await tx
      .select()
      .from(cart)
      .where(eq(cart.userId, userId))
      .limit(1);

    let cartId: string;

    if (userCart.length === 0) {
      const newCart = await tx
        .insert(cart)
        .values({
          id: uuidv4(),
          userId: userId,
          currency: "EUR",
        })
        .returning();
      
      cartId = newCart[0].id;
    } else {
      cartId = userCart[0].id;
    }

    const productData = await tx
      .select()
      .from(product)
      .where(eq(product.id, productId))
      .limit(1);

    if (productData.length === 0) {
      throw new Error("Product not found");
    }

    const currentProduct = productData[0];
    const currentStock = currentProduct.pricing.stockQuantity;

    if (!currentProduct.pricing.inStock ) {
      throw new Error(
        `Insufficient stock. Available: ${currentStock}`
      );
    }

    const existingCartItem = await tx
      .select()
      .from(cartItem)
      .where(
        and(
          eq(cartItem.cartId, cartId),
          eq(cartItem.productId, productId)
        )
      )
      .limit(1);

    let finalQuantity: number;

    if (existingCartItem.length > 0) {
      finalQuantity = existingCartItem[0].quantity + quantityToAdd;
      await tx
        .update(cartItem)
        .set({
          quantity: finalQuantity,
        })
        .where(eq(cartItem.id, existingCartItem[0].id));
    } else {
      finalQuantity = quantityToAdd;
      
      await tx.insert(cartItem).values({
        id: uuidv4(),
        cartId: cartId,
        productId: productId,
        name: currentProduct.productName,
        price: currentProduct.pricing.price.toString(),
        quantity: quantityToAdd,
      });
    }


    await tx
      .update(cart)
      .set({
        updatedAt: new Date(),
      })
      .where(eq(cart.id, cartId));

    return {
      success: true,
      cartId: cartId,
      productName: currentProduct.productName,
      quantityAdded: quantityToAdd,
      totalInCart: finalQuantity,
      message: `Added ${quantityToAdd} x ${currentProduct.productName} to cart`,
    };
  });
}




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
  const existing = await db.query.cartItem.findFirst({
    where: (t, { eq }) => eq(t.id, cartItemId),
  });
  if (!existing) return { success: false, data: null, error: "Item not found" };
  if (existing.quantity > 1) {
    const [updated] = await db
      .update(cartItem)
      .set({ quantity: existing.quantity - 1 })
      .where(eq(cartItem.id, cartItemId))
      .returning();
    return { success: true, data: updated, error: null };
  }
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
