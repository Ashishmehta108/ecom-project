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
    <section className="w-full py-10 bg-white dark:bg-neutral-950">
      <Container>
        {/* HEADER */}
        <div className="flex justify-between items-center gap-6 mb-12 sm:mb-16">
          <div className="group w-fit">
            <h2 className="text-[26px] sm:text-5xl font-[550] leading-tight tracking-[-0.02em] text-neutral-900 dark:text-neutral-50">
              <span className={`${merriweather.className} text-neutral-800 dark:text-neutral-200`}>
                Categories
              </span>
            </h2>

            {/* UNIFIED UNDERLINE */}
            <div
              className="
                mt-2 h-[3px] w-full
                rounded-full
                bg-gradient-to-r
                from-lime-400/90 via-lime-500 to-lime-400/90
                dark:from-neutral-200/30 dark:via-neutral-300/30 dark:to-neutral-200/30
                transition-all duration-500
                group-hover:w-[115%]
              "
            />
          </div>

          <Link
            href="/products?sort=featured"
            className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
          >
            See All
            <div className="bg-neutral-100 dark:bg-neutral-800 w-8 h-8 flex items-center justify-center rounded-full">
              <ChevronRight className="w-4 h-4" strokeWidth={2.6} />
            </div>
          </Link>
        </div>

        {/* CATEGORY GRID */}
        <div className="flex flex-wrap justify-center gap-12 sm:gap-16">
          {categories.map((cat) => (
            <Link
              href={`/products?category=${cat.id}`}
              key={cat.id}
              className="group flex flex-col items-center cursor-pointer"
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
                  group-hover:border-neutral-300 dark:group-hover:border-neutral-700
                  group-hover:bg-neutral-100 dark:group-hover:bg-neutral-800
                  group-hover:scale-[1.03]
                "
              >
                <Image
                  src={cat.imageUrl}
                  width={100}
                  height={100}
                  unoptimized
                  alt={cat.name}
                  className="
                    object-contain w-[65%] h-[65%]
                    transition-all duration-300
                    opacity-90 group-hover:opacity-100
                    group-hover:scale-105
                  "
                />
              </div>

              <p
                className="
                  mt-4 text-[13px] sm:text-[14px] font-[500]
                  text-neutral-600 dark:text-neutral-400
                  group-hover:text-neutral-900 dark:group-hover:text-neutral-200
                  transition-colors
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
