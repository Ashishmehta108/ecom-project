import { listUsers } from "@/lib/actions/admin-actions/actions";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const users = await listUsers();
    return NextResponse.json({ data: users }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { statusText: error?.status, status: error.statusCode }
    );
  }
}
