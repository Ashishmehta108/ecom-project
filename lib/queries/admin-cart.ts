// src/lib/queries/admin-cart.ts
import { db } from "@/lib/db";
import {
  product,
  productImage,
  cart,
  cartItem,
  orders,
  orderItem,
} from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";

// 1. Get all products with images (for admin product list)
export async function getProductsForAdmin() {
  const products = await db.query.product.findMany({
    with: {
      productImages: true,
    },
    orderBy: (p, { desc }) => [desc(p.createdAt)],
  });

  return products.map((p) => ({
    ...p,
    mainImage: p.productImages?.[0]?.url ?? null,
    price: p.pricing.price,
    currency: p.pricing.currency ?? "INR",
  }));
}

// 2. Get or create cart for a specific CUSTOMER (userId of customer)
export async function getOrCreateCartForCustomer(customerId: string) {
  const existing = await db.query.cart.findFirst({
    where: eq(cart.userId, customerId),
  });

  if (existing) return existing;

  const [created] = await db
    .insert(cart)
    .values({
      id: nanoid(),
      userId: customerId,
      currency: "INR",
    })
    .returning();

  return created;
}

// 3. Get cart with items + product info for given customer
export async function getCustomerCart(customerId: string) {
  const customerCart = await db.query.cart.findFirst({
    where: eq(cart.userId, customerId),
  });

  if (!customerCart) return null;

  const items = await db
    .select({
      id: cartItem.id,
      quantity: cartItem.quantity,
      price: cartItem.price,
      productId: cartItem.productId,
      name: cartItem.name,
      productName: product.productName,
      brand: product.brand,
      model: product.model,
      pricing: product.pricing,
    })
    .from(cartItem)
    .innerJoin(product, eq(cartItem.productId, product.id))
    .where(eq(cartItem.cartId, customerCart.id));

  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.price);
    return sum + price * item.quantity;
  }, 0);

  return {
    cart: customerCart,
    items,
    subtotal,
  };
}

// 4. Add product to customer's cart (used by admin)
export async function addItemToCustomerCart(
  customerId: string,
  productId: string,
  quantity: number = 1
) {
  const [prod] = await db
    .select()
    .from(product)
    .where(eq(product.id, productId))
    .limit(1);

  if (!prod) {
    throw new Error("Product not found");
  }

  const customerCart = await getOrCreateCartForCustomer(customerId);

  const [existing] = await db
    .select()
    .from(cartItem)
    .where(
      and(
        eq(cartItem.cartId, customerCart.id),
        eq(cartItem.productId, productId)
      )
    )
    .limit(1);

  const unitPrice = prod.pricing.price ?? 0;

  if (existing) {
    await db
      .update(cartItem)
      .set({ quantity: existing.quantity + quantity })
      .where(eq(cartItem.id, existing.id));
  } else {
    await db.insert(cartItem).values({
      id: nanoid(),
      cartId: customerCart.id,
      productId,
      name: prod.productName,
      price: `${unitPrice}`, // numeric column => string
      quantity,
    });
  }
}

// 5. Update quantity / remove item / clear cart

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  if (quantity <= 0) {
    await db.delete(cartItem).where(eq(cartItem.id, itemId));
  } else {
    await db.update(cartItem).set({ quantity }).where(eq(cartItem.id, itemId));
  }
}

export async function removeCartItem(itemId: string) {
  await db.delete(cartItem).where(eq(cartItem.id, itemId));
}

export async function clearCustomerCart(customerId: string) {
  const customerCart = await db.query.cart.findFirst({
    where: eq(cart.userId, customerId),
  });

  if (!customerCart) return;

  await db.delete(cartItem).where(eq(cartItem.cartId, customerCart.id));
}
