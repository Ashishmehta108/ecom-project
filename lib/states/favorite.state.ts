"use client";

import { create } from "zustand";
import { toast } from "sonner";
import { getFavouriteProducts, toggleFavouriteAction } from "@/lib/actions/favourite-actions";

export type ProductInFavourite = {
  productId: string;
  name: string;
  image: string;
  price: number;
};

type FavouriteState = {
  items: ProductInFavourite[];
  loading: boolean;

  setFavouriteItems: (items: ProductInFavourite[]) => void;
  fetchFavourites: () => Promise<void>;
  toggleFavourite: (item: ProductInFavourite) => void;
};

export const useFavouriteState = create<FavouriteState>((set, get) => ({
  items: [],
  loading: false,

  // ⭐ Add back direct setter (needed on Favorites page)
  setFavouriteItems: (items) => set({ items }),

  fetchFavourites: async () => {
    set({ loading: true });
    try {
      const data = await getFavouriteProducts();
      set({ items: data || [] });
    } catch {
      toast.error("Failed to load favourites");
    } finally {
      set({ loading: false });
    }
  },

  toggleFavourite: async (item) => {
    const prevItems = get().items;
    const exists = prevItems.some((i) => i.productId === item.productId);

    // ⚡ Instant optimistic update
    const updatedItems = exists
      ? prevItems.filter((i) => i.productId !== item.productId)
      : [...prevItems, item];

    set({ items: updatedItems });

    toast(exists ? "Removed ❤️" : "Added ❤️");

    // 🔁 Server update in background
    const res = await toggleFavouriteAction(item.productId, item.image);

    if (!res.success) {
      set({ items: prevItems }); // rollback
      toast.error("Please login first");
    }
  },
}));
