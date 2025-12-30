import { NextResponse } from "next/server";
import { getEarbuds } from "@/lib/actions/product-actions";
import { getLanguageFromRequest } from "@/lib/utils/language";
import { getTranslatedText } from "@/lib/utils/language";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = getLanguageFromRequest(req.headers, searchParams);

    const earbuds = await getEarbuds(lang);

    // Format earbuds data - resolve multilingual fields
    const formatted = earbuds.map((item: any) => {
      const productName = typeof item.productName === 'string' 
        ? item.productName 
        : getTranslatedText(item.productName, lang);

      const price = Number(item.pricing?.price) || 0;
      const discount = Number(item.pricing?.discount) || 0;
      const discountedPrice = discount > 0 
        ? price - (price * discount) / 100 
        : price;

      return {
        id: item.id,
        name: productName,
        price: price,
        oldPrice: price,
        discountedPrice: discountedPrice,
        discount: discount,
        productImages: item.productImages || [],
        image: item.productImages?.[0]?.url || "/placeholder.png",
      };
    });

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("Error fetching earbuds:", error);
    return NextResponse.json(
      { error: "Failed to fetch earbuds" },
      { status: 500 }
    );
  }
}

