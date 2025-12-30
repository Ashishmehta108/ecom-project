import { db } from "@/lib/db";
import { product } from "@/lib/db/schema";
import { seedProds } from "@/scripts/products.seed";
import { NextResponse } from "next/server";
import { getLanguageFromRequest, resolveProductForLanguage } from "@/lib/utils/language";

export async function POST(req: Request) {
  try {
    await db.delete(product);
    const data = await seedProds();
    return NextResponse.json(
      {
        data: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({
      data: error,
    });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lang = getLanguageFromRequest(req.headers, searchParams);

    const data = await db.query.product.findMany({
      with: {
        productCategories: {
          with: {
            category: true,
          },
        },
        productImages: true,
      },
    });

    // Resolve multilingual fields based on language
    const resolvedData = data.map((p) => resolveProductForLanguage(p, lang));

    return NextResponse.json(
      {
        data: resolvedData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({
      error: "Failed to fetch products",
    }, { status: 500 });
  }
}
