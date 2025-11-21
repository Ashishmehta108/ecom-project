"use client";

import { useState } from "react";
import userCartState from "@/lib/states/cart.state";
import { addItemToCart, updateItemQuantity } from "@/lib/actions/cart-actions";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Plus, Minus } from "lucide-react";

export default function AddToCartButton({ productId }: { productId: string }) {
  const { data } = authClient.useSession();
  const userId = data?.user?.id;

  const { items, addOrReplaceItem, updateQty, removeItem } = userCartState();

  const cartItem = items.find((i) => i.productId === productId);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!userId) return toast.error("Please login to continue");
    try {
      setLoading(true);
      const res = await addItemToCart(userId, productId, 1);

      if (res?.success) {
        addOrReplaceItem(res.data);
        toast.success("Added to cart");
      } else {
        //@ts-ignore
        toast.error(res.error?.message || "Failed to add");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQtyChange = async (newQty: number) => {
    if (!cartItem || !userId) return;

    if (newQty <= 0) {
      removeItem(cartItem.id);
      return;
    }

    setLoading(true);
    try {
      const res = await updateItemQuantity(cartItem.id, newQty);

      if (res?.success) {
        updateQty(cartItem.id, newQty);
      } else {
        toast.error("Failed to update");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!cartItem) {
    return (
      <button
        disabled={loading}
        onClick={handleAdd}
        className="w-full py-3 text-sm font-semibold rounded-xl 
                 bg-neutral-900 dark:bg-neutral-100 
                 text-white dark:text-neutral-900 
                 shadow-sm hover:opacity-90 transition-all"
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>
    );
  }

  return (
    <div
      className="flex items-center gap-3 w-full md:w-max 
                    border border-neutral-300 dark:border-neutral-700 
                    rounded-xl p-2 bg-neutral-100 dark:bg-neutral-900 
                    transition-all"
    >
      <button
        disabled={loading}
        onClick={() => handleQtyChange(cartItem.quantity - 1)}
        className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition"
      >
        <Minus className="w-4 h-4" />
      </button>

      <span className="w-10 text-center font-medium text-neutral-800 dark:text-neutral-200">
        {cartItem.quantity}
      </span>

      <button
        disabled={loading}
        onClick={() => handleQtyChange(cartItem.quantity + 1)}
        className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
