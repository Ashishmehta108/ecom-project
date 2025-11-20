"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "../giobal/Container";
import { ChevronRight } from "lucide-react";

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
  return (
    <section className="w-full py-16 sm:py-24 bg-white dark:bg-neutral-950">
      <Container>
        <div className="flex flex-row justify-between items-center gap-6 mb-12 sm:mb-16">
          <div>
            <h2 className="text-[26px] sm:text-[32px] font-[550] text-neutral-900 dark:text-neutral-50 leading-tight tracking-[-0.02em]">
              <span className="text-neutral-800 font-bold">
                 Categories
              </span>
            </h2>

            <div className="mt-3 w-12 h-[1.5px] bg-neutral-900/20 dark:bg-neutral-100/20" />
          </div>
          <Link
            href="/products?sort=featured"
            className="
              inline-flex items-center gap-2 text-sm text-neutral-500
            "
          >
            See All
            <div className="bg-gray-100 w-8 h-8 text-neutral-900 flex items-center rounded-full  justify-center">
              <ChevronRight className="w-4 h-4  " strokeWidth={2.6} />
            </div>
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-12 sm:gap-16">
          {categories.map((cat) => (
            <Link
              href={`/products?category=${cat.id}`}
              key={cat.id}
              className="
                group flex flex-col items-center cursor-pointer
              "
            >
              <div
                className="
                  relative
                  w-[120px] h-[120px] sm:w-[140px] sm:h-[140px]
                  rounded-full
                  bg-neutral-50 dark:bg-neutral-900
                  border border-neutral-200/50 dark:border-neutral-800/50
                  flex items-center justify-center
                  overflow-hidden
                  transition-all duration-300 ease-out
                  group-hover:border-neutral-300/60 dark:group-hover:border-neutral-700/60
                  group-hover:bg-neutral-100/50 dark:group-hover:bg-neutral-800/50
                  group-hover:scale-[1.02]
                "
                style={{
                  boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.03)",
                }}
              >
                <Image
                  src={cat.imageUrl}
                  width={100}
                  height={100}
                  unoptimized
                  alt={cat.name}
                  className="
                    object-contain w-[65%] h-[65%]
                    transition-all duration-300 ease-out
                    group-hover:scale-105
                    opacity-90 group-hover:opacity-100
                  "
                />
              </div>

              <p
                className="
                  mt-4 text-[13px] sm:text-[14px] font-[500]
                  text-neutral-600 dark:text-neutral-400
                  tracking-[-0.01em]
                  transition-colors duration-200
                  group-hover:text-neutral-900 dark:group-hover:text-neutral-200
                "
              >
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
