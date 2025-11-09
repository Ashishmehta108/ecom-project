import { create } from "zustand";

export type ProductInFavourite = {
  productId: string;
  name: string;
  image: string;
  price: number;
};

type FavouriteState = {
  items: ProductInFavourite[];
  addFavourite: (item: ProductInFavourite) => void;
  removeFavourite: (productId: string) => void;
  toggleFavourite: (item: ProductInFavourite) => void;
  clearFavourites: () => void;
};

export const useFavouriteState = create<FavouriteState>((set) => ({
  items: [],

  addFavourite: (item) =>
    set((state) => {
      if (state.items.some((i) => i.productId === item.productId)) return state;
      return { items: [...state.items, item] };
    }),

  removeFavourite: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    })),

  toggleFavourite: (item) =>
    set((state) => {
      const exists = state.items.some((i) => i.productId === item.productId);
      if (exists) {
        return {
          items: state.items.filter((i) => i.productId !== item.productId),
        };
      } else {
        return { items: [...state.items, item] };
      }
    }),

  clearFavourites: () => set({ items: [] }),
}));
