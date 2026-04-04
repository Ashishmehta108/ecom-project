// app/api/orders/route.ts  — GET all + POST create
import { NextRequest, NextResponse } from "next/server";
import {
  listAllCustomerOrders,
  createCustomerOrder,
  type CreateOrderInput,
} from "@/lib/actions/admin-actions/adminCustomerOrder";

export async function GET() {
  const result = await listAllCustomerOrders();
  if (!result.success)
    return NextResponse.json({ error: result.success }, { status: 500 });
  return NextResponse.json({ data: result.data });
}

export async function POST(req: NextRequest) {
  try {
    const body: CreateOrderInput = await req.json();

    if (!body.subtotal || !body.total) {
      return NextResponse.json(
        { error: "subtotal and total are required" },
        { status: 400 }
      );
    }

    const result = await createCustomerOrder(body);
    if (!result.success)
      return NextResponse.json({ error: result.success }, { status: 500 });

    return NextResponse.json({ data: result.data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

