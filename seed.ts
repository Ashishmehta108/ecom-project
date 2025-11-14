// // import { auth } from "./auth"

// import { randomUUID } from "crypto";
// import { db } from "./lib/db";
// import { product, category } from "./lib/db/schema";
import { auth } from "./auth";

export const createAdmin=async()=>{
    const user=await auth.api.createUser({
        body:{
            name:"Admin",
            email:"ashishmehta108@gmail.com",
            password:"Ashish_m108",
            data: { customField: "customValue" },
            role:"admin"
        }
    })
    console.log("user made ",user)
}

// // const

// export const addProduct = async (
//   productName: string,
//   description: string,
//   price: string,
//   images: String[],
//   currency: string
// ) => {
//   const [p] = await db
//     .insert(product)
//     .values({
//       name: "Product 1",
//       description: "Product 1 description",
//       price: "100",
//       images: ["image1.jpg", "image2.jpg"],
//       currency: "INR",
//       id: randomUUID(),
//     })
//     .returning({
//       name: product.name,
//       description: product.description,
//       price: product.price,
//       images: product.images,
//       currency: product.currency,
//       id: product.id,
//       createdAt: product.createdAt,
//       updatedAt: product.updatedAt,
//     });
//   console.log("product added ", p);
//   return p;
// };

// export const updateProduct = async (
//   productName?: string,
//   description?: string,
//   price?: string,

//   currency?: string
// ) => {

// };

// export const addCategory = async () => {
//   const categories = [
//     "earphones",
//     "tabs",
//     "watch",
//     "speaker",
//     "electronics",
//     "refurbished",
//     "covers",
//     "accessories",
//   ];
//   for (const c of categories) {
//     await db.insert(category).values({
//       name: c,
//       id: randomUUID(),
//     });
//   }
//   console.log("categories added ", categories);
// };

// // export const addToCart=async()=>{
// //     const cartId=await randomUUID()
// //     const userId=await auth.api.getSession()

// // }
