"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "../giobal/Container";

type Category = {
  id: string;
  name: string;
  imageUrl: string;
};

export default function TopCategoriesSection({
  categories,
}: {
  categories: Category[];
}) {
  console.log("Categories:", categories);
  return (
    <section className="w-full py-12 sm:py-16 bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950">
      <Container>
        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
          <div>
            <h2 className="text-[24px] sm:text-[30px] font-semibold text-neutral-900 dark:text-neutral-100 leading-snug">
              Shop From{" "}
              <span className="text-blue-600 dark:text-blue-400">
                Top Categories
              </span>
            </h2>

            {/* soft underline */}
            <div className="mt-2 w-32 h-[3px] rounded-full bg-gradient-to-r from-blue-500 to-blue-300 dark:from-blue-400 dark:to-blue-500" />
          </div>

          {/* CTA Button */}
          <Link
            href="/products?category=smartphones"
            className="
              bg-blue-600 dark:bg-blue-500
              text-white px-4 py-2
              rounded-full text-sm font-medium
              shadow-sm hover:shadow-md
              hover:bg-blue-700 dark:hover:bg-blue-600
              transition-all
            "
          >
            View All →
          </Link>
        </div>

        {/* Categories */}
        <div
          className="
            flex flex-wrap justify-center
            gap-8 sm:gap-12 pt-2
          "
        >
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="
                flex flex-col items-center group cursor-pointer
                transition-all
              "
            >
              {/* Outer ring hover effect */}
              <div
                className="
                p-[3px] rounded-full
               hover:bg-blue-400
                transition-all shadow-sm
              "
              >
                <div
                  className="
                    w-[110px] h-[110px] sm:w-[130px] sm:h-[130px]
                    rounded-full bg-white dark:bg-neutral-900
                    shadow-sm flex items-center justify-center
                    overflow-hidden transition-all
                  "
                >
                  <Image
                    src={cat.imageUrl}
                    width={100}
                    height={100}
                    unoptimized
                    alt={cat.name}
                    className="
                      object-contain w-[70%] h-[70%]
                      transition-transform duration-300
                      group-hover:scale-110
                    "
                  />
                </div>
              </div>

              {/* Label */}
              <p className="mt-3 text-sm sm:text-base font-medium text-neutral-800 dark:text-neutral-200 tracking-wide">
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

  // const categories = [
  //   {
  //     name: "Mobile",
  //     image:
  //       "https://m.media-amazon.com/images/I/41REratdlNL._SY300_SX300_QL70_FMwebp_.jpg",
  //   },
  //   {
  //     name: "Cosmetics",
  //     image: "https://m.media-amazon.com/images/I/51V7L+b5HjL._SX522_.jpg",
  //   },
  //   {
  //     name: "Electronics",
  //     image:
  //       "https://m.media-amazon.com/images/I/41E9oMhZqoL._SX300_SY300_QL70_FMwebp_.jpg",
  //   },
  //   {
  //     name: "Furniture",
  //     image: "https://m.media-amazon.com/images/I/71pYGgxn9sL._SX569_.jpg",
  //   },
  //   {
  //     name: "Watches",
  //     image:
  //       "https://m.media-amazon.com/images/I/41SEpNjVqlL._SX300_SY300_QL70_FMwebp_.jpg",
  //   },
  //   {
  //     name: "Decor",
  //     image: "https://m.media-amazon.com/images/I/61Y5QZnQdzL._SX522_.jpg",
  //   },
  //   {
  //     name: "Accessories",
  //     image: "https://m.media-amazon.com/images/I/71oZUs4vQbL._SX522_.jpg",
  //   },
  // ];
