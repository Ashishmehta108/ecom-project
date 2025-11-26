import {
  deleteCategory,
  updateCategory,
  getCategoryById,
} from "@/lib/actions/categories.actions";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await params;
  return NextResponse.json(await getCategoryById(id));
}

export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await params;
  const formData = await req.formData();
  const updated = await updateCategory(id, formData);

  return NextResponse.json(updated);
}

export async function DELETE(
  _: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await params;
  const deleted = await deleteCategory(id);

  return NextResponse.json(deleted);
}
