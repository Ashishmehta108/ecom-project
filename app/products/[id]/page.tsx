import { getProductByIdRaw, getVariantsByGroupId } from "@/lib/actions/product-actions";
import ProductPage from "./test";
import type { Product } from "@/lib/types/product.types";

export default async function Product({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  
  // Fetch raw multilingual data (not resolved)
  const p = await getProductByIdRaw(id);
  if (!p) return <div>Product not found</div>;

  // Fetch sibling variants if this product is part of a variant group
  const variantGroupId = (p as any).variantGroupId;
  const variants = variantGroupId
    ? await getVariantsByGroupId(variantGroupId, id)
    : [];

  return <ProductPage product={p as Product} variants={variants} />;
}
