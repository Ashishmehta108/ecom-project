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

        <div className="w-full h-[2px] bg-blue-500/70 dark:bg-blue-400/60 rounded-full mb-6"></div>

        <div
          className="
            flex gap-4 sm:gap-6
            overflow-x-auto hide-scrollbar pb-4
pt-5
            justify-start
            
          "
        >
          {products.map((p) => (
            <div
              key={p.id}
              className="
            min-w-[200px] sm:min-w-[240px]
            cursor-pointer
            transition-all duration-300 ease-out
            overflow-visible select-none
        
            hover:scale-[1.03]
            hover:-translate-y-1
            hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)]
          "
            >
              <div
                className="
              rounded-2xl border
              bg-white/95 backdrop-blur-sm 
              border-neutral-200/70
              dark:bg-neutral-900/90 dark:border-neutral-700/70
              shadow-sm
              transition-all duration-300
              overflow-hidden
            "
              >
                {/* Image */}
                <div
                  className="
                relative w-full 
                h-[170px] sm:h-[200px] 
                flex items-center justify-center 
                bg-neutral-50 dark:bg-neutral-800/60
                rounded-t-2xl
                overflow-hidden
              "
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={220}
                    height={220}
                    unoptimized
                    className="
                  object-contain max-h-full transition-transform duration-300
                  group-hover:scale-110
                "
                  />

                  {/* Badge */}
                  <div
                    className="
                  absolute top-2 right-2 
                  bg-blue-600 dark:bg-blue-500
                  text-white 
                  text-[11px] sm:text-xs font-semibold
                  px-2.5 py-1 rounded-full
                  shadow-md
                "
                  >
                    {p.discount}% OFF
                  </div>
                </div>

                {/* Details */}
                <div className="px-3.5 sm:px-4 py-3.5">
                  <h3
                    className="
                font-medium mb-1 line-clamp-1 
                text-[13px] sm:text-[15px]
                text-neutral-900 dark:text-neutral-200
              "
                  >
                    {p.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="
                  font-semibold 
                  text-neutral-900 dark:text-white
                  text-[14px] sm:text-[15px]
                "
                    >
                      ₹{p.price}
                    </span>

                    <span
                      className="
                  line-through text-neutral-400 dark:text-neutral-500
                  text-[11px] sm:text-[12px]
                "
                    >
                      ₹{p.oldPrice}
                    </span>
                  </div>

                  <p
                    className="
                text-green-600 dark:text-green-400 
                font-medium text-[12px] sm:text-[13px]
              "
                  >
                    Save ₹{p.savings}
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
