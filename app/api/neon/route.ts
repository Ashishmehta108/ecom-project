import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // your prisma or drizzle client

export async function GET() {
  try {
    await db.execute("SELECT 1");
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false });
  }
}
