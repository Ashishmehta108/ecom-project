  import { getEarbuds } from "@/lib/actions/product-actions";
  import TopEarbudsSectionClient from "./TopEarbudsSectionClient";

  export default async function TopEarbudsSectionServer() {
    const earbuds = await getEarbuds();

    // Pass multilingual product names - client will resolve based on current language
    const formatted = earbuds.map((item: any) => ({
      id: item.id,
      name: item.productName, // This is now a multilingual object {en: string, pt: string}
      price: Number(item.pricing?.price) || 0,
      oldPrice: Number(item.pricing?.price) || 0,
      discount: Number(item.pricing?.discount) || 0,
      image: item.productImages?.[0]?.url || "/placeholder.png",
      productImages: item.productImages || [],
    }));

    return <TopEarbudsSectionClient earbuds={formatted} />;
  }
