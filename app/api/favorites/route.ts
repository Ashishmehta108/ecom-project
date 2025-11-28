import { getFavouriteProducts } from "@/lib/actions/favourite-actions";

export async function GET() {
  const data = await getFavouriteProducts();
  console.log(data)
  return Response.json(data);
}
