// "use server";

// import { db } from "../db";
// import { cart, cartItem, product, productImage } from "../db/schema";
// import { nanoid } from "nanoid";
// import {
//   CartItem as TCartItem,
//   CartData,
//   GetCartResponse,
// } from "@/lib/types/cart.types";

// export const createCartIfNotExists = async (userId: string) => {
//   const existing = await db.query.cart.findFirst({
//     where: (table, { eq }) => eq(table.userId, userId),
//   });

//   if (existing) return existing;

//   const [newCart] = await db
//     .insert(cart)
//     .values({
//       id: nanoid(),
//       userId,
//     })
//     .returning();

//   return newCart;
// };

// export const getCart = async (userId: string): Promise<GetCartResponse> => {
//   if (!userId)
//     return {
//       success: false,
//       data: null,
//       error: "User ID missing",
//     };

//   const cartData = (await createCartIfNotExists(userId)) as CartData;

//   const items = await db
//     .select({
//       id: cartItem.id,
//       productId: cartItem.productId,
//       name: cartItem.name,
//       price: cartItem.price,
//       quantity: cartItem.quantity,
//       imageUrl: productImage.url,
//     })
//     .from(cartItem)
//     .leftJoin(
//       productImage,
//       and(
//         eq(cartItem.productId, productImage.productId),
//         eq(productImage.position, "0")
//       )
//     )
//     .where(eq(cartItem.cartId, cartData.id));

//   return {
//     success: true,
//     data: { cart: cartData, items: items as TCartItem[] },
//     error: null,
//   };
// };
// import { v4 as uuidv4 } from "uuid";
// import { eq, and } from "drizzle-orm";

// export async function addItemToCart(
//   userId: string,
//   productId: string,
//   quantityToAdd: number
// ) {
//   if (quantityToAdd <= 0) {
//     throw new Error("Quantity must be greater than 0");
//   }

//   return await db.transaction(async (tx) => {

//     let userCart = await tx
//       .select()
//       .from(cart)
//       .where(eq(cart.userId, userId))
//       .limit(1);

//     let cartId: string;

//     if (userCart.length === 0) {
//       const newCart = await tx
//         .insert(cart)
//         .values({
//           id: uuidv4(),
//           userId: userId,
//           currency: "EUR",
//         })
//         .returning();
      
//       cartId = newCart[0].id;
//     } else {
//       cartId = userCart[0].id;
//     }

//     const productData = await tx
//       .select()
//       .from(product)
//       .where(eq(product.id, productId))
//       .limit(1);

//     if (productData.length === 0) {
//       throw new Error("Product not found");
//     }

//     const currentProduct = productData[0];
//     const currentStock = currentProduct.pricing.stockQuantity;

//     if (!currentProduct.pricing.inStock ) {
//       throw new Error(
//         `Insufficient stock. Available: ${currentStock}`
//       );
//     }

//     const existingCartItem = await tx
//       .select()
//       .from(cartItem)
//       .where(
//         and(
//           eq(cartItem.cartId, cartId),
//           eq(cartItem.productId, productId)
//         )
//       )
//       .limit(1);

//     let finalQuantity: number;

//     if (existingCartItem.length > 0) {
//       finalQuantity = existingCartItem[0].quantity + quantityToAdd;
//       await tx
//         .update(cartItem)
//         .set({
//           quantity: finalQuantity,
//         })
//         .where(eq(cartItem.id, existingCartItem[0].id));
//     } else {
//       finalQuantity = quantityToAdd;
      
//       await tx.insert(cartItem).values({
//         id: uuidv4(),
//         cartId: cartId,
//         productId: productId,
//         name: currentProduct.productName,
//         price: currentProduct.pricing.price.toString(),
//         quantity: quantityToAdd,
//       });
//     }


//     await tx
//       .update(cart)
//       .set({
//         updatedAt: new Date(),
//       })
//       .where(eq(cart.id, cartId));

//     return {
//       success: true,
//       cartId: cartId,
//       productName: currentProduct.productName,
//       quantityAdded: quantityToAdd,
//       totalInCart: finalQuantity,
//       message: `Added ${quantityToAdd} x ${currentProduct.productName} to cart`,
//     };
//   });
// }




// export const updateItemQuantity = async (cartItemId: string, qty: number) => {
//   const [updated] = await db
//     .update(cartItem)
//     .set({ quantity: qty })
//     .where(eq(cartItem.id, cartItemId))
//     .returning();

//   return updated
//     ? { success: true, data: updated, error: null }
//     : { success: false, data: null, error: "Item not found" };
// };

// export const removeItemFromCart = async (cartItemId: string) => {
//   const existing = await db.query.cartItem.findFirst({
//     where: (t, { eq }) => eq(t.id, cartItemId),
//   });
//   if (!existing) return { success: false, data: null, error: "Item not found" };
//   if (existing.quantity > 1) {
//     const [updated] = await db
//       .update(cartItem)
//       .set({ quantity: existing.quantity - 1 })
//       .where(eq(cartItem.id, cartItemId))
//       .returning();
//     return { success: true, data: updated, error: null };
//   }
//   const [removed] = await db
//     .delete(cartItem)
//     .where(eq(cartItem.id, cartItemId))
//     .returning();

//   return { success: true, data: removed, error: null };
// };

// export const clearCart = async (userId: string) => {
//   const existing = await createCartIfNotExists(userId);

//   await db.delete(cartItem).where(eq(cartItem.cartId, existing.id));

//   return { success: true, message: "Cart cleared" };
// };


"use server";

import { db } from "../db";
import { cart, cartItem, product, productImage } from "../db/schema";
import { nanoid } from "nanoid";
import { eq, and, inArray } from "drizzle-orm";
import {
  CartItem as TCartItem,
  CartData,
  GetCartResponse,
} from "@/lib/types/cart.types";

/**
 * Helper: Check if product is in stock
 */
async function validateProductStock(tx: any, productId: string) {
  const productData = await tx
    .select()
    .from(product)
    .where(eq(product.id, productId))
    .limit(1);

  if (productData.length === 0) {
    throw new Error("Product not found");
  }

  const currentProduct = productData[0];
  const { inStock, stockQuantity } = currentProduct.pricing;

  return {
    product: currentProduct,
    isAvailable: inStock && stockQuantity > 0,
    stockQuantity,
  };
}

/**
 * Create cart if not exists
 */
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
      currency: "EUR",
    })
    .returning();

  return newCart;
};

/**
 * Get cart with auto-cleanup of out-of-stock items
 */
export const getCart = async (userId: string): Promise<GetCartResponse> => {
  if (!userId) {
    return {
      success: false,
      data: null,
      error: "User ID missing",
    };
  }

  return await db.transaction(async (tx) => {
    // Get or create cart
    let userCart = await tx.query.cart.findFirst({
      where: (table, { eq }) => eq(table.userId, userId),
    });

    if (!userCart) {
      const [newCart] = await tx
        .insert(cart)
        .values({
          id: nanoid(),
          userId,
          currency: "EUR",
        })
        .returning();
      userCart = newCart;
    }

    // Get all cart items with product info
    const items = await tx
      .select({
        id: cartItem.id,
        productId: cartItem.productId,
        name: cartItem.name,
        price: cartItem.price,
        quantity: cartItem.quantity,
        imageUrl: productImage.url,
        productPricing: product.pricing,
      })
      .from(cartItem)
      .leftJoin(
        productImage,
        and(
          eq(cartItem.productId, productImage.productId),
          eq(productImage.position, "0")
        )
      )
      .leftJoin(product, eq(cartItem.productId, product.id))
      .where(eq(cartItem.cartId, userCart.id));

    // Filter out-of-stock items and collect IDs to remove
    const outOfStockIds: string[] = [];
    const validItems: TCartItem[] = [];

    for (const item of items) {
      if (!item.productPricing) {
        outOfStockIds.push(item.id);
        continue;
      }

      const { inStock, stockQuantity } = item.productPricing;
      const isAvailable = inStock && stockQuantity > 0;

      if (!isAvailable) {
        outOfStockIds.push(item.id);
        continue;
      }

      // Add to valid items with stock info
      validItems.push({
        id: item.id,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
        stockQuantity: stockQuantity,
        inStock: inStock,
      });
    }

    // Remove out-of-stock items from database
    if (outOfStockIds.length > 0) {
      await tx.delete(cartItem).where(inArray(cartItem.id, outOfStockIds));
    }

    return {
      success: true,
      data: {
        cart: userCart as CartData,
        items: validItems,
        removedOutOfStock: outOfStockIds.length,
      },
      error: null,
    };
  });
};

/**
 * Add item to cart with stock validation
 */
export async function addItemToCart(
  userId: string,
  productId: string,
  quantityToAdd: number
) {
  if (quantityToAdd <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  return await db.transaction(async (tx) => {
    // Get or create cart
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
          id: nanoid(),
          userId: userId,
          currency: "EUR",
        })
        .returning();

      cartId = newCart[0].id;
    } else {
      cartId = userCart[0].id;
    }

    // Validate stock
    const { product: currentProduct, isAvailable, stockQuantity } =
      await validateProductStock(tx, productId);

    if (!isAvailable) {
      throw new Error("Product is out of stock");
    }

    // Check existing cart item
    const existingCartItem = await tx
      .select()
      .from(cartItem)
      .where(and(eq(cartItem.cartId, cartId), eq(cartItem.productId, productId)))
      .limit(1);

    let finalQuantity: number;

    if (existingCartItem.length > 0) {
      finalQuantity = existingCartItem[0].quantity + quantityToAdd;

      // Check if requested quantity exceeds stock
      if (finalQuantity > stockQuantity) {
        throw new Error(
          `Not enough stock. Available: ${stockQuantity}, Requested: ${finalQuantity}`
        );
      }

      await tx
        .update(cartItem)
        .set({
          quantity: finalQuantity,
        })
        .where(eq(cartItem.id, existingCartItem[0].id));
    } else {
      finalQuantity = quantityToAdd;

      // Check if requested quantity exceeds stock
      if (finalQuantity > stockQuantity) {
        throw new Error(
          `Not enough stock. Available: ${stockQuantity}, Requested: ${finalQuantity}`
        );
      }

      await tx.insert(cartItem).values({
        id: nanoid(),
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

/**
 * Update item quantity with stock validation
 */
export const updateItemQuantity = async (cartItemId: string, qty: number) => {
  if (qty <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  return await db.transaction(async (tx) => {
    // Get cart item
    const existingItem = await tx
      .select()
      .from(cartItem)
      .where(eq(cartItem.id, cartItemId))
      .limit(1);

    if (existingItem.length === 0) {
      return { success: false, data: null, error: "Item not found" };
    }

    const item = existingItem[0];

    // Validate stock
    try {
      const { isAvailable, stockQuantity } = await validateProductStock(
        tx,
        item.productId
      );

      // If product is out of stock, remove it
      if (!isAvailable) {
        await tx.delete(cartItem).where(eq(cartItem.id, cartItemId));
        return {
          success: false,
          data: null,
          error: "Product is now out of stock and has been removed from cart",
          removed: true,
        };
      }

      // Check if requested quantity exceeds stock
      if (qty > stockQuantity) {
        return {
          success: false,
          data: null,
          error: `Not enough stock. Available: ${stockQuantity}`,
        };
      }

      // Update quantity
      const [updated] = await tx
        .update(cartItem)
        .set({ quantity: qty })
        .where(eq(cartItem.id, cartItemId))
        .returning();

      return { success: true, data: updated, error: null };
    } catch (error: any) {
      // If product not found, remove from cart
      await tx.delete(cartItem).where(eq(cartItem.id, cartItemId));
      return {
        success: false,
        data: null,
        error: "Product no longer available and has been removed from cart",
        removed: true,
      };
    }
  });
};

/**
 * Remove item from cart (decrease by 1 or delete)
 */
export const removeItemFromCart = async (cartItemId: string) => {
  const existing = await db.query.cartItem.findFirst({
    where: (t, { eq }) => eq(t.id, cartItemId),
  });

  if (!existing) {
    return { success: false, data: null, error: "Item not found" };
  }

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

/**
 * Clear entire cart
 */
export const clearCart = async (userId: string) => {
  const existing = await db.query.cart.findFirst({
    where: (t, { eq }) => eq(t.userId, userId),
  });

  if (!existing) {
    return { success: true, message: "Cart already empty" };
  }

  await db.delete(cartItem).where(eq(cartItem.cartId, existing.id));

  return { success: true, message: "Cart cleared" };
};