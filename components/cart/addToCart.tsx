"use client";

import { useState } from "react";
import userCartState from "@/lib/states/cart.state";
import {
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
} from "@/lib/actions/cart-actions";
import { syncCart } from "@/lib/syncCart";
import { authClient } from "@/lib/auth-client";
import { Plus, Minus } from "lucide-react";
import LoginModal from "../auth/loginModal";
import { toast } from "sonner";

export default function AddToCartButton({ productId }: { productId: string }) {
  const { data } = authClient.useSession();
  const userId = data?.user?.id;

  const { items, addOrUpdate, remove, updateQty } = userCartState();
  const cartItem = items.find((i) => i.productId === productId);

  const [showLogin, setShowLogin] = useState(false);

  const handleAdd = async () => {
    if (!userId) return setShowLogin(true);

    // Optimistic: Add to cart immediately
    if (!cartItem) {
      addOrUpdate({
        id: `temp-${productId}`,
        productId,
        name: "Loading...",
        price: 0,
        quantity: 1,
      });
    }

    try {
      const res = await addItemToCart(userId, productId, 1);
      await syncCart(userId);
      if (res.success) toast.success("Added to Cart");
    } catch (error) {
      // Rollback: Remove the optimistically added item
      if (!cartItem) remove(productId);
      toast.error("Failed to add to cart");
    }
  };

  const handleQty = async (newQty: number) => {
    if (!userId) return setShowLogin(true);
    if (!cartItem) return;

    // Optimistic: Update quantity immediately
    if (newQty <= 0) {
      const previousQty = cartItem.quantity;
      remove(productId);

      try {
        await removeItemFromCart(cartItem.id);
        await syncCart(userId);
      } catch (error) {
        // Rollback: Restore the item
        addOrUpdate(cartItem);
        toast.error("Failed to remove from cart");
      }
      return;
    }

    // Optimistic update for quantity change
    updateQty(productId, newQty);

    try {
      await updateItemQuantity(cartItem.id, newQty);
      await syncCart(userId);
    } catch (error) {
      // Rollback to previous quantity
      updateQty(productId, cartItem.quantity);
      toast.error("Failed to update quantity");
    }
  };

  return (
    <>
      <LoginModal open={showLogin} onOpenChange={setShowLogin} />

      {/* If item not in cart */}
      {!cartItem ? (
        <button
          onClick={handleAdd}
          className="w-fit px-4 py-2 text-sm bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-60 cursor-pointer"
        >
          Add to Cart
        </button>
      ) : (
        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-full w-fit">
          <button
            onClick={() => handleQty(cartItem.quantity - 1)}
            className="p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition disabled:opacity-50 cursor-pointer"
          >
            <Minus size={14} />
          </button>

          <span className="font-medium text-sm">{cartItem.quantity}</span>

          <button
            onClick={() => handleQty(cartItem.quantity + 1)}
            className="p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition disabled:opacity-50 cursor-pointer"
          >
            <Plus size={14} />
          </button>
        </div>
      )}
    </>
  );
}
