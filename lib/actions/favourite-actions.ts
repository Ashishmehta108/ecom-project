"use server";

import { db } from "@/lib/db";
import { favoriteItem, favorites } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getUserSession } from "@/server";

export async function getFavouriteProducts() {
  const session = await getUserSession();
  if (!session) return [];

  const fav = await db.query.favorites.findFirst({
    where: eq(favorites.userId, session.user.id),
    with: {
      items: {
        with: {
          product: {
            with: {
              productImages: true,
            },
          },
        },
      },
    },
  });

  if (!fav) return [];

  return fav.items.map(({ product, imageUrl }) => {
    const img =
      product.productImages?.find((img) => img.position === "0") ||
      product.productImages?.[0];

    return {
      productId: product.id,
      name: product.productName,
      price: product.pricing.price,
      image: img?.url || imageUrl || "/placeholder.png",
    };
  });
}

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
  const session = await getUserSession();
  if (!session) return { success: false, removed: false };

  const favId = await getOrCreateFavoriteList(session.user.id);

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
    imageUrl: image,
  });

  return { success: true, removed: false };
}

// 🆕 New: Sync full favourite list with DB
export async function setFavouriteItemsAction(items: any[]) {
  const session = await getUserSession();
  if (!session) return { success: false };

  const userId = session.user.id;
  const favId = await getOrCreateFavoriteList(userId);

  // Delete all current favourites
  await db.delete(favoriteItem).where(eq(favoriteItem.favoritesId, favId));

  if (items.length === 0) {
    return { success: true };
  }

  await db.insert(favoriteItem).values(
    items.map((item) => ({
      id: nanoid(),
      favoritesId: favId,
      productId: item.productId,
      imageUrl: item.image,
    }))
  );

  return { success: true };
}
