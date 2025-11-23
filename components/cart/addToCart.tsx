// "use client";

// import { useState } from "react";
// import userCartState from "@/lib/states/cart.state";
// import { addItemToCart, updateItemQuantity } from "@/lib/actions/cart-actions";
// import { toast } from "sonner";
// import { authClient } from "@/lib/auth-client";
// import { Plus, Minus } from "lucide-react";

// export default function AddToCartButton({ productId }: { productId: string }) {
//   const { data } = authClient.useSession();
//   const userId = data?.user?.id;

//   const { items, addOrReplaceItem, updateQty, removeItem } = userCartState();
//   const cartItem = items.find((i) => i.productId === productId);

//   const [loading, setLoading] = useState(false);

//   const handleAdd = async () => {
//     if (!userId) return toast.error("Please login to continue");
//     try {
//       setLoading(true);
//       const res = await addItemToCart(userId, productId, 1);

//       if (res?.success) {
//         addOrReplaceItem(res.data);
//         toast.success("Added to cart");
//       } else {
//         //@ts-ignore
//         toast.error(res.error?.message || "Failed to add");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleQtyChange = async (newQty: number) => {
//     if (!cartItem || !userId) return;

//     // removing
//     if (newQty <= 0) {
//       removeItem(cartItem.id);
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await updateItemQuantity(cartItem.id, newQty);

//       if (res?.success) {
//         updateQty(cartItem.id, newQty);
//       } else {
//         toast.error("Failed to update");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -------------------------- UI BELOW -----------------------------

//   // Not in cart → show compact modern Add button
//   if (!cartItem) {
//     return (
//       <button
//         disabled={loading}
//         onClick={handleAdd}
//         className="
//           w-full max-w-xs
//           py-2.5 px-4
//           text-sm font-semibold
//           rounded-xl
//           bg-neutral-900 dark:bg-neutral-100
//           text-white dark:text-neutral-900
//           shadow-sm
//           hover:opacity-90
//           active:scale-[0.98]
//           disabled:opacity-50
//           transition-all
//         "
//       >
//         {loading ? "Adding..." : "Add to Cart"}
//       </button>
//     );
//   }

//   // In cart → show modern small quantity pill controller
//   return (
//     <div
//       className="
//         flex items-center gap-3
//         w-fit
//         rounded-full
//         bg-neutral-100 dark:bg-neutral-900
//         border border-neutral-300 dark:border-neutral-700
//         px-3 py-1.5
//         shadow-sm
//         transition-all
//       "
//     >
//       {/* Minus */}
//       <button
//         disabled={loading}
//         onClick={() => handleQtyChange(cartItem.quantity - 1)}
//         className="
//           p-1.5
//           rounded-full
//           hover:bg-neutral-200 dark:hover:bg-neutral-800
//           transition
//           active:scale-90
//         "
//       >
//         <Minus className="w-4 h-4" />
//       </button>

//       {/* Qty */}
//       <span className="w-6 text-center font-semibold text-neutral-900 dark:text-neutral-100">
//         {cartItem.quantity}
//       </span>

//       {/* Plus */}
//       <button
//         disabled={loading}
//         onClick={() => handleQtyChange(cartItem.quantity + 1)}
//         className="
//           p-1.5
//           rounded-full
//           hover:bg-neutral-200 dark:hover:bg-neutral-800
//           transition
//           active:scale-90
//         "
//       >
//         <Plus className="w-4 h-4" />
//       </button>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import userCartState from "@/lib/states/cart.state";
import { addItemToCart, updateItemQuantity } from "@/lib/actions/cart-actions";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Plus, Minus } from "lucide-react";
import LoginModal from "../auth/loginModal";

export default function AddToCartButton({ productId }: { productId: string }) {
  const { data } = authClient.useSession();
  const userId = data?.user?.id;

  const { items, addOrReplaceItem, updateQty, removeItem } = userCartState();
  const cartItem = items.find((i) => i.productId === productId);

  const [loading, setLoading] = useState(false);

  const [showLogin, setShowLogin] = useState(false);

  const handleAdd = async () => {
    if (!userId) {
      setShowLogin(true);
      return;
    }

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
    if (!cartItem || !userId) {
      setShowLogin(true);
      return;
    }

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

  return (
    <>
      <LoginModal open={showLogin} onOpenChange={setShowLogin} />

      {!cartItem ? (
        <button
          disabled={loading}
          onClick={handleAdd}
          className="w-full max-w-xs py-2.5 px-4 text-sm font-semibold rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-sm hover:opacity-90 active:scale-[0.98] disabled:opacity-50 transition-all"
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      ) : (
        <div className="flex items-center gap-3 w-fit rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 shadow-sm transition-all">
          <button
            disabled={loading}
            onClick={() => handleQtyChange(cartItem.quantity - 1)}
            className="p-1.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition active:scale-90"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="w-6 text-center font-semibold text-neutral-900 dark:text-neutral-100">
            {cartItem.quantity}
          </span>

          <button
            disabled={loading}
            onClick={() => handleQtyChange(cartItem.quantity + 1)}
            className="p-1.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition active:scale-90"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}
