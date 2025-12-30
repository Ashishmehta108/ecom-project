// // // "use server";

// // // import { db } from "@/lib/db";
// // // import { product, productCategory, category } from "@/lib/db/schema";
// // // import { sql, or } from "drizzle-orm";

// // // export async function getTopSmartphones() {
// // //   // Fetch products with relations, filtering by multilingual category name
// // //   const rows = await db.query.product.findMany({
// // //     where: (product, { exists, eq, and }) =>
// // //       exists(
// // //         db
// // //           .select()
// // //           .from(productCategory)
// // //           .where(
// // //             and(
// // //               eq(productCategory.productId, product.id),
// // //               exists(
// // //                 db
// // //                   .select()
// // //                   .from(category)
// // //                   .where(
// // //                     or(
// // //                       sql`${category.name}->>'en' = 'Phones'`,
// // //                       sql`${category.name}->>'pt' = 'Telefones'`
// // //                     )
// // //                   )
// // //               )
// // //             )
// // //           )
// // //       ),
// // //     with: {
// // //       productImages: true,
// // //       productCategories: {
// // //         with: {
// // //           category: true,
// // //         },
// // //       },
// // //     },
// // //   });

// // //   // Return raw products with multilingual objects (not resolved)
// // //   // This allows client-side components to translate dynamically when language changes
// // //   return rows.map((p) => ({
// // //     id: p.id,
// // //     name: p.productName, // Multilingual object {en: string, pt: string}
// // //     price: p.pricing.price,
// // //     discount: p.pricing.discount,
// // //     image: p.productImages?.[0]?.url || "/placeholder.png",
// // //     productImages: p.productImages || [],
// // //   }));
// // // }

// // "use server";

// // import { db } from "@/lib/db";
// // import { productCategory, category } from "@/lib/db/schema";
// // import { sql, and, eq, or } from "drizzle-orm";

// // export async function getTopSmartphones() {
// //   console.log("getting top smartphones")
// //   const rows = await db.query.product.findMany({
// //     where: (p, { exists, eq: eqFn, and: andFn }) =>
// //       exists(
// //         db
// //           .select()
// //           .from(productCategory)
// //           .where(
// //             andFn(
// //               eqFn(productCategory.productId, p.id),
// //               exists(
// //                 db
// //                   .select()
// //                   .from(category)
// //                   .where(
// //                     andFn(
// //                       eqFn(category.id, productCategory.categoryId),
// //                       or(
// //                         sql`${category.name}->>'en' = 'Phones'`,
// //                         sql`${category.name}->>'pt' = 'Telefones'`
// //                       )
// //                     )
// //                   )
// //               )
// //             )
// //           )
// //       ),
// //     with: {
// //       productImages: true,
// //       productCategories: {
// //         with: {
// //           category: true,
// //         },
// //       },
// //     },
// //   });

// //   // Return raw products with multilingual objects (not resolved)
// //   // This allows client-side components to translate dynamically when language changes
// //   return rows.map((p: any) => ({
// //     id: p.id,
// //     name: p.productName, // Multilingual object {en: string, pt: string}
// //     price: p.pricing.price,
// //     discount: p.pricing.discount,
// //     image: p.productImages?.[0]?.url || "/placeholder.png",
// //     productImages: p.productImages || [],
// //   }));
// // }

// "use server";

// import { db } from "@/lib/db";
// import { product, productCategory, category } from "@/lib/db/schema";
// import { sql, and, eq } from "drizzle-orm";

// export async function getTopSmartphones() {
//   console.log("[SERVER] Fetching Smartphones...");
// console.log(await db.query.product.findMany({
//   with:{
//     productImages: true,
//     productCategories: {
//       with: {
//         category: true,
//       },
//     },
//   }
// }) , "this is the product")
//   const rows = await db.query.product.findMany({
//     where: (p, { exists }) =>
//       exists(
//         db
//           .select()
//           .from(productCategory)
//           .innerJoin(category, eq(productCategory.categoryId, category.id))
//           .where(
//             and(
//               eq(productCategory.productId, p.id),
//               sql`${category.name}->>'en' = 'Phones'
//                 OR ${category.name}->>'pt' = 'Telefones'`
//             )
//           )
//       ),
//     with: {
//       productImages: true,
//       productCategories: {
//         with: {
//           category: true,
//         },
//       },
//     },
//   });

//   console.log("[SERVER] Smartphones raw:", JSON.stringify(rows, null, 2));

//   const formatted = rows.map((p) => ({
//     id: p.id,
//     name: p.productName,
//     price: p.pricing.price,
//     discount: p.pricing.discount,
//     image: p.productImages?.[0]?.url || "/placeholder.png",
//   }));

//   console.log("[SERVER] Formatted Smartphones:", formatted);

//   return formatted;
// }
"use server";

import { db } from "@/lib/db";
import { productCategory, category } from "@/lib/db/schema";
import { sql, and, eq, or } from "drizzle-orm";

export async function getTopSmartphones() {
  const rows = await db.query.product.findMany({
    where: (p, { exists, eq: eqFn, and: andFn }) =>
      exists(
        db
          .select()
          .from(productCategory)
          .where(
            andFn(
              eqFn(productCategory.productId, p.id),
              exists(
                db
                  .select()
                  .from(category)
                  .where(
                    andFn(
                      eqFn(category.id, productCategory.categoryId),
                      or(
                        sql`${category.name}->>'en' = 'Smartphones'`,
                        sql`${category.name}->>'pt' = 'Smartphones'`,
                        sql`${category.name}->>'pt' = 'Telemóveis'`
                      )
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

  return rows.map((p: any) => ({
    id: p.id,
    name: p.name, // multilingual object
    price: p.price,
    discount: p.discount,
    image: p.productImages?.[0]?.url || "/placeholder.png",
    productImages: p.productImages || [],
  }));
}
