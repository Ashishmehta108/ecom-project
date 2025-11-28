  import { getEarbuds } from "@/lib/actions/product-actions";
  import TopEarbudsSectionClient from "./TopEarbudsSectionClient";

  export default async function TopEarbudsSectionServer() {
    const earbuds = await getEarbuds();

    console.log(earbuds)
    const formatted = earbuds.map((item) => ({
      id: item.id,
      name: item.productName,
      price: item.pricing.price,
      oldPrice: item.pricing.price,
      discount: item.pricing.discount,
      //@ts-ignore
      image: item.productImages?.[0]?.url || "/placeholder.png",
    }));

    return <TopEarbudsSectionClient earbuds={formatted} />;
  }
