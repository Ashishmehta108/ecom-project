import { db } from "@/lib/db";
import { category } from "@/lib/db/schema";
import { seedCategory } from "@/seed/categories.seed";
import { NextResponse } from "next/server";
                        
export async function POST(req: Request) {
  try {
    await db.delete(category);                                                
    const c = await seedCategory();
    return NextResponse.json(                                           
      {
        data: c,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error seeding categories:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const categories = await db.query.category.findMany();
    return NextResponse.json({
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({
      data: error,
    });
  }
}
