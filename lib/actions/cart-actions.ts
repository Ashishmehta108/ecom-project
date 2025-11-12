import { eq } from "drizzle-orm";
import { db } from "../db";
import { cartItem } from "../db/schema";

const addItemToCart = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  const [item] = await db
    .select()
    .from(cartItem)
    .where({ userId, productId })
    .limit(1);
  if (item) {
    item.quantity += quantity;
    await db
      .update(cartItem)
      .set({ quantity: item.quantity })
      .where(eq(cartItem.id, item.id));
  } else {
    await db.insert(cartItem).values({ userId, productId, quantity }).execute();
  }
};
