"use server";

import { db } from "../../db";
import {
  adminCustomerCart,
  adminCustomerCartItem,
  product,
  productImage,
} from "../../db/schema";

import { eq, and, asc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getTranslatedText } from "@/lib/utils/language";

import {
  addToCartSchema,
  updateQuantitySchema,
  ProductWithImage,
  AdminCartWithItems,
  InsufficientStockError,
  ProductNotFoundError,
  CartNotFoundError,
} from "../../validations/admin-cart.types";

/**
 * Fetch all products with their main image (position = 0)
 */
export async function getProductsWithMainImage(): Promise<ProductWithImage[]> {
  const products = await db.query.product.findMany({
    with: {
      productImages: {
        where: eq(productImage.position, "0"),
        limit: 1,
      },
    },
  });

  return products.map((p) => ({
    id: p.id,
    productName: p.productName,
    brand: p.brand,
    model: p.model,
    subCategory: p.subCategory,
    description: p.description,
    pricing: p.pricing,
    mainImage: (p as any).productImages?.[0] ? { url: (p as any).productImages[0].url } : undefined,
  }));
}

/**
 * Create a new admin customer cart
 */
export async function createAdminCustomerCart() {
  try {
    const cartId = nanoid();
    const [cart] = await db
      .insert(adminCustomerCart)
      .values({ id: cartId })
      .returning();

    return { success: true, cartId: cart.id };
  } catch (error) {
    console.error("Error creating admin customer cart:", error);
    return { success: false, error: "Failed to create cart" };
  }
}

/**
 * Get admin customer cart with items and product details
 */
export async function getAdminCustomerCart(
  cartId: string
): Promise<AdminCartWithItems | null> {
  try {
    const cart = await db.query.adminCustomerCart.findFirst({
      where: eq(adminCustomerCart.id, cartId),
      with: {
        items: {
          with: {
            product: {
              with: {
                productImages: {
                  where: eq(productImage.position, "0"),
                  limit: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!cart) return null;

    return {
      id: cart.id,
      createdAt: cart.createdAt,
      items: cart.items.map((item) => ({
        id: item.id,
        cartId: item.cartId,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        addedAt: item.addedAt,
        product: {
          id: item.product.id,
          productName: item.product.productName,
          brand: item.product.brand,
          model: item.product.model,
          subCategory: item.product.subCategory,
          description: item.product.description,
          pricing: item.product.pricing,
          mainImage: (item.product as any).productImages?.[0]
            ? { url: (item.product as any).productImages[0].url }
            : undefined,
        },
      })),
    };
  } catch (error) {
    console.error("Error fetching admin customer cart:", error);
    return null;
  }
}

/**
 * Add item to admin customer cart
 */
export async function addItemToAdminCustomerCart(input: {
  cartId: string;
  productId: string;
  quantity: number;
}) {
  try {
    // Validate input
    const validated = addToCartSchema.parse(input);

    // Verify cart exists
    const cart = await db.query.adminCustomerCart.findFirst({
      where: eq(adminCustomerCart.id, validated.cartId),
    });

    if (!cart) {
      throw new CartNotFoundError(validated.cartId);
    }

    // Fetch product
    const prod = await db.query.product.findFirst({
      where: eq(product.id, validated.productId),
    });

    if (!prod) {
      throw new ProductNotFoundError(validated.productId);
    }

    // Extract product name (handle multilingual)
    const productNameStr = typeof prod.productName === 'object' && prod.productName !== null
      ? (prod.productName.en || prod.productName.pt || 'Product')
      : (prod.productName || 'Product');

    // Check stock
    if (!prod.pricing.inStock) {
      return { success: false, error: `${productNameStr} is out of stock` };
    }

    if (prod.pricing.stockQuantity < validated.quantity) {
      throw new InsufficientStockError(
        productNameStr,
        prod.pricing.stockQuantity,
        validated.quantity
      );
    }

    // Check if item already exists in cart
    const existingItem = await db.query.adminCustomerCartItem.findFirst({
      where: and(
        eq(adminCustomerCartItem.cartId, validated.cartId),
        eq(adminCustomerCartItem.productId, validated.productId)
      ),
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + validated.quantity;

      if (prod.pricing.stockQuantity < newQuantity) {
        throw new InsufficientStockError(
          productNameStr,
          prod.pricing.stockQuantity,
          newQuantity
        );
      }

      await db
        .update(adminCustomerCartItem)
        .set({ quantity: newQuantity })
        .where(eq(adminCustomerCartItem.id, existingItem.id));
    } else {
      // Insert new item
      await db.insert(adminCustomerCartItem).values({
        id: nanoid(),
        cartId: validated.cartId,
        productId: validated.productId,
        name: productNameStr, // Use extracted string name
        price: prod.pricing.price.toString(),
        quantity: validated.quantity,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error adding item to cart:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to add item to cart" };
  }
}

/**
 * Update cart item quantity
 */
export async function updateAdminCustomerCartItemQuantity(input: {
  cartItemId: string;
  quantity: number;
}) {
  try {
    const validated = updateQuantitySchema.parse(input);

    const item = await db.query.adminCustomerCartItem.findFirst({
      where: eq(adminCustomerCartItem.id, validated.cartItemId),
      with: {
        product: true,
      },
    });

    if (!item) {
      return { success: false, error: "Cart item not found" };
    }

    // Extract product name (handle multilingual)
    const productNameStr = typeof item.product.productName === 'object' && item.product.productName !== null
      ? (item.product.productName.en || item.product.productName.pt || 'Product')
      : (item.product.productName || 'Product');

    // Check stock
    if (item.product.pricing.stockQuantity < validated.quantity) {
      throw new InsufficientStockError(
        productNameStr,
        item.product.pricing.stockQuantity,
        validated.quantity
      );
    }

    await db
      .update(adminCustomerCartItem)
      .set({ quantity: validated.quantity })
      .where(eq(adminCustomerCartItem.id, validated.cartItemId));

    return { success: true };
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update quantity" };
  }
}

/**
 * Remove item from cart
 */
export async function removeAdminCustomerCartItem(cartItemId: string) {
  try {
    await db
      .delete(adminCustomerCartItem)
      .where(eq(adminCustomerCartItem.id, cartItemId));

    return { success: true };
  } catch (error) {
    console.error("Error removing cart item:", error);
    return { success: false, error: "Failed to remove item" };
  }
}

/**
 * Clear all items from cart
 */
export async function clearAdminCustomerCart(cartId: string) {
  try {
    await db
      .delete(adminCustomerCartItem)
      .where(eq(adminCustomerCartItem.cartId, cartId));

    return { success: true };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { success: false, error: "Failed to clear cart" };
  }
}
