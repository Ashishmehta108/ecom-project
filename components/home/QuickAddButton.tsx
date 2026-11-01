"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import userCartState from "@/lib/states/cart.state";
import { addItemToCart } from "@/lib/actions/cart-actions";
import { syncCart } from "@/lib/syncCart";
import LoginModal from "../auth/loginModal";

export default function QuickAddButton({
  productId,
  outOfStock,
  pt,
}: {
  productId: string;
  outOfStock?: boolean;
  pt: boolean;
}) {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const inCart = userCartState((s) =>
    s.items.some((i) => i.productId === productId)
  );

  const [showLogin, setShowLogin] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!userId) {
      setShowLogin(true);
      return;
    }
    setAdding(true);
    try {
      const res = await addItemToCart(userId, productId, 1);
      await syncCart(userId);
      if (res.success) {
        toast.success(pt ? "Produto adicionado ao carrinho" : "Added to cart");
      }
    } catch {
      toast.error(pt ? "Erro ao adicionar ao carrinho" : "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (inCart) {
    return (
      <Link
        href="/cart"
        className="inline-flex shrink-0 items-center gap-1 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-2 py-1.5 text-[11px] md:text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition"
      >
        <Check className="w-3 h-3" />
        {pt ? "No Carrinho" : "In Cart"}
      </Link>
    );
  }

  return (
    <>
      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
      <button
        type="button"
        aria-label={pt ? "Adicionar ao carrinho" : "Add to cart"}
        disabled={outOfStock || adding}
        onClick={handleAdd}
        className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-md bg-neutral-900 px-2.5 py-1.5 text-[11px] md:text-xs font-medium text-white transition hover:bg-neutral-800 active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500"
      >
        {!outOfStock && !adding && <ShoppingCart className="w-3 h-3" />}
        {outOfStock
          ? pt
            ? "Indisponível"
            : "Sold out"
          : adding
            ? "..."
            : pt
              ? "Adicionar"
              : "Add"}
      </button>
    </>
  );
}
