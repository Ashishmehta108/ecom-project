"use server";

import {
  addItemToCustomerCart,
  updateCartItemQuantity,
  removeCartItem,
  getCustomerCart,
} from "@/lib/queries/admin-cart";
import { revalidatePath } from "next/cache";

// 1. Add product to customer cart
export async function addToCustomerCartAction(
  customerId: string,
  productId: string
) {
  await addItemToCustomerCart(customerId, productId, 1);
  revalidatePath(`/admin/customers/${customerId}/order`);
}

// 2. Update quantity
export async function updateCartItemQtyAction(
  customerId: string,
  itemId: string,
  quantity: number
) {
  await updateCartItemQuantity(itemId, quantity);
  revalidatePath(`/admin/customers/${customerId}/order`);
}

// 3. Remove item
export async function removeCartItemAction(customerId: string, itemId: string) {
  await removeCartItem(itemId);
  revalidatePath(`/admin/customers/${customerId}/order`);
}

// 4. Checkout for customer (USING STRIPE)
export async function checkoutForCustomerAction(customerId: string) {
  const cartData = await getCustomerCart(customerId);

  if (!cartData || cartData.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

 const res = await fetch(
    `http://localhost:3000/api/stripe/admin/checkout`,
    {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customerId }),
    }
  );

  if (!res.ok) {
    console.log(await res.text());
    throw new Error("Checkout failed");
  }

  const data = await res.json();

  return data.url;
}
