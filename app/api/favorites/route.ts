import { getFavouriteProducts, setFavouriteItemsAction } from "@/lib/actions/favourite-actions";

export async function GET() {
  const data = await getFavouriteProducts();
  return Response.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const data = await setFavouriteItemsAction(body.items || []);
  return Response.json(data);
}
