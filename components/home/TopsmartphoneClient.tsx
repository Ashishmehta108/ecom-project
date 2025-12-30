"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "../giobal/Container";
import { ChevronRight } from "lucide-react";
import FavoriteButton from "../favourites/favoritebutton";
import { useLanguage } from "@/app/context/languageContext";
import { getTranslatedText } from "@/lib/utils/language";
import { useMemo } from "react";

export default function TopSmartphonesSectionClient({
  smartphones,
}: {
  smartphones: any[];
}) {
  const { locale } = useLanguage();

  // Resolve multilingual product names
  const resolvedSmartphones = useMemo(() => {
    return smartphones.map((p) => ({
      ...p,
      name: typeof p.name === 'string' ? p.name : getTranslatedText(p.name, locale),
    }));
  }, [smartphones, locale]);

  return (
    <section className="w-full py-12 bg-white dark:bg-neutral-950">
      <Container>
        {/* HEADER */}
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-neutral-50 tracking-tight">
            {locale === "pt" ? "Melhores Smartphones" : "Top Smartphones"}
          </h2>

          <Link
            href="/products?category=Phones"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors flex items-center gap-1 group"
          >
            {locale === "pt" ? "Ver Todos" : "See All"}
            <div className="flex items-center justify-center w-6 h-6 rounded-xl bg-neutral-100 dark:bg-neutral-800">
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>

        {/* SLIDER */}
        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory hide-scrollbar">
          {resolvedSmartphones.map((p) => {
            const finalPrice = (p.price - (p.price * p.discount) / 100).toFixed(
              2
            );

            return (
              <Link
                href={`/products/${p.id}`}
                key={p.id}
                className="
                  group
                  w-[160px] sm:w-[200px]
                  flex-shrink-0
                  snap-start
                  rounded-2xl
                  bg-neutral-50 hover:bg-[#F5F5F5] dark:bg-neutral-900
                  border border-neutral-200 dark:border-neutral-800
                  overflow-hidden
                  transition-all duration-300
                "
              >
                {/* IMAGE */}
                <div className="relative p-3 rounded-[20px] dark:bg-neutral-950 flex items-center justify-center">
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={300}
                    height={300}
                    unoptimized
                    className="object-contain mix-blend-multiply w-full h-full"
                  />

                  <FavoriteButton product={p} />

                  {p.discount > 0 && (
                    <span className="absolute bottom-2 left-2 bg-indigo-500 text-white text-[11px] px-2 py-0.5 rounded-full">
                      {p.discount}% {locale === "pt" ? "DESCONTO" : "OFF"}
                    </span>
                  )}
                </div>

                {/* TEXT */}
                <div className="px-3 pt-3 pb-4">
                  <h3 className="text-[13px] font-medium text-neutral-900 dark:text-neutral-100 leading-tight line-clamp-1">
                    {p.name}
                  </h3>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[15px] font-bold text-neutral-900 dark:text-neutral-50">
                      €{finalPrice}
                    </span>

                    {p.discount > 0 && (
                      <span className="line-through text-neutral-400 dark:text-neutral-600 text-[12px]">
                        €{p.price}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
