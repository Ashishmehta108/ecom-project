// import userCartState from "@/lib/states/cart.state";
// import { getCart } from "@/lib/actions/cart-actions";

// export async function syncCart(userId: string) {
//   const res = await getCart(userId);
//   if (res.success && res.data) {
//     userCartState.getState().setItems(res.data.items);
//   }
// }


// lib/syncCart.ts
import { getCart } from "@/lib/actions/cart-actions";
import userCartState from "@/lib/states/cart.state";

export async function syncCart(userId: string) {
  try {
    const response = await getCart(userId);
    
    if (response.success && response.data) {
      const { items, removedOutOfStock } = response.data;
      
      // Update Zustand state with cleaned items
      userCartState.getState().setItems(items);
      
      // Optionally notify user if items were removed
      if (removedOutOfStock && removedOutOfStock > 0) {
        console.warn(`${removedOutOfStock} out-of-stock item(s) removed from cart`);
        // You could show a toast notification here
      }
      
      return { success: true, items, removedOutOfStock };
    }
    
    return { success: false, items: [], removedOutOfStock: 0 };
  } catch (error) {
    console.error("Cart sync failed:", error);
    return { success: false, items: [], removedOutOfStock: 0 };
  }
}