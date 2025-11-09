import { create } from "zustand";
import { ProductInCart } from "@/lib/types/cart.types";

const userCartState = create<{
  items: ProductInCart[];
  addItem: (item: ProductInCart) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}>((set) => ({
  items: [],
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
}));

export default userCartState;
