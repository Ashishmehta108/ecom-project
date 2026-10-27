"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getTranslatedText } from "@/lib/utils/language";

type CategoryFilterProps = {
  categories: Array<{ id: string; name: string | { en: string; pt: string }; count: number }>;
  activeCategory: string;
  lang: "en" | "pt";
};

export function CategoryFilter({
  categories,
  activeCategory,
  lang = "en",
}: CategoryFilterProps) {
  const searchParams = useSearchParams();

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
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
      {categories.map((category) => {
        const isActive = activeCategory === category.id;
        const categoryName = typeof category.name === 'string' 
          ? category.name 
          : getTranslatedText(category.name, lang);

        return (
          <Link
            key={category.id}
            href={createHref(category.id)}
            aria-current={isActive ? "page" : undefined}
            className={[
              "shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-all sm:px-4 sm:py-2 sm:text-sm",
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
  lang: "en" | "pt";
};

export function SortFilter({ activeSort, lang }: SortFilterProps) {
  const searchParams = useSearchParams();
  lang = lang === "pt" ? "pt" : "en";
  const sortOptions = [
    { label: lang === "pt" ? "Em Destaque" : "Featured", value: "featured" },
    { label: lang === "pt" ? "Mais Recente" : "Newest", value: "newest" },
    { label: lang === "pt" ? "Preço: Menor para Maior" : "Price: Low to High", value: "price-asc" },
    { label: lang === "pt" ? "Preço: Maior para Menor" : "Price: High to Low", value: "price-desc" },
    { label: lang === "pt" ? "Nome: A a Z" : "Name: A to Z", value: "name-asc" },
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
      <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
        {lang === "pt" ? "Ordenar" : "Sort"}
      </span>

      <div className="-mr-4 flex gap-2 overflow-x-auto pr-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mr-0 sm:flex-wrap sm:overflow-visible sm:pr-0">
        {sortOptions.map((option) => {
          const isActive = activeSort === option.value;

          return (
            <Link
              key={option.value}
              href={createHref(option.value)}
              aria-current={isActive ? "page" : undefined}
              className={[
                "shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
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
