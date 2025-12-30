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

export default function TopCategoriesSection({ categories }: { categories: Category[] }) {
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
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -340 : 340,
      behavior: "smooth",
    });
  };

  if (!categories?.length) return null;

  return (
    <section className="w-full md:py-14 py-10 bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-neutral-50 tracking-tight">
            {locale === "pt" ? "Categorias" : "Shop by Category"}
          </h2>

          <Link
            href="/products"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1"
          >
            {locale === "pt" ? "Ver tudo" : "View All"}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* CAROUSEL */}
        <div className="relative group">
          
          {/* Arrows */}
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 
                         opacity-0 group-hover:opacity-100 transition 
                         bg-white/70 dark:bg-neutral-900/70 
                         backdrop-blur-lg shadow-lg border border-neutral-200 dark:border-neutral-800
                         w-10 h-10 rounded-full flex items-center justify-center"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4
                         opacity-0 group-hover:opacity-100 transition
                         bg-white/70 dark:bg-neutral-900/70 
                         backdrop-blur-lg shadow-lg border border-neutral-200 dark:border-neutral-800 
                         w-10 h-10 rounded-full flex items-center justify-center"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Items */}
          <div
            ref={scrollRef}
            onScroll={checkScrollButtons}
            className="flex gap-5 overflow-x-auto scrollbar-none scroll-smooth pb-2 select-none"
          >
            {categories.map((cat) => (
              <Link key={cat.id} href={`/products?category=${cat.id}`} draggable={false}>
                <div className=" scrollbar-none  cursor-pointer w-[140px] md:w-[160px] flex flex-col items-center">
                  <div className="relative w-full h-[170px] md:h-[185px] 
                                  rounded-xl overflow-hidden shrink-0
                                  bg-gradient-to-br from-neutral-50 to-neutral-100 
                                  dark:from-neutral-900 dark:to-neutral-800
                                  border border-neutral-200 dark:border-neutral-800
                                  shadow-sm transition-all duration-300 
                                   group-hover:shadow-lg">
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name[locale]}
                      draggable={false}
                      fill
                      className="object-contain mix-blend-multiply p-3"
                    />
                  </div>

                  <span className="mt-3 text-xs md:text-sm font-medium text-neutral-800 dark:text-neutral-100 text-center line-clamp-2">
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
