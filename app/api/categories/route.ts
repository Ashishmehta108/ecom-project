import { createCategory, getAllCategories } from "@/lib/actions/categories.actions";
import { db } from "@/lib/db";
import { category } from "@/lib/db/schema";
import { seedCategory } from "@/seed/categories.seed";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";


export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json({
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch categories",
      },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const newCategory = await createCategory(formData);
    return NextResponse.json(
      {
        data: newCategory,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    const message = error instanceof Error ? error.message : "Failed to create category";
    return NextResponse.json(
      {
        error: message,
      },
      { status: 400 }
    );
  }
}
