import { db } from "../db";

export async function getAllCategories() {
  const category = await db.query.category.findMany();
  return category;
}
