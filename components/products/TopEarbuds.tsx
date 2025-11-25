// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import Container from "../giobal/Container";
// import { ChevronRight } from "lucide-react";

// export default function TopEarbudsSection() {
//   const earbuds = [
//     {
//       id: 1,
//       name: "Samsung Galaxy Buds Pro",
//       image: "/mnt/data/c79c904e-8cde-4d3b-b0b7-acec473e8252.png",
//       price: 6990,
//       oldPrice: 8990,
//       discount: 22,
//     },
//     {
//       id: 2,
//       name: "OnePlus Buds Z2",
//       image: "/mnt/data/c79c904e-8cde-4d3b-b0b7-acec473e8252.png",
//       price: 4990,
//       oldPrice: 6990,
//       discount: 30,
//     },
//     {
//       id: 3,
//       name: "Apple AirPods 3rd Gen",
//       image: "/mnt/data/c79c904e-8cde-4d3b-b0b7-acec473e8252.png",
//       price: 17990,
//       oldPrice: 19990,
//       discount: 10,
//     },
//     {
//       id: 4,
//       name: "Realme Buds Air 5",
//       image: "/mnt/data/c79c904e-8cde-4d3b-b0b7-acec473e8252.png",
//       price: 3699,
//       oldPrice: 4999,
//       discount: 25,
//     },
//   ];

//   return (
//     <section className="w-full py-12 bg-white dark:bg-neutral-950">
//       <Container>
//         {/* HEADER */}
//         <div className="flex items-end justify-between mb-8">
//           <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-neutral-50">
//             Top Earbuds
//           </h2>

//           <Link
//             href="/earbuds"
//             className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors flex items-center gap-1 group"
//           >
//             See all
//             <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
//           </Link>
//         </div>

//         {/* CARD SLIDER */}
//         <div
//           className="
//             flex gap-5
//             overflow-x-auto
//             snap-x snap-mandatory
//             hide-scrollbar
//             pb-2
//           "
//         >
//           {earbuds.map((e) => (
//             <Link
//               href={`/earbud/${e.id}`}
//               key={e.id}
//               className="
//                 group
//                 w-[160px] sm:w-[200px]
//                 flex-shrink-0
//                 snap-start
//                 rounded-2xl
//                 bg-white dark:bg-neutral-900
//                 shadow-[0_2px_6px_rgba(0,0,0,0.06)]
//                 overflow-hidden
//                 transition-all duration-200
//               "
//             >
//               {/* IMAGE BOX */}
//               <div className="relative w-full bg-white dark:bg-neutral-950 p-4 rounded-[20px] flex items-center justify-center">
//                 <Image
//                   src={e.image}
//                   alt={e.name}
//                   width={400}
//                   height={400}
//                   unoptimized
//                   className="object-contain w-full h-full"
//                 />

//                 {/* HEART ICON */}
//                 <div
//                   className="
//                     absolute top-2 right-2
//                     w-7 h-7
//                     rounded-full
//                     bg-white dark:bg-neutral-800
//                     shadow
//                     flex items-center justify-center
//                   "
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="w-4 h-4 text-neutral-500"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     strokeWidth="2"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.936 0-3.597 1.157-4.312 2.812C11.285 4.907 9.624 3.75 7.688 3.75 5.099 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
//                     />
//                   </svg>
//                 </div>

//                 {/* DISCOUNT BADGE */}
//                 <span
//                   className="
//                     absolute bottom-2 left-2
//                     bg-[#B9C8FF] text-[#3D52FF]
//                     text-[11px]
//                     font-semibold
//                     px-2 py-0.5
//                     rounded-full
//                   "
//                 >
//                   {e.discount}% OFF
//                 </span>
//               </div>

//               {/* TEXT */}
//               <div className="px-3 pt-3 pb-4">
//                 <h3 className="text-[13px] font-medium text-neutral-900 dark:text-neutral-100 leading-tight line-clamp-1">
//                   {e.name}
//                 </h3>

//                 <div className="flex items-center gap-2 mt-1">
//                   <span className="text-[15px] font-bold text-neutral-900 dark:text-neutral-50">
//                     €{e.price}
//                   </span>
//                 </div>

//                 <span className="line-through text-neutral-400 dark:text-neutral-600 text-[12px]">
//                   €{e.oldPrice}
//                 </span>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </Container>
//     </section>
//   );
// }

"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "../giobal/Container";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function TopEarbudsSection() {
  const [earbuds, setEarbuds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarbuds = async () => {
      try {
        const res = await fetch("/api/earbuds");
        const data = await res.json();
        setEarbuds(data);
      } catch (err) {
        console.error("Earbuds fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEarbuds();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-12">
        <Container>
          <p className="text-neutral-600 dark:text-neutral-300">Loading…</p>
        </Container>
      </section>
    );
  }

  return (
    <section className="w-full py-12 bg-white dark:bg-neutral-950">
      <Container>
        {/* HEADER */}
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-neutral-50">
            Top Earbuds
          </h2>

          <Link
            href="/earbuds"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors flex items-center gap-1 group"
          >
            See all
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* CARD SLIDER */}
        <div
          className="
            flex gap-5
            overflow-x-auto
            snap-x snap-mandatory
            hide-scrollbar
            pb-2
          "
        >
          {earbuds.map((e) => (
            <Link
              href={`/product/${e.id}`}
              key={e.id}
              className="
                group
                w-[160px] sm:w-[200px]
                flex-shrink-0
                snap-start
                rounded-2xl
                bg-white dark:bg-neutral-900
                shadow-[0_2px_6px_rgba(0,0,0,0.06)]
                overflow-hidden
                transition-all duration-200
              "
            >
              {/* IMAGE BOX */}
              <div className="relative w-full bg-white dark:bg-neutral-950 p-4 rounded-[20px] flex items-center justify-center">
                <Image
                  src={e.productImages?.[0]?.url || "/placeholder.png"}
                  alt={e.name}
                  width={400}
                  height={400}
                  unoptimized
                  className="object-contain w-full h-full"
                />

                {/* HEART ICON */}
                <div
                  className="
                    absolute top-2 right-2
                    w-7 h-7
                    rounded-full
                    bg-white dark:bg-neutral-800
                    shadow
                    flex items-center justify-center
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-neutral-500"
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
                </div>

                {/* DISCOUNT BADGE */}
                {e.discount && e.discount !== 0 && (
                  <span
                    className="
                      absolute bottom-2 left-2
                      bg-[#B9C8FF] text-[#3D52FF]
                      text-[11px]
                      font-semibold
                      px-2 py-0.5
                      rounded-full
                    "
                  >
                    {e.discount}% off
                  </span>
                )}
              </div>

              {/* TEXT */}
              <div className="px-3 pt-3 pb-4">
                <h3 className="text-[13px] font-medium text-neutral-900 dark:text-neutral-100 leading-tight line-clamp-1">
                  {e.name}
                </h3>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[15px] font-bold text-neutral-900 dark:text-neutral-50">
                    €{e.price}
                  </span>
                </div>

                <span className="line-through text-neutral-400 dark:text-neutral-600 text-[12px]">
                  €{e.oldPrice}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
