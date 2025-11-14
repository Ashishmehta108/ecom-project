"use client";

import { Input } from "../ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect } from "react";
import Image from "next/image";
import { SearchNormal1 } from "iconsax-reactjs"; // 🔥 ADDED ICON

type SearchProduct = {
  id: string;
  name: string;
  company: string;
  type: string;
  areaOfUse: string;
  description: string;
  featured: boolean;
  image: string;
  price: number;
};

function NavSearch() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [search, setSearch] = useState(searchParams.get("search")?.toString() || "");
  const [products, setProducts] = useState<SearchProduct[]>([]);

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set("search", value);
    else params.delete("search");
    replace(`/products?${params.toString()}`);
  }, 300);

  const fetchSuggestions = useDebouncedCallback(async (query: string) => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }
    const res = await fetch(`/api/prods?search=${query}`);
    const data = await res.json();
    setProducts(data);
  }, 500);

  useEffect(() => {
    if (!searchParams.get("search")) setSearch("");
  }, [searchParams.get("search")]);

  return (
    <div className="w-full px-3 sm:px-6 mt-3 sm:mt-4 flex flex-col items-center z-30 mb-5">
      
      {/* 🔹 Search Wrapper */}
      <div className="w-full sm:max-w-[600px] relative flex items-center">

        {/* 🔥 Search Icon (added) */}
        <SearchNormal1
          size="18"
          className="absolute left-4 text-gray-500 dark:text-gray-300"
        />

        <Input
          type="search"
          placeholder="Search for products..."
          className="
            w-full rounded-md  border border-gray-300 
            bg-white text-gray-800 text-sm sm:text-base 
             px-4 pl-11
            focus:ring-2 focus:ring-gray-400 focus:outline-none
            transition-all
            lg:py-5

            shadow-none   
            dark:border-0   
            focus-visible:ring-0 
            focus-visible:outline-neutral-100
            focus-visible:ring-offset-0
            dark:bg-neutral-900
          "
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleSearch(e.target.value);
            fetchSuggestions(e.target.value);
          }}
        />
      </div>

      {/* 🔹 Dropdown suggestions */}
      {search.length > 0 && products.length > 0 && (
        <div
          className="
            w-full sm:max-w-[600px] bg-white dark:bg-neutral-900 
            rounded-xl mt-2 overflow-y-auto max-h-[300px]

            border border-gray-200    /* Light border */
            dark:border-0             /* 🔥 Remove border in dark */

            shadow-none dark:shadow-none  /* 🔥 Remove shadow in both modes */
          "
        >
          {products.map((product) => (
            <a
              key={product.id}
              href={`/products/${product.id}`}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
            >
              <div className="relative w-12 h-12 rounded-md bg-gray-50 dark:bg-neutral-800 overflow-hidden flex-shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="100vw"
                  className="object-contain p-1"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="text-gray-800 dark:text-gray-100 text-sm font-semibold line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  ₹{product.price.toFixed(2)}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default NavSearch;
