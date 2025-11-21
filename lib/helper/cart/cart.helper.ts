import userCartState from "@/lib/states/cart.state";

export const isInCart = (productId: string) => {
  const { items } = userCartState();
  const [inCart] = items.filter((item) => item.productId == productId);
  if (inCart) {
    return true;
  }
  return false;
};
