import { db } from "../db";
import { category } from "../db/schema";
import { eq } from "drizzle-orm";
import {client as imagekit} from "@/lib/imagekit/imageUpload"
import { v4 as uuid } from "uuid";


// ------------------------------
// Get all categories
// ------------------------------
export async function getAllCategories() {
  return await db.select().from(category);
}

// ------------------------------
// Create a category + upload image
// ------------------------------
export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const imageFile = formData.get("image") as File;

  if (!name) throw new Error("Name is required");
  if (!imageFile) throw new Error("Image is required");

  // Upload to ImageKit
  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const upload = await imagekit.upload({
    file: buffer,
    fileName: `${uuid()}-${imageFile.name}`,
  });

  const id = uuid();

  const newCategory = await db
    .insert(category)
    .values({
      id,
      name,
      imageUrl: upload.url,
    })
    .returning();

  return newCategory[0];
}

// ------------------------------
// Update category
// (Optional: Upload new image)
// ------------------------------
export async function updateCategory(id: string, formData: FormData) {
  const name = formData.get("name") as string | null;
  const imageFile = formData.get("image") as File | null;

  let imageUrl: string | undefined = undefined;

  // If new image uploaded → upload to ImageKit
  if (imageFile && imageFile.size > 0) {
    const buffer = Buffer.from(await imageFile.arrayBuffer());

    const upload = await imagekit.upload({
      file: buffer,
      fileName: `${uuid()}-${imageFile.name}`,
    });

    imageUrl = upload.url;
  }

  // Prepare update object
  const updateData: any = {};
  if (name) updateData.name = name;
  if (imageUrl) updateData.imageUrl = imageUrl;

  const updatedCategory = await db
    .update(category)
    .set(updateData)
    .where(eq(category.id, id))
    .returning();

  return updatedCategory[0];
}

// ------------------------------
// Delete a category
// ------------------------------
export async function deleteCategory(id: string) {
  const deleted = await db
    .delete(category)
    .where(eq(category.id, id))
    .returning();

  return deleted[0];
}

// ------------------------------
// Get category by ID
// ------------------------------
export async function getCategoryById(id: string) {
  const data = await db
    .select()
    .from(category)
    .where(eq(category.id, id));

  return data[0];
}
