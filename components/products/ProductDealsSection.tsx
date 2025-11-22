// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import Container from "../giobal/Container";
// import { ChevronRight } from "lucide-react";
// import { Merriweather } from "next/font/google";

// const merriweather = Merriweather({
//   variable: "--font-merriweather",
//   subsets: ["latin"],
//   weight: ["400"],
// });

// export default function ProductDealsSection() {
//   const products = [
//     {
//       id: 1,
//       name: "Galaxy S22 Ultra",
//       image:
//         "https://m.media-amazon.com/images/I/41REratdlNL._SY300_SX300_QL70_FMwebp_.jpg",
//       price: 32999,
//       oldPrice: 74999,
//       discount: 56,
//       savings: 32999,
//     },
//     {
//       id: 2,
//       name: "Galaxy M13 (4GB | 64GB)",
//       image:
//         "https://m.media-amazon.com/images/I/41Z3zn7d+JL._SY300_SX300_QL70_FMwebp_.jpg",
//       price: 10499,
//       oldPrice: 14999,
//       discount: 30,
//       savings: 4500,
//     },
//     {
//       id: 3,
//       name: "Galaxy M33 (4GB | 64GB)",
//       image:
//         "https://m.media-amazon.com/images/I/41amrp7gg7L._SX342_SY445_QL70_FMwebp_.jpg",
//       price: 16999,
//       oldPrice: 24999,
//       discount: 32,
//       savings: 8000,
//     },
//     {
//       id: 4,
//       name: "Galaxy M53 (4GB | 64GB)",
//       image:
//         "https://m.media-amazon.com/images/I/41XfwBsC7wL._SY300_SX300_QL70_FMwebp_.jpg",
//       price: 31999,
//       oldPrice: 40999,
//       discount: 22,
//       savings: 9000,
//     },
//   ];

//   return (
//     <section className="w-full py-16 sm:py-24 bg-white dark:bg-neutral-950">
//       <Container>
//         {/* HEADER */}
//          <div className="flex items-end justify-between mb-8 md:mb-10">
//           <div>
//             <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-neutral-50 tracking-tight">
//              Best Desls On Smartphones
//             </h2>
//             <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
//               Explore our curated collections
//             </p>
//           </div>
          
//           <Link
//             href="/categories"
//             className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors flex items-center gap-1 group"
//           >
//             View All
//             <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
//           </Link>
//         </div>

//         {/* CARD SLIDER */}
//        {/* CARD SLIDER */}
// <div
//   className="
//     flex gap-4
//     overflow-x-auto
//     snap-x snap-mandatory
//     hide-scrollbar
//     pb-3
//   "
// >
//   {products.map((p) => (
//     <Link
//       href={`/product/${p.id}`}
//       key={p.id}
//       className="
//         group
//         w-[160px] sm:w-[200px]
//         flex-shrink-0
//         snap-start
//         rounded-2xl
//         bg-white dark:bg-neutral-900
//         shadow-[0_2px_6px_rgba(0,0,0,0.06)]
//         overflow-hidden
//         transition-all duration-200
//       "
//     >
//       {/* IMAGE CONTAINER */}
//       <div
//         className="
//           relative
//           w-full
//           bg-white dark:bg-neutral-950
//           p-4
//           rounded-[20px]
//           flex items-center justify-center
//         "
//       >
//         <Image
//           src={p.image}
//           alt={p.name}
//           width={400}
//           height={400}
//           unoptimized
//           className="object-contain w-full h-full"
//         />

//         {/* HEART ICON */}
//         <div
//           className="
//             absolute top-2 right-2
//             w-7 h-7
//             rounded-full
//             bg-white dark:bg-neutral-800
//             shadow
//             flex items-center justify-center
//           "
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="w-4 h-4 text-neutral-500"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth="2"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.936 0-3.597 1.157-4.312 2.812C11.285 4.907 9.624 3.75 7.688 3.75 5.099 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
//             />
//           </svg>
//         </div>

//         {/* DISCOUNT BADGE */}
//         <span
//           className="
//             absolute bottom-2 left-2
//             bg-lime-300 text-black
//             text-[11px]
//             font-semibold
//             px-2 py-0.5
//             rounded-full
//           "
//         >
//           {p.discount}% OFF
//         </span>
//       </div>

//       {/* CONTENT */}
//       <div className="px-3 pt-3 pb-4">
//         <h3 className="text-[13px] font-  medium text-neutral-900 dark:text-neutral-100 leading-tight">
//           {p.name}
//         </h3>

//         <div className="flex items-center gap-2 mt-1">
//           <span className="text-[15px] font-bold text-neutral-900 dark:text-neutral-50">
//             ₹{p.price}
//           </span>
//         </div>

//         <span className="line-through text-neutral-400 dark:text-neutral-600 text-[12px]">
//           ₹{p.oldPrice}
//         </span>
//       </div>
//     </Link>
//   ))}
// </div>

//       </Container>
//     </section>
//   );
// }




"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "../giobal/Container";
import { ChevronRight } from "lucide-react";

export default function ProductDealsSection() {
  const products = [
    {
      id: 1,
      name: "Galaxy S22 Ultra",
      image:
        "https://m.media-amazon.com/images/I/41REratdlNL._SY300_SX300_QL70_FMwebp_.jpg",
      price: 32999,
      oldPrice: 74999,
      discount: 56,
    },
    {
      id: 2,
      name: "Galaxy M13 (4GB | 64GB)",
      image:
        "https://m.media-amazon.com/images/I/41Z3zn7d+JL._SY300_SX300_QL70_FMwebp_.jpg",
      price: 10499,
      oldPrice: 14999,
      discount: 30,
    },
    {
      id: 3,
      name: "Galaxy M33 (4GB | 64GB)",
      image:
        "https://m.media-amazon.com/images/I/41amrp7gg7L._SX342_SY445_QL70_FMwebp_.jpg",
      price: 16999,
      oldPrice: 24999,
      discount: 32,
    },
    {
      id: 4,
      name: "Galaxy M53 (4GB | 64GB)",
      image:
        "https://m.media-amazon.com/images/I/41XfwBsC7wL._SY300_SX300_QL70_FMwebp_.jpg",
      price: 31999,
      oldPrice: 40999,
      discount: 22,
    },
  ];

  return (
    <section className="w-full py-16 sm:py-24 bg-white dark:bg-neutral-950">
      <Container>
        {/* HEADER */}
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-neutral-50 tracking-tight">
              Top Smartphones
            </h2>
          </div>

          <Link
            href="/categories"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors flex items-center gap-1 group"
          >
            See all
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* PRODUCT LIST */}
        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-2">
          {products.map((p) => (
            <Link
              href={`/product/${p.id}`}
              key={p.id}
              className="
                group
                w-[180px] sm:w-[200px]
                flex-shrink-0
                snap-start
              "
            >
              {/* IMAGE BOX / TRUE PRODUCT CARD */}
              <div
                className="
                  relative
                  w-full
                  aspect-[4/4]
                  rounded-2xl
                  bg-neutral-100 dark:bg-neutral-900
                  border border-neutral-200 dark:border-neutral-800
                  overflow-hidden
                  flex items-center justify-center
                  p-5
                  transition-all duration-200
              
                "
              >
                {/* HEART BTN */}
                <button
                  className="
                    absolute top-2 right-2
                    w-8 h-8
                    rounded-full
                    bg-white/90 dark:bg-neutral-800/90
                    backdrop-blur
                    flex items-center justify-center
                    shadow
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-neutral-600 dark:text-neutral-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.936 0-3.597 1.157-4.312 2.812C11.285 4.907 9.624 3.75 7.688 3.75 5.099 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                </button>

                {/* DISCOUNT BADGE */}
                <span
                  className="
                    absolute bottom-2 left-2
                    bg-indigo-400 text-white
                    text-[11px]
                    font-semibold
                    px-2 py-0.5
                    rounded-full
                  "
                >
                  {p.discount}% OFF
                </span>

                <Image
                  src={p.image}
                  alt={p.name}
                  width={300}
                  height={300}
                  unoptimized
                  className="object-contain w-full h-full"
                />
              </div>

              {/* TEXT BELOW CARD (NOT INSIDE CARD) */}
              <div className="mt-3">
                <h3 className="text-[16px] font-bold text-neutral-900 dark:text-neutral-100 leading-tight line-clamp-2">
                  {p.name}
                </h3>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[14px] font-medium text-neutral-900 dark:text-neutral-50">
                    ₹{p.price}
                  </span>
                  <span className="line-through text-neutral-400 dark:text-neutral-600 text-[12px]">
                    ₹{p.oldPrice}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
