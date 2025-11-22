import {
  category,
  product,
  productCategory,
  productImage,
} from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";
import { Product } from "../types/product.types";

export const getProducts = async () => {
  const products = await db.select().from(product);
  return products;
};
export const getEarbuds = async () => {
  const earbuds = await db.query.product.findMany({
    where: (product, { exists, eq, and }) =>
      exists(
        db
          .select()
          .from(productCategory)
          .where(
            and(
              eq(productCategory.productId, product.id),
              // correlate category.id with productCategory.categoryId
              exists(
                db
                  .select()
                  .from(category)
                  .where(
                    and(
                      eq(category.id, productCategory.categoryId), // <--- added correlation
                      eq(category.name, "Earphones")
                    )
                  )
              )
            )
          )
      ),
    with: {
      productImages: true,
      productCategories: {
        with: {
          category: true,
        },
      },
    },
  });

  // optional: remove or adjust logging in production
  console.log(earbuds);
  return earbuds;
};

export const getProductById = async (id: string) => {
  const prod = await db.query.product.findFirst({
    where: eq(product.id, id),  
    with: {
      productImages: true,
      productCategories: {
        with: {
          category: true,
        },
      },
    },
  });
  console.log(prod)

  // if (!prod) {
  //   throw new Error(`Product with ID "${id}" not found`);
  // }

  return prod;
};

export const createProduct = async (p: Partial<Product>) => {
  const id = p.id ?? nanoid();

  // -------------------------------
  // 1. VALIDATION
  // -------------------------------
  if (!p.productName) throw new Error("productName is required");
  if (!p.brand) throw new Error("brand is required");

  // -------------------------------
  // 2. INSERT INTO PRODUCT TABLE
  // -------------------------------
  const insertPayload = {
    id,
    productName: p.productName,
    brand: p.brand,
    model: p.model ?? "",
    subCategory: p.subCategory ?? "",
    description: p.description ?? "",
    features: p.features ?? [],
    pricing: p.pricing ?? {
      price: 0,
      currency: "INR",
      discount: 0,
      inStock: true,
      stockQuantity: 0,
    },  
    specifications: p.specifications ?? { general: {}, technical: {} },
    tags: p.tags ?? [],
  };

  await db.insert(product).values(insertPayload);

  // -------------------------------
  // 3. CATEGORY RELATIONS
  // -------------------------------
  if (p.categories && p.categories.length > 0) {
    // Fetch existing categories by name
    const existing = await db
      .select()
      .from(category)
      .where(inArray(category.name, p.categories));

    // Map category name → id
    const existingMap = new Map(existing.map((c) => [c.name, c.id]));

    let missingNames: string[] = [];

    // find categories that do not exist yet
    for (const catName of p.categories) {
      if (!existingMap.has(catName)) missingNames.push(catName);
    }

    // OPTIONAL: Auto-create missing categories
    if (missingNames.length > 0) {
      const newCatsData = missingNames.map((name) => ({
        id: nanoid(),
        name,
        imageUrl: "default",
      }));

      const newCats = await db.insert(category).values(newCatsData).returning();

      for (const c of newCats) {
        existingMap.set(c.name, c.id);
      }
    }

    // Insert into productCategory table
    const inserts = p.categories.map((catName) => ({
      productId: id,
      categoryId: existingMap.get(catName)!,
    }));

    await db.insert(productCategory).values(inserts);
  }

  // -------------------------------
  // 4. PRODUCT IMAGES
  // -------------------------------
  if (p.productImages && p.productImages.length > 0) {
    const imgs = p.productImages.map((img, idx) => ({
      id: nanoid(),
      productId: id,
      url: img.url,
      fileId: img.fileId!,
      position: String(idx),
    }));

    await db.insert(productImage).values(imgs);
  }

  return await getProductById(id);
};

export const updateProduct = async (
  id: string,
  p: typeof product.$inferInsert
) => {
  const [updatedProduct] = await db
    .update(product)
    .set(p)
    .where(eq(product.id, id))
    .returning();

  return updatedProduct;
};

export const deleteProduct = async (id: string) => {
  const [deletedProduct] = await db
    .delete(product)
    .where(eq(product.id, id))
    .returning();
  return deletedProduct;
};
