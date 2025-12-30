"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useLanguage } from "@/app/context/languageContext";

type Category = {
  id: string;
  name: { en: string; pt: string };
  imageUrl: string;
};

export default function TopCategoriesSection({
  categories,
}: {
  categories: Category[];
}) {
  const { locale } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScrollButtons = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener("resize", checkScrollButtons);
    return () => window.removeEventListener("resize", checkScrollButtons);
  }, [checkScrollButtons]);

  const scroll = (direction: "left" | "right") => {
    const scrollAmount = window.innerWidth < 768 ? 220 : 340;
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!categories?.length) return null;

  return (
    <section className="w-full py-6 md:py-14 bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-lg md:text-2xl lg:text-3xl font-semibold text-neutral-900 dark:text-neutral-50 tracking-tight">
            {locale === "pt" ? "Categorias" : "Shop by Category"}
          </h2>

          <Link
            href="/products"
            className="text-xs md:text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1"
          >
            {locale === "pt" ? "Ver tudo" : "View All"}
            <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Link>
        </div>

        {/* CAROUSEL */}
        <div className="relative group">
          {/* Arrows - Hidden on mobile */}
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 
                         opacity-0 group-hover:opacity-100 transition-opacity duration-200
                         bg-white/90 dark:bg-neutral-900/90 
                         backdrop-blur-lg shadow-lg border border-neutral-200 dark:border-neutral-800
                         w-9 h-9 lg:w-10 lg:h-10 rounded-full items-center justify-center
                         hover:bg-white dark:hover:bg-neutral-900 z-10"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4
                         opacity-0 group-hover:opacity-100 transition-opacity duration-200
                         bg-white/90 dark:bg-neutral-900/90 
                         backdrop-blur-lg shadow-lg border border-neutral-200 dark:border-neutral-800 
                         w-9 h-9 lg:w-10 lg:h-10 rounded-full items-center justify-center
                         hover:bg-white dark:hover:bg-neutral-900 z-10"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Items */}
          <div
            ref={scrollRef}
            onScroll={checkScrollButtons}
            className="flex gap-3 md:gap-4 lg:gap-5 overflow-x-auto scroll-smooth pb-2 select-none 
             scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent
             [&::-webkit-scrollbar]:hidden"
          >
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                draggable={false}
                className="shrink-0"
              >
                <div className="cursor-pointer w-[100px] sm:w-[120px] md:w-[140px] lg:w-[160px] flex flex-col items-center group/item">
                  <div
                    className="relative w-full aspect-square
                                  rounded-lg md:rounded-xl overflow-hidden
                                  bg-gradient-to-br from-neutral-50 to-neutral-100 
                                  dark:from-neutral-900 dark:to-neutral-800
                                  border border-neutral-200 dark:border-neutral-800
                                  shadow-sm transition-all duration-300 
                                  group-hover/item:shadow-md group-hover/item:scale-[1.02]"
                  >
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name[locale]}
                      draggable={false}
                      fill
                      sizes="(max-width: 640px) 100px, (max-width: 768px) 120px, (max-width: 1024px) 140px, 160px"
                      className="object-contain mix-blend-multiply p-2 md:p-3"
                    />
                  </div>

                  <span className="mt-2 md:mt-3 text-[11px] sm:text-xs md:text-sm font-medium text-neutral-800 dark:text-neutral-100 text-center line-clamp-2 leading-tight px-1">
                    {cat.name[locale]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}