"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/app/context/languageContext";
import { getTranslatedText } from "@/lib/utils/language";

type CategoryFilterProps = {
  categories: Array<{ id: string; name: string | { en: string; pt: string }; count: number }>;
  activeCategory: string;
};

export function CategoryFilter({
  categories,
  activeCategory,
}: CategoryFilterProps) {
  const searchParams = useSearchParams();
  const { locale } = useLanguage();

  const createHref = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("page");

    if (categoryId === "all") {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }

    const query = params.toString();
    return query ? `/products?${query}` : "/products";
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={createHref("all")}
        aria-current={activeCategory === "all" ? "page" : undefined}
        className={[
          "rounded-full border px-4 py-2 text-sm font-medium transition-all",
          activeCategory === "all"
            ? "border-indigo-500 bg-indigo-500 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
            : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-600",
        ].join(" ")}
      >
        {locale === "pt" ? "Todos" : "All"}
      </Link>

      {categories.map((category) => {
        const isActive = activeCategory === category.id;
        const categoryName = typeof category.name === 'string' 
          ? category.name 
          : getTranslatedText(category.name, locale);

        return (
          <Link
            key={category.id}
            href={createHref(category.id)}
            aria-current={isActive ? "page" : undefined}
            className={[
              "rounded-full border px-4 py-2 text-sm font-medium transition-all",
              isActive
                ? "border-indigo-500 bg-indigo-500 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-600",
            ].join(" ")}
          >
            {categoryName}
            <span className="ml-1.5 text-xs opacity-60">
              ({category.count})
            </span>
          </Link>
        );
      })}
    </div>
  );
}

type SortFilterProps = {
  activeSort: string;
};

export function SortFilter({ activeSort }: SortFilterProps) {
  const searchParams = useSearchParams();
  const { locale } = useLanguage();

  const sortOptions = [
    { label: locale === "pt" ? "Em Destaque" : "Featured", value: "featured" },
    { label: locale === "pt" ? "Mais Recente" : "Newest", value: "newest" },
    { label: locale === "pt" ? "Preço: Menor para Maior" : "Price: Low to High", value: "price-asc" },
    { label: locale === "pt" ? "Preço: Maior para Menor" : "Price: High to Low", value: "price-desc" },
    { label: locale === "pt" ? "Nome: A a Z" : "Name: A to Z", value: "name-asc" },
  ];

  const createHref = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("page");

    if (sortValue === "featured") {
      params.delete("sort");
    } else {
      params.set("sort", sortValue);
    }

    const query = params.toString();
    return query ? `/products?${query}` : "/products";
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        {locale === "pt" ? "Ordenar" : "Sort"}
      </span>

      <div className="flex flex-wrap gap-2">
        {sortOptions.map((option) => {
          const isActive = activeSort === option.value;

          return (
            <Link
              key={option.value}
              href={createHref(option.value)}
              aria-current={isActive ? "page" : undefined}
              className={[
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
                isActive
                  ? "border-indigo-500 bg-indigo-500 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                  : "border-neutral-300 bg-white text-neutral-600 hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-600",
              ].join(" ")}
            >
              {option.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
