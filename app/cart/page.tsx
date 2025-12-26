import CartPageClient from "@/components/cart/cartClient";
import { getCart } from "@/lib/actions/cart-actions";
import { CartItem } from "@/lib/types/cart.types";
import { getUserSession } from "@/server";

export default async function CartPage() {
  const session = await getUserSession();

  let items: CartItem[] = [];
  if (session?.user.id) {
    const res = await getCart(session.user.id);
    if (res?.success) {
      items = res.data.items ?? [];
    }
  }
  return <CartPageClient userId={session?.user?.id} initialItems={items} />;
}
