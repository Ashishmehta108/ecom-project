import { create } from "zustand";
import { ProductInCart } from "@/lib/types/cart.types";

const userCartState = create<{
  items: ProductInCart[];
  setItems: (items: ProductInCart[]) => void;
  addItem: (item: ProductInCart) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  updateItemQuantity: (productId: string, type: "inc" | "dec") => void;
}>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  addItem: (item) =>
    set((state) => {
      const existingItemIndex = state.items.findIndex(
        (i) => i.productId === item.productId
      );
      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += item.quantity;
        return { items: updatedItems };
      }
      return { items: [...state.items, item] };
    }),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    })),
  clearCart: () => set({ items: [] }),
  updateItemQuantity: (productId, type) =>
    set((state) => {
      const updatedItems = state.items
        .map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity:
                  type === "inc"
                    ? item.quantity + 1
                    : item.quantity - 1 < 1
                    ? 0
                    : item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0);
      console.log("Updated Items:", updatedItems);
      return { items: updatedItems };
    }),
}));

export default userCartState;
