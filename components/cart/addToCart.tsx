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

  const { items } = userCartState();
  const cartItem = items.find((i) => i.productId === productId);

  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleAdd = async () => {
    if (!userId) return setShowLogin(true);

    setLoading(true);
    const res = await addItemToCart(userId, productId, 1);

    await syncCart(userId);
    setLoading(false);

    if (res.success) toast.success("Added to Cart");
  };

  const handleQty = async (newQty: number) => {
    if (!userId) return setShowLogin(true);
    if (!cartItem) return;

    setLoading(true);

    if (newQty <= 0) {
      await removeItemFromCart(cartItem.id);
      await syncCart(userId);
      setLoading(false);
      return;
    }

    await updateItemQuantity(cartItem.id, newQty);
    await syncCart(userId);

    setLoading(false);
  };

  return (
    <>
      <LoginModal open={showLogin} onOpenChange={setShowLogin} />

      {/* If item not in cart */}
      {!cartItem ? (
        <button
          disabled={loading}
          onClick={handleAdd}
          className="w-fit px-4 py-2 text-sm bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-60"
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      ) : (
        <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-full w-fit">
          <button
            disabled={loading}
            onClick={() => handleQty(cartItem.quantity - 1)}
            className="p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition disabled:opacity-50"
          >
            <Minus size={14} />
          </button>

          <span className="font-medium text-sm">{cartItem.quantity}</span>

          <button
            disabled={loading}
            onClick={() => handleQty(cartItem.quantity + 1)}
            className="p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition disabled:opacity-50"
          >
            <Plus size={14} />
          </button>
        </div>
      )}
    </>
  );
}
