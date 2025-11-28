import { db } from "@/lib/db";
import { favorites, favoriteItem, product } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import FavoritesClient from "@/components/favourites/favoriteClient";
import { getUserSession } from "@/server";

export default async function FavoritesPage() {
  const session = await getUserSession();

  if (!session) return <div>Please log in</div>;

  const fav = await db.query.favorites.findFirst({
    where: eq(favorites.userId, session.user.id),
    with: {
      items: {
        with: {
          product: true,
        },
      },
    },
  });
  console.log(fav);
  const products =
    //@ts-ignore
    fav?.items.map((i) => ({
      productId: i.productId,
      name: i.product.productName,
      price: i.product.pricing.price,
      image: i.imageUrl,
    })) ?? [];

  console.log(products);
  return <FavoritesClient initialItems={products} />;
}
