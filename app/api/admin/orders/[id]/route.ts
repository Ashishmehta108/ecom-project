// app/api/orders/route.ts  — GET all + POST create
import { NextRequest, NextResponse } from "next/server";
import {
  getCustomerOrderById,
  updateCustomerOrder,
  deleteCustomerOrder,
} from "@/lib/actions/admin-actions/adminCustomerOrder";

type Ctx = { params: { id: string } };

export async function GET_ONE(_req: NextRequest, { params }: Ctx) {
  const result = await getCustomerOrderById(params.id);
  if (!result.success)
    return NextResponse.json({ error: result.success }, { status: 404 });
  return NextResponse.json({ data: result.data });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const body = await req.json();
    const result = await updateCustomerOrder({ id: params.id, ...body });
    if (!result.success)
      return NextResponse.json({ error: result.success }, { status: 400 });
    return NextResponse.json({ data: result.data });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const result = await deleteCustomerOrder(params.id);
  if (!result.success)
    return NextResponse.json({ error: result.success }, { status: 404 });
  return NextResponse.json({ data: result.data });
}