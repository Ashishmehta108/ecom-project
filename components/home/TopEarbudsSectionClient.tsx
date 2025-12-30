"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "../giobal/Container";
import { ChevronRight } from "lucide-react";
import FavoriteButton from "../favourites/favoritebutton";
import { useLanguage } from "@/app/context/languageContext";
import { getTranslatedText } from "@/lib/utils/language";
import { useMemo } from "react";

export default function TopEarbudsSectionClient({
  earbuds,
}: {
  earbuds: any[];
}) {
  const { locale } = useLanguage();

  // Resolve multilingual product names
  const resolvedEarbuds = useMemo(() => {
    return earbuds.map((e) => ({
      ...e,
      name: typeof e.name === 'string' ? e.name : getTranslatedText(e.name, locale),
    }));
  }, [earbuds, locale]);

  return (
    <section className="w-full py-6 md:py-12 bg-white dark:bg-neutral-950">
      <Container>
        {/* HEADER */}
        <div className="flex items-end justify-between mb-4 md:mb-8">
          <h2 className="text-lg md:text-2xl lg:text-3xl font-semibold text-neutral-900 dark:text-neutral-50 tracking-tight">
            {locale === "pt" ? "Melhores Fones de Ouvido" : "Top Earbuds"}
          </h2>

          <Link
            href="/products?category=h7SaLkNacMSQl3ykBewqm"
            className="text-xs md:text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors flex items-center gap-1 group"
          >
            {locale === "pt" ? "Ver Todos" : "See All"}
            <div className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-lg md:rounded-xl bg-neutral-100 dark:bg-neutral-800">
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>

        {/* CARD SLIDER */}
        <div className="flex gap-3 md:gap-4 lg:gap-5 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-2">
          {resolvedEarbuds.map((e) => (
            <Link
              href={`/products/${e.id}`}
              key={e.id}
              className="group w-[130px] sm:w-[160px] md:w-[180px] lg:w-[200px] flex-shrink-0 snap-start rounded-xl md:rounded-2xl bg-neutral-50 hover:bg-neutral-100/80 dark:bg-neutral-900 dark:hover:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 overflow-hidden transition-all duration-300 ease-in-out hover:shadow-md"
            >
              {/* IMAGE CONTAINER */}
              <div className="relative w-full aspect-square dark:bg-neutral-950 p-2 md:p-3 rounded-[16px] md:rounded-[20px] flex items-center justify-center">
                <Image
                  src={e.image}
                  alt={e.name}
                  fill
                  sizes="(max-width: 640px) 130px, (max-width: 768px) 160px, (max-width: 1024px) 180px, 200px"
                  unoptimized
                  className="mix-blend-multiply object-contain p-2"
                />

                {/* FAVORITE BUTTON */}
                <FavoriteButton product={e} />

                {/* DISCOUNT BADGE */}
                {e.discount > 0 && (
                  <span className="absolute bottom-1.5 left-1.5 md:bottom-2 md:left-2 bg-indigo-500 text-white text-[10px] md:text-[11px] font-semibold px-1.5 py-0.5 md:px-2 rounded-full shadow-sm">
                    {e.discount}% {locale === "pt" ? "OFF" : "OFF"}
                  </span>
                )}
              </div>

              {/* TEXT CONTENT */}
              <div className="px-2.5 md:px-3 pt-2 md:pt-3 pb-3 md:pb-4">
                <h3 className="text-xs md:text-[13px] font-medium text-neutral-900 dark:text-neutral-100 leading-tight line-clamp-2 min-h-[32px] md:min-h-[20px]">
                  {e.name}
                </h3>

                {/* PRICE SECTION */}
                <div className="flex items-center gap-1.5 md:gap-2 mt-1">
                  {/* NEW PRICE (calculated after discount) */}
                  <span className="text-xs md:text-[15px] font-bold text-neutral-900 dark:text-neutral-50">
                    €{Number((e.price - (e.price * e.discount) / 100).toFixed(2)).toLocaleString('en-US', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </span>

                  {/* OLD PRICE */}
                  {e.discount > 0 && (
                    <span className="line-through text-neutral-400 dark:text-neutral-600 text-[11px] md:text-[12px]">
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