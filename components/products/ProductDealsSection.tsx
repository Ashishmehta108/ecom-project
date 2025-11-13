"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "../giobal/Container";

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
      savings: 32999,
    },
    {
      id: 2,
      name: "Galaxy M13 (4GB | 64GB)",
      image:
        "https://m.media-amazon.com/images/I/41Z3zn7d+JL._SY300_SX300_QL70_FMwebp_.jpg",
      price: 10499,
      oldPrice: 14999,
      discount: 56,
      savings: 4500,
    },
    {
      id: 3,
      name: "Galaxy M33 (4GB | 64GB)",
      image:
        "https://m.media-amazon.com/images/I/41amrp7gg7L._SX342_SY445_QL70_FMwebp_.jpg",
      price: 16999,
      oldPrice: 24999,
      discount: 56,
      savings: 8000,
    },
    {
      id: 4,
      name: "Galaxy M53 (4GB | 64GB)",
      image:
        "https://m.media-amazon.com/images/I/41XfwBsC7wL._SY300_SX300_QL70_FMwebp_.jpg",
      price: 31999,
      oldPrice: 40999,
      discount: 56,
      savings: 9000,
    },
  ];

  return (
    <div className="w-full mt-25">
      <Container>
        {/* ⭐ Section Header (Responsive) */}
<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <h2 className="text-[22px] sm:text-[26px] font-semibold text-neutral-800 dark:text-neutral-100">
            Grab the best deal on{" "}
            <span className="text-blue-600 dark:text-blue-400">
              Smartphones
            </span>
          </h2>

         <Link
  href="/products?category=smartphones"
  className="
    bg-blue-600 dark:bg-blue-500
    text-white
    px-3 py-1.5
    rounded-full
    text-xs sm:text-sm
    font-medium
    shadow-md
    hover:bg-blue-700 dark:hover:bg-blue-600
    transition
    w-auto              
    self-start          
  "
>
  View All →
</Link>

        </div>

        {/* ⭐ Blue Underline */}
        <div className="w-full h-[2px] bg-blue-500/70 dark:bg-blue-400/60 rounded-full mb-6"></div>

        {/* ⭐ RESPONSIVE, CENTERED, SCROLLABLE CARDS */}
        <div
          className="
            flex gap-4 sm:gap-6
            overflow-x-auto hide-scrollbar pb-4

            justify-start
            md:justify-center
          "
        >
          {products.map((p) => (
            <div
              key={p.id}
              className="
                min-w-[220px] sm:min-w-[260px]
                cursor-pointer
                transition-all duration-200
                overflow-visible

                hover:scale-[1.04]
                hover:-translate-y-1
                hover:shadow-xl
              "
            >
              {/* Card */}
              <div
                className="
                  rounded-xl border
                  bg-white border-neutral-200
                  dark:bg-neutral-900 dark:border-neutral-700
                  overflow-visible
                "
              >
                {/* Image */}
                <div
                  className="
                    relative w-full 
                    h-[180px] sm:h-[220px] 
                    flex items-center justify-center 
                    bg-white dark:bg-neutral-800

                    rounded-t-xl
                    overflow-hidden
                  "
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={200}
                    height={200}
                    unoptimized
                    className="object-contain"
                  />

                  {/* Badge */}
                  <div
                    className="
                      absolute top-0 right-0 
                      bg-blue-600 dark:bg-blue-500
                      text-white text-xs sm:text-sm px-2 py-1
                      rounded-bl-xl rounded-tr-xl
                      overflow-visible
                    "
                  >
                    {p.discount}% OFF
                  </div>
                </div>

                {/* Details */}
                <div className="px-3 sm:px-4 py-3">
                  <h3 className="font-medium mb-1 line-clamp-1 text-sm sm:text-base text-neutral-900 dark:text-neutral-200">
                    {p.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm sm:text-[15px]">
                      ₹{p.price}
                    </span>
                    <span className="line-through text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm">
                      ₹{p.oldPrice}
                    </span>
                  </div>

                  <p className="text-green-600 dark:text-green-400 font-medium text-xs sm:text-sm">
                    Save - ₹{p.savings}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
