"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "../giobal/Container";
import { ChevronRight } from "lucide-react";
import { Merriweather } from "next/font/google";

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400"],
});

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
      discount: 30,
      savings: 4500,
    },
    {
      id: 3,
      name: "Galaxy M33 (4GB | 64GB)",
      image:
        "https://m.media-amazon.com/images/I/41amrp7gg7L._SX342_SY445_QL70_FMwebp_.jpg",
      price: 16999,
      oldPrice: 24999,
      discount: 32,
      savings: 8000,
    },
    {
      id: 4,
      name: "Galaxy M53 (4GB | 64GB)",
      image:
        "https://m.media-amazon.com/images/I/41XfwBsC7wL._SY300_SX300_QL70_FMwebp_.jpg",
      price: 31999,
      oldPrice: 40999,
      discount: 22,
      savings: 9000,
    },
  ];

  return (
    <section className="w-full py-16 sm:py-24 bg-white dark:bg-neutral-950">
      <Container>
        {/* HEADER */}
        <div className="flex justify-between items-center mb-12 sm:mb-16">
          <div className="group w-fit">
            <h2
              className={`text-2xl sm:text-5xl font-[550] leading-tight tracking-[-0.02em] text-neutral-900 dark:text-neutral-50  `}
            >
              Best Deals on Smartphones
            </h2>

            {/* SAME UNDERLINE */}
            <div
              className="
                mt-2 h-[3px] w-full
                rounded-full
                bg-lime-500
                
               
              "
            />
          </div>

          <Link
            href="/products?category=smartphones"
            className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors whitespace-nowrap"
          >
            View All
            <div className="bg-neutral-100 dark:bg-neutral-800 w-8 h-8 flex items-center justify-center rounded-full">
              <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </div>
          </Link>
        </div>

        {/* CARD SLIDER */}
        <div
          className="
            flex gap-5 
            overflow-x-auto 
            snap-x snap-mandatory 
            hide-scrollbar 
            pb-4
          "
        >
          {products.map((p) => (
            <Link
              href={`/product/${p.id}`}
              key={p.id}
              className="
                group
                w-[190px] sm:w-[220px]
                flex-shrink-0
                snap-start
                rounded-2xl
                border border-neutral-200 dark:border-neutral-800
                bg-neutral-50 dark:bg-neutral-900
                overflow-hidden
                transition-all duration-300
                hover:border-neutral-300 dark:hover:border-neutral-700
                hover:bg-neutral-100 dark:hover:bg-neutral-800
              "
            >
              {/* IMAGE */}
              <div className="relative w-full h-[170px] sm:h-[190px] bg-white dark:bg-neutral-900 flex items-center justify-center">
                <Image
                  src={p.image}
                  alt={p.name}
                  width={200}
                  height={200}
                  unoptimized
                  className="object-contain max-h-full transition group-hover:scale-105"
                />
                <div
                  className="
                    absolute top-2 right-2
                    bg-green-600 dark:bg-blue-500
                    text-white text-[11px] sm:text-xs 
                    px-2.5 py-1 
                    rounded-full
                  "
                >
                  {p.discount}% OFF
                </div>
              </div>

              {/* CONTENT */}
              <div className="px-4 py-4">
                <h3 className="text-[14px] sm:text-[15px] font-[500] text-neutral-900 dark:text-neutral-200 line-clamp-1">
                  {p.name}
                </h3>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[15px] font-semibold text-neutral-900 dark:text-neutral-100">
                    ₹{p.price}
                  </span>
                  <span className="line-through text-neutral-400 dark:text-neutral-600 text-[12px]">
                    ₹{p.oldPrice}
                  </span>
                </div>

                <p className="text-green-600 dark:text-green-400 text-[12px] mt-1 font-medium">
                  Save ₹{p.savings}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
