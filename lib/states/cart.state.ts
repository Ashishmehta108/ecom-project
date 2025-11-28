// // lib/states/cart.state.ts
// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// export type CartItem = {
//   id: string;
//   productId: string;
//   name: string;
//   price: number | string;
//   quantity: number;
//   imageUrl?: string | null;
//   stockQuantity?: number;
//   inStock?: boolean;
// };

// interface CartState {
//   items: CartItem[];
//   setItems: (items: CartItem[]) => void;
//   addOrUpdate: (item: CartItem) => void;
//   remove: (productId: string) => void;
//   clear: () => void;
//   updateQty: (productId: string, qty: number) => void;
// }

// const userCartState = create<CartState>()(
//   persist(
//     (set) => ({
//       items: [],

//       setItems: (items) => set({ items }),

//       addOrUpdate: (item) =>
//         set((state) => {
//           const exists = state.items.some(
//             (i) => i.productId === item.productId
//           );

//           if (exists) {
//             return {
//               items: state.items.map((i) =>
//                 i.productId === item.productId ? item : i
//               ),
//             };
//           }

//           return { items: [...state.items, item] };
//         }),

//       remove: (productId) =>
//         set((state) => ({
//           items: state.items.filter((i) => i.productId !== productId),
//         })),

//       updateQty: (productId, qty) =>
//         set((state) => ({
//           items: state.items.map((i) =>
//             i.productId === productId ? { ...i, quantity: qty } : i
//           ),
//         })),

//       clear: () => set({ items: [] }),
//     }),
//     { name: "cart-storage" }
//   )
// );

// export default userCartState;


// lib/states/cart.state.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number | string;
  quantity: number;
  imageUrl?: string | null;
  stockQuantity?: number;
  inStock?: boolean;
};

interface CartState {
  items: CartItem[];
  setItems: (items: CartItem[]) => void;
  addOrUpdate: (item: CartItem) => void;
  remove: (productId: string) => void;
  clear: () => void;
  updateQty: (productId: string, qty: number) => void;
}

const userCartState = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      setItems: (items) => set({ items }),

      addOrUpdate: (item) =>
        set((state) => {
          const exists = state.items.some(
            (i) => i.productId === item.productId
          );

          if (exists) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId ? item : i
              ),
            };
          }

          return { items: [...state.items, item] };
        }),

      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      updateQty: (productId, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity: qty } : i
          ),
        })),

      clear: () => set({ items: [] }),
    }),
    { name: "cart-storage" }
  )
);

export default userCartState;