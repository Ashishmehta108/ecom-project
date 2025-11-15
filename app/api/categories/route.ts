import { seedCategory } from "@/seed/categories.seed";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const c = await seedCategory();
    return  NextResponse.json({
        data:c
    }, { status: 201 });
  } catch (error) {
    console.error("Error seeding categories:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
