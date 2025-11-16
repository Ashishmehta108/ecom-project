import { db } from "@/lib/db";
import { product } from "@/lib/db/schema";
import { seedProds } from "@/scripts/products.seed";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
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
    // const data = await seedProds();
    const data = await db.query.product.findMany({
      with: {
        productCategories: {
          with: {
            category: true,
          },

        },
        productImages: true
      },
    });
    // const data=await db.delete(product)
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
