import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string; // cartItem.id from DB
  productId: string;
  name: string;
  price: number | string;
  quantity: number;
  imageUrl?: string | null;
};

interface CartState {
  items: CartItem[];

  setItems: (items: CartItem[]) => void;
  addOrReplaceItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;

  clear: () => void;

  updateQty: (cartItemId: string, newQty: number) => void;
}

const userCartState = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      setItems: (items) => set({ items }),

      addOrReplaceItem: (item) =>
        set((state) => {
          const exists = state.items.some((i) => i.id === item.id);

          if (exists) {
            return {
              items: state.items.map((i) => (i.id === item.id ? item : i)),
            };
          }

          return { items: [...state.items, item] };
        }),

      removeItem: (cartItemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== cartItemId),
        })),

      clear: () => set({ items: [] }),

      updateQty: (cartItemId, newQty) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === cartItemId ? { ...item, quantity: newQty } : item
          ),
        })),
    }),
    {
      name: "cart-storage", // localStorage key
      version: 1,
    }
  )
);

export default userCartState;
