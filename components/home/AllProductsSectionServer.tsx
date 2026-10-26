import { getProducts } from "@/lib/actions/product-actions";
import AllProductsSectionClient from "./AllProductsSectionClient";

const HOME_PRODUCT_LIMIT = 24;

export default async function AllProductsSectionServer() {
  const products = await getProducts();

  const formatted = products.slice(0, HOME_PRODUCT_LIMIT).map((item: any) => ({
    id: item.id,
    name: item.productName,
    price: Number(item.pricing?.price) || 0,
    discount: Number(item.pricing?.discount) || 0,
    image: item.productImages?.[0]?.url || "/placeholder.png",
    productImages: item.productImages || [],
  }));

  return <AllProductsSectionClient products={formatted} />;
}
