import { create } from "zustand";
import { toast } from "sonner";

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
  toggleFavourite: (item: ProductInFavourite) => Promise<void>;
  setFavouriteItems: (items: ProductInFavourite[]) => void; // ✅ ADD THIS
};

export const useFavouriteState = create<FavouriteState>((set, get) => ({
  items: [],
  loading: false,

  // 🟢 allow direct overrides from UI or API re-sync
  setFavouriteItems: (items) => set({ items }), // ✅ IMPLEMENTATION HERE

  fetchFavourites: async () => {
    set({ loading: true });

    try {
      const res = await fetch("/api/favorites", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed req");

      const data = await res.json();

      set({ items: data || [] });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load favorites");
    } finally {
      set({ loading: false });
    }
  },

  toggleFavourite: async (item) => {
    const prev = get().items;
    const exists = prev.some((i) => i.productId === item.productId);

    // Optimistic
    let updated;
    if (exists) {
      updated = prev.filter((i) => i.productId !== item.productId);
      toast("Removed from favourites");
    } else {
      updated = [...prev, item];
      toast.success("Added to favourites ❤️");
    }

    set({ items: updated });

    const res = await fetch("/api/favorites", {
      method: "POST",
      body: JSON.stringify({
        productId: item.productId,
        image: item.image,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      toast.error("Something went wrong");
      set({ items: prev }); // rollback
      return;
    }

    if (result.removed) {
      set({ items: prev.filter((i) => i.productId !== item.productId) });
    }
  },
}));
