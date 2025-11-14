// import { randomUUID } from "crypto";
// import { db } from "@/lib/db";
// import { product, productImage } from "@/lib/db/schema";
// import { eq } from "drizzle-orm";
// export const createProduct = async (
//   name: string,
//   description: string,
//   price: string,
//   images: string[],
//   currency: string = "INR"
// ) => {
//   const [p] = await db
//     .insert(product)
//     .values({
//       id: randomUUID(),
//       name,
//       description,
//       price,
//       currency,
//     })
//     .returning();

//   for (const img of images) {
//     await db.insert(productImage).values({
//       id: randomUUID(),
//       url: img,
//       altText: name,
//       productId: p.id,
//     });
//   }

//   return await getProductById(p.id);
// };

// export const getAllProducts = async () => {
//   return db.query.product.findMany({
//     with: {
//       productImages: true,
//     },
//   });
// };

// export const getProductById = async (productId: string) => {
//   return db.query.product.findFirst({
//     where: (fields, { eq }) => eq(fields.id, productId),
//     with: {
//       productImages: true,
//     },
//   });
// };

// export const updateProduct = async (
//   productId: string,
//   data: {
//     name?: string;
//     description?: string;
//     price?: string;
//     currency?: string;
//     productDiscount?: string;
//   }
// ) => {
//   await db
//     .update(product)
//     .set({
//       ...data,
//     })
//     .where(eq(product.id, productId));

//   return await getProductById(productId);
// };

// export const addProductImage = async (
//   productId: string,
//   url: string,
//   altText: string = ""
// ) => {
//   await db.insert(productImage).values({
//     id: randomUUID(),
//     url,
//     altText,
//     productId,
//   });
//   return await getProductById(productId);
// };

// export const deleteProductImage = async (imageId: string) => {
//   await db.delete(productImage).where(eq(productImage.id, imageId));
//   return { success: true };
// };

import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { product, productImage } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { uploadHocoImages } from "@/lib/imagekit/imageUpload";

export const uploadImageSaveinArray = async () => {
  const resp = await uploadHocoImages();
  return resp;
};

const images = [
  {
    fileId: "6916756f5c7cd75eb84cc336",
    name: "hoco_0_A9W4w_AaN.jpeg",
    size: 171897,
    versionInfo: {
      id: "6916756f5c7cd75eb84cc336",
      name: "Version 1",
    },
    filePath: "/hoco_0_A9W4w_AaN.jpeg",
    url: "https://ik.imagekit.io/wxwtesflu/hoco_0_A9W4w_AaN.jpeg",
    fileType: "image",
    height: 800,
    width: 800,
    thumbnailUrl:
      "https://ik.imagekit.io/wxwtesflu/tr:n-ik_ml_thumbnail/hoco_0_A9W4w_AaN.jpeg",
    AITags: null,
    description: null,
  },
  {
    fileId: "691675705c7cd75eb84cc977",
    name: "hoco_1_hw9Y_InLN.jpeg",
    size: 127667,
    versionInfo: {
      id: "691675705c7cd75eb84cc977",
      name: "Version 1",
    },
    filePath: "/hoco_1_hw9Y_InLN.jpeg",
    url: "https://ik.imagekit.io/wxwtesflu/hoco_1_hw9Y_InLN.jpeg",
    fileType: "image",
    height: 800,
    width: 800,
    thumbnailUrl:
      "https://ik.imagekit.io/wxwtesflu/tr:n-ik_ml_thumbnail/hoco_1_hw9Y_InLN.jpeg",
    AITags: null,
    description: null,
  },
  {
    fileId: "691675725c7cd75eb84cd02a",
    name: "hoco_2_2mJc_07BL.jpeg",
    size: 65673,
    versionInfo: {
      id: "691675725c7cd75eb84cd02a",
      name: "Version 1",
    },
    filePath: "/hoco_2_2mJc_07BL.jpeg",
    url: "https://ik.imagekit.io/wxwtesflu/hoco_2_2mJc_07BL.jpeg",
    fileType: "image",
    height: 750,
    width: 750,
    thumbnailUrl:
      "https://ik.imagekit.io/wxwtesflu/tr:n-ik_ml_thumbnail/hoco_2_2mJc_07BL.jpeg",
    AITags: null,
    description: null,
  },
  {
    fileId: "691675735c7cd75eb84cd5a5",
    name: "hoco_3_S0MG59zBOJ.jpeg",
    size: 74168,
    versionInfo: {
      id: "691675735c7cd75eb84cd5a5",
      name: "Version 1",
    },
    filePath: "/hoco_3_S0MG59zBOJ.jpeg",
    url: "https://ik.imagekit.io/wxwtesflu/hoco_3_S0MG59zBOJ.jpeg",
    fileType: "image",
    height: 800,
    width: 800,
    thumbnailUrl:
      "https://ik.imagekit.io/wxwtesflu/tr:n-ik_ml_thumbnail/hoco_3_S0MG59zBOJ.jpeg",
    AITags: null,
    description: null,
  },
  {
    fileId: "691675745c7cd75eb84cdb7e",
    name: "hoco_4_bo9WK4K52.jpeg",
    size: 111041,
    versionInfo: {
      id: "691675745c7cd75eb84cdb7e",
      name: "Version 1",
    },
    filePath: "/hoco_4_bo9WK4K52.jpeg",
    url: "https://ik.imagekit.io/wxwtesflu/hoco_4_bo9WK4K52.jpeg",
    fileType: "image",
    height: 800,
    width: 800,
    thumbnailUrl:
      "https://ik.imagekit.io/wxwtesflu/tr:n-ik_ml_thumbnail/hoco_4_bo9WK4K52.jpeg",
    AITags: null,
    description: null,
  },
  {
    fileId: "691675755c7cd75eb84ce21a",
    name: "hoco_5_Y7rCPlgj6.jpeg",
    size: 243415,
    versionInfo: {
      id: "691675755c7cd75eb84ce21a",
      name: "Version 1",
    },
    filePath: "/hoco_5_Y7rCPlgj6.jpeg",
    url: "https://ik.imagekit.io/wxwtesflu/hoco_5_Y7rCPlgj6.jpeg",
    fileType: "image",
    height: 800,
    width: 800,
    thumbnailUrl:
      "https://ik.imagekit.io/wxwtesflu/tr:n-ik_ml_thumbnail/hoco_5_Y7rCPlgj6.jpeg",
    AITags: null,
    description: null,
  },
  {
    fileId: "691675775c7cd75eb84ce775",
    name: "hoco_6_-ieHx0dqN.jpeg",
    size: 99641,
    versionInfo: {
      id: "691675775c7cd75eb84ce775",
      name: "Version 1",
    },
    filePath: "/hoco_6_-ieHx0dqN.jpeg",
    url: "https://ik.imagekit.io/wxwtesflu/hoco_6_-ieHx0dqN.jpeg",
    fileType: "image",
    height: 800,
    width: 800,
    thumbnailUrl:
      "https://ik.imagekit.io/wxwtesflu/tr:n-ik_ml_thumbnail/hoco_6_-ieHx0dqN.jpeg",
    AITags: null,
    description: null,
  },
];

export const formatted = images.map((ele) => ({
  url: ele.url,
  fileId: ele.fileId,
}));
console.log(formatted)
export const sampleProductDataset = {
  name: "Hoco Premium Wireless Earbuds",
  description:
    "High quality wireless earbuds with deep bass, long-lasting battery, and sleek Hoco premium finish.",
  price: "1499",
  images: formatted,
  currency: "INR",
};

export const createProduct = async (
  name: string,
  description: string,
  price: string,
  images: { url: string; fileId: string }[],
  currency: string = "INR"
) => {
  const productId = randomUUID();

  const [created] = await db
    .insert(product)
    .values({
      id: productId,
      name,
      description,
      price,
      currency,
    })
    .returning();

  for (let i = 0; i < images.length; i++) {
    const img = images[i];

    await db.insert(productImage).values({
      id: randomUUID(),
      productId,
      url: img.url,
      fileId: img.fileId,
      position: String(i),
    });
  }

  return await getProductById(productId);
};

// -----------------------------
// GET ALL PRODUCTS
// -----------------------------
export const getAllProducts = async () => {
  return db.query.product.findMany({
    with: {
      productImages: true,
    },
  });
};

// -----------------------------
// GET PRODUCT BY ID
// -----------------------------
export const getProductById = async (productId: string) => {
  const productData = await db.query.product.findFirst({
    where: (fields, { eq }) => eq(fields.id, productId),
    with: {
      productImages: true, // cannot order here
    },
  });

  if (!productData) return null;

  // Return productData if productImages not present or not array
  if (!Array.isArray((productData as any).productImages)) {
    return productData;
  }

  // Manually sort images and ensure type correctness
  (productData as any).productImages = (productData as any).productImages.sort(
    (a: { position: string }, b: { position: string }) =>
      Number(a.position) - Number(b.position)
  );

  return productData;
};

// -----------------------------
// UPDATE PRODUCT
// ------------------------------
export const updateProduct = async (
  productId: string,
  data: {
    name?: string;
    description?: string;
    price?: string;
    currency?: string;
    productDiscount?: string;
  }
) => {
  await db.update(product).set(data).where(eq(product.id, productId));
  return await getProductById(productId);
};

// -----------------------------
// ADD PRODUCT IMAGE
// -----------------------------
export const addProductImage = async (
  productId: string,
  img: { url: string; fileId: string }
) => {
  const latest = await db.query.productImage.findMany({
    where: (fields, { eq }) => eq(fields.productId, productId),
  });

  const nextPosition = latest.length.toString();

  await db.insert(productImage).values({
    id: randomUUID(),
    productId,
    url: img.url,
    fileId: img.fileId,
    position: nextPosition,
  });

  return await getProductById(productId);
};

// -----------------------------
// DELETE PRODUCT IMAGE
// -----------------------------
export const deleteProductImage = async (imageId: string) => {
  await db.delete(productImage).where(eq(productImage.id, imageId));
  return { success: true };
};
