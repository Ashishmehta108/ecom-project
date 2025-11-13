"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "../giobal/Container";

export default function TopCategoriesSection() {
  const categories = [
    {
      name: "Mobile",
      image:
        "https://m.media-amazon.com/images/I/41REratdlNL._SY300_SX300_QL70_FMwebp_.jpg",
    },
    {
      name: "Cosmetics",
      image: "https://m.media-amazon.com/images/I/51V7L+b5HjL._SX522_.jpg",
    },
    {
      name: "Electronics",
      image:
        "https://m.media-amazon.com/images/I/41E9oMhZqoL._SX300_SY300_QL70_FMwebp_.jpg",
    },
    {
      name: "Furniture",
      image: "https://m.media-amazon.com/images/I/71pYGgxn9sL._SX569_.jpg",
    },
    {
      name: "Watches",
      image:
        "https://m.media-amazon.com/images/I/41SEpNjVqlL._SX300_SY300_QL70_FMwebp_.jpg",
    },
    {
      name: "Decor",
      image: "https://m.media-amazon.com/images/I/61Y5QZnQdzL._SX522_.jpg",
    },
    {
      name: "Accessories",
      image: "https://m.media-amazon.com/images/I/71oZUs4vQbL._SX522_.jpg",
    },
  ];

  return (
    <div className="w-full mt-25">
      <Container>
        {/* ⭐ Section Header */}
<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <h2 className="text-[22px] sm:text-[26px] font-semibold text-neutral-800 dark:text-neutral-100">
            Shop From{" "}
            <span className="text-blue-600 dark:text-blue-400">
              Top Categories
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
        <div className="w-full h-[2px] bg-blue-500/70 dark:bg-blue-400/60 rounded-full mb-8"></div>

        {/* ⭐ Categories List */}
        <div
          className="
            flex flex-wrap justify-center 
            gap-8 sm:gap-12
            pb-4
          "
        >
          {categories.map((cat, i) => (
            <div
              key={i}
              className="
                flex flex-col items-center
                cursor-pointer
                group
              "
            >
              {/* Circle Image */}
              <div
                className="
    w-[110px] h-[110px] sm:w-[130px] sm:h-[130px]
    rounded-full bg-neutral-100 dark:bg-neutral-800
    border-2 border-transparent 
    group-hover:border-blue-500 dark:group-hover:border-blue-400
    shadow-sm
    flex items-center justify-center
    transition-all

    overflow-hidden       
  "
              >
                <Image
                  src={cat.image}
                  width={100}
                  height={100}
                  unoptimized
                  alt={cat.name}
                  className="
      object-contain w-[70%] h-[70%]
      transition-transform duration-200
      group-hover:scale-110

      rounded-full 
    "
                />
              </div>

              {/* Label */}
              <p className="mt-3 text-sm sm:text-base font-medium text-neutral-800 dark:text-neutral-200">
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
