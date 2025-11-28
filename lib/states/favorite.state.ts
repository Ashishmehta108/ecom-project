import { create } from "zustand";
import { toast } from "sonner";
import {
  toggleFavouriteAction,
  getFavouriteProducts,
} from "../actions/favourite-actions";

export type ProductInFavourite = {
  productId: string;
  name: string;
  image: string;
  price: number;
};

type FavouriteState = {
  items: ProductInFavourite[];
  loading: boolean;

  fetchFavourites: () => Promise<void>;
  toggleFavourite: (item: ProductInFavourite) => void;
};

export const useFavouriteState = create<FavouriteState>((set, get) => ({
  items: [],
  loading: false,

  fetchFavourites: async () => {
    set({ loading: true });

    try {
      const res = await fetch("/api/favorites", { cache: "no-store" });
      const data = await res.json();

      console.log("FAVS:", data);

      set({ items: data || [] });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load favorites");
    } finally {
      set({ loading: false });
    }
  },

  toggleFavourite: async (item) => {
    const exists = get().items.some((i) => i.productId === item.productId);

    if (exists) {
      set((state) => ({
        items: state.items.filter((x) => x.productId !== item.productId),
      }));
      toast("Removed from favorites");
    } else {
      set((state) => ({ items: [...state.items, item] }));
      toast.success("Added to favorites ❤️");
    }

    const res = await toggleFavouriteAction(item.productId, item.image);

    if (!res.success) {
      toast.error("Something went wrong");
    }
  },
}));
