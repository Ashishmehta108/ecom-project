// "use client";

import { product } from "@/lib/constants/product.dummy";
import ProductPage from "./test";
import { getProductById } from "@/lib/actions/product-actions";
import { Product } from "@/lib/types/product.types";

// import { useState, useMemo } from "react";
// import Image from "next/image";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import ReviewPage from "@/components/reviews/page";
// import { useParams } from "next/navigation";

// const FALLBACK_IMG = "https://via.placeholder.com/500x500.png?text=No+Image";

// export default function ProductPage({ id }: { id: string }) {
//   const params = useParams();

//   const product = {
//     id: "",
//     productName: "Hoco EW30 Intelligent True Wireless Bluetooth Earphone",
//     brand: "Hoco",
//     model: "EW30",
//     category: "Earphone & Headset",
//     subCategory: "Bluetooth Earphone",
//     description:
//       "Hoco EW30 is a true wireless Bluetooth 5.3 headset with low latency, long standby time, LED indicators, and ergonomic design.",
//     features: [
//       "Bluetooth 5.3",
//       "41–50ms low-latency wireless audio",
//       "Charging case 300mAh, Earbuds 25mAh",
//       "3.5 hours use time",
//       "150 hours standby",
//       "Leader–follower switching",
//       "Summon Siri",
//       "LED battery indicator",
//       "IPX-3 waterproof rating",
//     ],
//     pricing: {
//       price: 660,
//       currency: "INR",
//       discount: 0,
//       inStock: true,
//       stockQuantity: 10,
//     },
//     specifications: {
//       general: {
//         productName: "EW30 Intelligent True Wireless Bluetooth Headset",
//         brandName: "Hoco",
//         colors: "White",
//         material: "ABS",
//         weight: "37g",
//         sizeMm: "51 x 44 x 21 mm",
//         privateMold: "Yes",
//         certificate: ["CE", "FCC", "ROHS"],
//       },
//       technical: {
//         bluetoothVersion: "5.3",
//         wirelessDelayTime: "41-50 ms",
//         waterproofStandard: "IPX-3",
//         chipset: "JL AC6983D2",
//         batteryCapacity: "300mAh, 25mAh",
//         useTime: "3.5 hours",
//         standbyTime: "150 hours",
//       },
//     },
//     images: [
//       {
//         url: "https://ik.imagekit.io/wxwtesflu/hoco_0_A9W4w_AaN.jpeg",
//       },
//       {
//         url: "https://ik.imagekit.io/wxwtesflu/hoco_2_2mJc_07BL.jpeg",
//       },
//     ],
//     tags: ["Bluetooth Earphone", "TWS", "Hoco", "EW30"],
//   };

//   const images =
//     Array.isArray(product.images) && product.images.length > 0
//       ? product.images.map((i) => i.url)
//       : [FALLBACK_IMG];

//   const [selectedImage, setSelectedImage] = useState(images[0]);

//   const price = Number(product.pricing?.price ?? 0);
//   const discount = Number(product.pricing?.discount ?? 0);

//   const discountedPrice = useMemo(() => {
//     if (discount > 0 && discount <= 100) {
//       return price - (price * discount) / 100;
//     }
//     return price;
//   }, [price, discount]);

//   return (
//     <div className="mx-auto max-w-6xl px-4 py-10 text-neutral-900 dark:text-neutral-100">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//         <div className="space-y-4">
//           <div className="relative group w-full h-80 md:h-[440px] border dark:border-neutral-800 rounded-lg bg-white dark:bg-neverflow-hidden">
//             <div className="flex items-center justify-center w-full h-full">
//               <div className="relative group w-60 h-60 md:w-80 md:h-80  bg-white dark:bg--900 overflow-hidden">
//                 <Image
//                   src={selectedImage}
//                   alt={product.productName || "Product"}
//                   width={300}
//                   height={300}
//                   className="object-contain p-3 transition-transform duration-300 group-hover:scale-110 cursor-zoom-in"
//                   onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex gap-3 overflow-x-auto">
//             {images.map((url, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => setSelectedImage(url)}
//                 className={`relative w-20 h-20 rounded-md border bg-white dark:bg-neutral-900 dark:border-neutral-700 transition
//                   ${
//                     selectedImage === url
//                       ? "border-neutral-500 dark:border-neutral-300"
//                       : "hover:ring-1 hover:ring-neutral-500 dark:hover:ring-neutral-300"
//                   }
//                 `}
//               >
//                 <Image
//                   src={url}
//                   alt="Thumbnail"
//                   fill
//                   className="object-contain p-1"
//                 />
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="flex flex-col space-y-5">
//           <div>
//             <h1 className="text-3xl font-semibold">
//               {product.productName || "Unnamed Product"}
//             </h1>
//             <p className="text-neutral-500 dark:text-neutral-400 mt-1">
//               {(product.brand || "") + " " + (product.model || "")}
//             </p>
//           </div>

//           <div className="flex items-center gap-3">
//             <p className="text-3xl font-bold">₹{discountedPrice.toFixed(2)}</p>

//             {discount > 0 && (
//               <>
//                 <p className="line-through text-neutral-400 dark:text-neutral-600">
//                   ₹{price.toFixed(2)}
//                 </p>
//                 <Badge variant="secondary">{discount}% OFF</Badge>
//               </>
//             )}
//           </div>

//           {product.pricing?.inStock ? (
//             <Badge className="w-max bg-green-600 text-white">In Stock</Badge>
//           ) : (
//             <Badge className="w-max bg-red-600 text-white">Out of Stock</Badge>
//           )}

//           <Button
//             className="w-full md:w-max px-10 py-6 text-base shadow-sm bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-600 hover:bg-blue-900 dark:bg-blue-700 dark:text-white"
//             disabled={!product.pricing?.inStock}
//           >
//             Add to Cart
//           </Button>

//           <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
//             {product.description || "No description available."}
//           </p>

//           {/* FEATURES */}
//           <div>
//             <h3 className="text-lg font-semibold mb-2">Features</h3>
//             <ul className="list-disc pl-5 space-y-1 text-neutral-700 dark:text-neutral-300 text-sm">
//               {product.features?.length > 0 ? (
//                 product.features.map((f, i) => <li key={i}>{f}</li>)
//               ) : (
//                 <li>No features listed.</li>
//               )}
//             </ul>
//           </div>

//           <div className="flex gap-2 flex-wrap mt-3">
//             {product.tags?.map((tag, i) => (
//               <Badge
//                 key={i}
//                 variant="outline"
//                 className="text-neutral-600 dark:text-neutral-300 border-neutral-400 dark:border-neutral-600"
//               >
//                 {tag}
//               </Badge>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="mt-16">
//         <h2 className="text-2xl font-bold mb-4">Specifications</h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {Object.entries(product.specifications || {}).map(
//             ([section, items]: any) => (
//               <div
//                 key={section}
//                 className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-5 shadow-sm border dark:border-neutral-800"
//               >
//                 <h3 className="font-semibold text-lg mb-3 capitalize">
//                   {section}
//                 </h3>

//                 <div className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
//                   {Object.entries(items || {}).map(([k, v]: any) => (
//                     <div
//                       key={k}
//                       className="flex justify-between border-b border-neutral-200 dark:border-neutral-700 py-1 last:border-none"
//                     >
//                       <span className="font-medium capitalize">{k}</span>
//                       <span className="text-right">
//                         {Array.isArray(v) ? v.join(", ") : String(v)}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )
//           )}
//         </div>
//       </div>
//       <ReviewPage />
//     </div>
//   );
// }

export async function Product({ id }: { id: string }) {
  const p: Product = await getProductById(id);
  return <ProductPage product={product} />;
}
