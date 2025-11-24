import userCartState from "@/lib/states/cart.state";
import { getCart } from "@/lib/actions/cart-actions";

export async function syncCart(userId: string) {
  const res = await getCart(userId);
  if (res.success && res.data) {
    userCartState.getState().setItems(res.data.items);
  }
}
