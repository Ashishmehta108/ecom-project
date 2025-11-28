"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "../giobal/Container";
import { ChevronRight } from "lucide-react";
import FavoriteButton from "../favourites/favoritebutton";

export default function TopEarbudsSectionClient({
  earbuds,
}: {
  earbuds: any[];
}) {
  return (
    <section className="w-full py-12 bg-white dark:bg-neutral-950">
      <Container>
        {/* HEADER */}
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-neutral-50 tracking-tight">
            Top Earbuds
          </h2>

          <Link
            href="/products?category=m2A9BCDELvjQDvWUZQjEq"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors flex items-center gap-1 group"
          >
            See All
            <div className="flex items-center justify-center w-6 h-6  rounded-xl bg-neutral-100">
              <ChevronRight className="w-4 h-4 bg-neutral-100 transition-transform group-hover:translate-x-0.5" />
            </div>{" "}
          </Link>
        </div>

        {/* CARD SLIDER */}
        <div
          className="
            flex gap-5
            overflow-x-auto
            snap-x snap-mandatory

            hide-scrollbar 
          
          "
        >
            {earbuds.map((e) => (
              <Link
                href={`/products/${e.id}`}
                key={e.id}
                className="
                  group
                  w-[160px] sm:w-[200px]
                  flex-shrink-0
                  snap-start
                  rounded-2xl
                  bg-neutral-50  hover:bg-[#F5F5F5] dark:bg-neutral-900
                  border border-neutral-200
                  overflow-hidden
                  transition-all duration-300 ease-in-out
                "
              >
                <div className="relative w-full  dark:bg-neutral-950 p-3 rounded-[20px] flex items-center justify-center">
                  <Image
                    src={e.image}
                    alt={e.name}
                    width={400}
                    height={400}
                    unoptimized
                    className=" mix-blend-multiply  object-contain w-full h-full"
                  />

                  {/* HEART ICON */}
                  {/* <div
                    className="
                      absolute top-2 right-2
                      w-7 h-7
                      rounded-full
                      bg-white dark:bg-neutral-800
                      shadow
                      flex items-center justify-center
                    "
                  >
              <Heart className="text-neutral-600 w-4 h-4"/>
                  </div> */}
                   <FavoriteButton
                  
                  product={e}
                  />
              

                  {/* DISCOUNT BADGE */}
                  {e.discount > 0 && (
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
                      {e.discount}% OFF
                    </span>
                  )}
                </div>

                {/* TEXT */}
                <div className="px-3 pt-3 pb-4">
                  <h3 className="text-[13px] font-medium text-neutral-900 dark:text-neutral-100 leading-tight line-clamp-1">
                    {e.name}
                  </h3>

             {/* PRICE SECTION */}
<div className="flex items-center gap-2 mt-1">
  {/* NEW PRICE (calculated after discount) */}
  <span className="text-[15px] font-bold text-neutral-900 dark:text-neutral-50">
    €{(e.price - (e.price * e.discount) / 100).toFixed(2)}
  </span>

  {/* OLD PRICE */}
  {e.discount > 0 && (
    <span className="line-through text-neutral-400 dark:text-neutral-600 text-[12px]">
      €{e.price}
    </span>
  )}
</div>

                </div>
              </Link>
            ))}
        </div>
      </Container>
    </section>
  );
}
