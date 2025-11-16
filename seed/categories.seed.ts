import fs from "fs";
import path from "path";
import ImageKit from "imagekit";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import { category } from "@/lib/db/schema";
import { client } from "@/lib/imagekit/imageUpload";

const CATEGORY_NAMES = [
  "Electronics",
  "Earphones",
  "Tablet",
  "Watch",
  "Speaker",
  "Phones",
  "Refurbished",
];

const BASE_FOLDER = path.join(process.cwd(), "/categoryimages");

async function uploadCategoryFolder(categoryName: string) {
  const file = path.join(BASE_FOLDER, `${categoryName}.jpeg`);
  console.log(` Uploading ${file} for ${categoryName}...`);

  const upload = await client.upload({
    file: fs.createReadStream(file),
    fileName: `${categoryName}_${Date.now()}${path.extname(categoryName)}`,
    folder: "/category-images",
    tags: ["category"],
  });

  console.log(` Uploaded ${categoryName}:`, upload.url);

  return upload.url;
}

export async function seedCategory() {
  console.log("🌱 Starting category upload + seed...");
  await db.delete(category);
  const finalCategories: any[] = [];

  for (const name of CATEGORY_NAMES) {
    const imageUrl = await uploadCategoryFolder(name);
    console.log(`📝 Preparing category: ${name} with image URL: ${imageUrl}`);
    finalCategories.push({
      id: nanoid(),
      name,
      imageUrl: imageUrl ,
    });
  }

  console.log("📝 Final Prepared Categories:", finalCategories);

  await db.insert(category).values(finalCategories);

  console.log("🎉 Categories seeded successfully!");
  return finalCategories;
}
