"use server";

import { db } from "@/lib/db";
import { favoriteItem, favorites } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getUserSession } from "@/server";

async function getOrCreateFavoriteList(userId: string) {
  const fav = await db.query.favorites.findFirst({
    where: eq(favorites.userId, userId),
  });

  if (fav) return fav.id;

  const newFavId = nanoid();
  await db.insert(favorites).values({
    id: newFavId,
    userId,
  });

  return newFavId;
}

export async function toggleFavouriteAction(productId: string, image: string) {
  const session = await getUserSession()

  if (!session) return { success: false, message: "Not authenticated" };

  const userId = session.user.id;

  const favId = await getOrCreateFavoriteList(userId);

  const existing = await db.query.favoriteItem.findFirst({
    where: and(
      eq(favoriteItem.favoritesId, favId),
      eq(favoriteItem.productId, productId)
    ),
  });

  if (existing) {
    await db.delete(favoriteItem).where(eq(favoriteItem.id, existing.id));
    return { success: true, removed: true };
  }

  await db.insert(favoriteItem).values({
    id: nanoid(),
    favoritesId: favId,
    productId,
    imageUrl:image,
  });

  return { success: true, removed: false };
}
