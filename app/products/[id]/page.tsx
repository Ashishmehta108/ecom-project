import { getProductById } from "@/lib/actions/product-actions";
import ProductPage from "./test";
import type { Product } from "@/lib/types/product.types";

export default async function Product({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  //@ts-ignore
  const p: Product = await getProductById(id); 
  return <ProductPage product={p} />;
}
