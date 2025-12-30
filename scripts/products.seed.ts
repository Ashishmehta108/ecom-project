// import fs from "fs/promises";
// import path from "path";
// import { nanoid } from "nanoid";
// import { db } from "@/lib/db";
// import {
//   product,
//   productImage,
//   productCategory,
//   category as categoryTable,
// } from "@/lib/db/schema";
// import { eq } from "drizzle-orm";
// import { uploadFolderToImageKit } from "@/lib/imagekit/imageUpload";

// type ProductInput = {
//   productName: string;
//   brand: string;
//   model: string;
//   categories: string[];
//   subCategory: string;
//   description: string;
//   features: string[];
//   pricing: any;
//   specifications: any;
//   tags: string[];
//   imagesFolder?: string;
// };

// async function seedCategories() {
//   const data = await db.query.category.findMany();
//   console.log("hi");
//   return data;
// }

// import chalk from "chalk"; // optional but recommended for colored logs

// async function insertProduct(p: ProductInput) {
//   console.log(chalk.blue(`\n🟦 [START] Inserting product: ${p.productName}`));

//   const productId = nanoid();

//   console.log("🆔 Generated Product ID:", productId);

//   // ================================
//   // 1. INSERT PRODUCT
//   // ================================
//   try {
//     await db.insert(product).values({
//       id: productId,
//       productName: p.productName,
//       brand: p.brand,
//       model: p.model,
//       subCategory: p.subCategory,
//       description: p.description,
//       features: p.features,
//       pricing: p.pricing,
//       specifications: p.specifications,
//       tags: p.tags,
//     });

//     console.log(chalk.green(`✔ Product inserted: ${p.productName}`));
//   } catch (err) {
//     console.error(chalk.red("❌ ERROR inserting product into DB"));
//     console.error(err);
//     throw err;
//   }

//   // ================================
//   // 2. HANDLE IMAGE UPLOADS
//   // ================================
//   if (p.imagesFolder) {
//     console.log(
//       chalk.yellow(`\n📁 Uploading images from folder: ${p.imagesFolder}`)
//     );

//     try {
//       const uploadedImages = await uploadFolderToImageKit(
//         p.imagesFolder,
//         p.model
//       );

//       console.log(`📸 Found ${uploadedImages.length} images to store in DB`);

//       for (const img of uploadedImages) {
//         const [data]=await db.insert(productImage).values({
//           id: nanoid(),
//           productId,
//           url: img.url,
//           fileId: img.fileId,
//           position: String(img.position),
//         }).returning();
//         console.log(data);

//         console.log(
//           chalk.green(
//             `   ✔ Image inserted → URL: ${img.url} | Position: ${img.position}`
//           )
//         );
//       }

//       console.log(chalk.green("✔ All product images stored successfully"));
//     } catch (err) {
//       console.error(chalk.red("❌ ERROR uploading product images"));
//       console.error(err);
//     }
//   }

//   // ================================
//   // 3. CATEGORY LINKING
//   // ================================
//   console.log(
//     chalk.yellow(`\n🏷  Linking categories for product: ${p.productName}`)
//   );
// //@ts-ignore
//   let allCategories = [];
//   try {
//     allCategories = await db.select().from(categoryTable);
//     console.log(`📦 Loaded ${allCategories.length} categories from DB`);
//   } catch (err) {
//     console.error(chalk.red("❌ ERROR fetching categories"));
//     console.error(err);
//   }

//   for (const catName of p.categories) {
//     //@ts-ignore
//     const match = allCategories.find(
//       (c) => c.name.toLowerCase() === catName.toLowerCase()
//     );

//     if (match) {
//       try {
//         await db.insert(productCategory).values({
//           productId,
//           categoryId: match.id,
//         });
//         console.log(chalk.green(`   ✔ Linked Category: ${catName}`));
//       } catch (err) {
//         console.error(
//           chalk.red(`❌ ERROR inserting category link: ${catName}`)
//         );
//         console.error(err);
//       }
//     } else {
//       console.warn(
//         chalk.red(
//           `   ⚠ Category "${catName}" NOT FOUND for product "${p.productName}"`
//         )
//       );
//     }
//   }

//   console.log(chalk.green(`\n✔ All categories linked (where matched).`));

//   // ================================
//   // 4. FETCH FINAL PRODUCT WITH RELATIONS
//   // ================================
//   console.log(chalk.blue("\n🔍 Fetching product with relations..."));

//   try {
//     const finalData = await db.query.product.findMany({
//       with: {
//         productCategories: {
//           with: {
//             category: true,
//           },
//         },
//         productImages: true,
//       },
//     });

//     console.log(chalk.green("✔ Final product fetch successful\n"));
//     return finalData;
//   } catch (err) {
//     console.error(chalk.red("❌ ERROR fetching final product relations"));
//     console.error(err);
//     throw err;
//   }
// }

// export async function seedProds() {
//   await seedCategories();

//   const productsDir = path.join(process.cwd(), "data");

//   const p = JSON.parse(
//     await fs.readFile(path.join(productsDir, "/products.json"), "utf8")
//   );
//   let data;
//   if (Array.isArray(p)) {
//     console.log(`Found ${p.length} products. Seeding all...`);
//     for (const prod of p) {
//       data = await insertProduct(prod);
//     }
//   } else {
//     console.log("Seeding single product...");
//     data = await insertProduct(p);
//   }

//   console.log("Products seeded successfully.");
//   return data;
// }

import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import {
  product,
  productImage,
  productCategory,
  category as categoryTable,
} from "@/lib/db/schema";
import chalk from "chalk";
import { uploadFolderToImageKit } from "@/lib/imagekit/imageUpload";

type Localized = {
  en: string;
  pt: string;
};

type ProductInput = {
  productName: Localized;
  brand: string;
  model: string;
  categories: string[]; // These are EN strings only (your input format)
  subCategory: Localized;
  description: Localized;
  features: {
    en: string[];
    pt: string[];
  };
  pricing: any;
  specifications: any;
  tags: {
    en: string[];
    pt: string[];
  };
  imagesFolder?: string;
};

async function insertProduct(p: ProductInput) {
  console.log(chalk.blue(`\n🟦 [START] Inserting product: ${p.productName.en}`));

  const productId = nanoid();

  // ================================
  // 1️⃣ INSERT PRODUCT
  // ================================
  try {
    await db.insert(product).values({
      id: productId,
      productName: p.productName,
      brand: p.brand,
      model: p.model,
      subCategory: p.subCategory,
      description: p.description,
      features: p.features,
      pricing: p.pricing,
      specifications: p.specifications,
      tags: p.tags,
    });

    console.log(chalk.green(`✔ Product inserted: ${p.productName.en}`));
  } catch (err) {
    console.error(chalk.red("❌ ERROR inserting product"));
    throw err;
  }

  // ================================
  // 2️⃣ IMAGES UPLOAD
  // ================================
  if (p.imagesFolder) {
    console.log(`📁 Uploading images: ${p.imagesFolder}`);

    try {
      const uploadedImages = await uploadFolderToImageKit(
        p.imagesFolder,
        p.model
      );

      for (const img of uploadedImages) {
        await db.insert(productImage).values({
          id: nanoid(),
          productId,
          url: img.url,
          fileId: img.fileId,
          position: String(img.position),
        });
      }

      console.log(chalk.green("✔ Images inserted"));
    } catch (err) {
      console.error(chalk.red("❌ Error uploading images"));
      console.error(err);
    }
  }

  // ================================
  // 3️⃣ CATEGORY LINKING (MULTILINGUAL)
  // ================================
  console.log(`🏷 Linking categories…`);

  let allCategories = [];
  try {
    allCategories = await db.select().from(categoryTable);
  } catch (err) {
    console.error(chalk.red("❌ Error fetching categories"));
    console.error(err);
  }

  for (const cat of p.categories) {
    const catLower = cat.toLowerCase();
//@ts-ignore
    const match = allCategories.find(
      (c: any) =>
        c.name?.en?.toLowerCase() === catLower ||
        c.name?.pt?.toLowerCase() === catLower
    );

    if (!match) {
      console.warn(
        chalk.yellow(
          `⚠ Category NOT FOUND: '${cat}' for Product: ${p.productName.en}`
        )
      );
      continue;
    }

    await db.insert(productCategory).values({
      productId,
      categoryId: match.id,
    });

    console.log(chalk.green(`   ✔ Linked → ${match.name.en}`));
  }

  return true;
}

export async function seedProds() {
  const productsDir = path.join(process.cwd(), "data");
  const prodJson = JSON.parse(
    await fs.readFile(path.join(productsDir, "products.json"), "utf8")
  );

  if (Array.isArray(prodJson)) {
    console.log(`📦 Seeding ${prodJson.length} products...`);
    for (const prod of prodJson) await insertProduct(prod);
  } else {
    await insertProduct(prodJson);
  }

  console.log(chalk.green("\n🎉 All products inserted successfully!"));
}
