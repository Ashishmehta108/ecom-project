"use client";

import { Input } from "../ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect } from "react";
import Image from "next/image";
import { SearchFavorite, SearchFavorite1, SearchNormal, SearchNormal1, SearchStatus } from "iconsax-reactjs";

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

<div className="w-full relative  sm:max-w-[600px]">
  {/* Search Status Icon */}
  <div className="absolute left-[26%] top-1/2 -translate-y-1/2 translate-x-1/2 text-neutral-400">
    <SearchNormal1 />
  </div>

  <Input
    type="search"
    placeholder="Search for products..."
    className="w-full rounded-lg py-6 border placeholder:text-base text-center border-gray-300 dark:border-neutral-700 bg-gray-200 dark:bg-neutral-900  pl-10 pr-4 text-[15px] text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-neutral-300 dark:focus-visible:ring-neutral-700 focus-visible:outline-none transition-all duration-200 shadow-sm hover:shadow-md"
    value={search}
    onChange={(e) => {
      setSearch(e.target.value);
      handleSearch(e.target.value);
      fetchSuggestions(e.target.value);
    }}
  />
</div>
 
      {search.length > 0 && products.length > 0 && (
        <div className="w-full sm:max-w-[600px] bg-white border border-gray-200 rounded-xl mt-2 shadow-lg overflow-y-auto max-h-[300px]">
          {products.map((product) => (
            <a
              key={product.id}
              href={`/products/${product.id}`}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 transition"
            >
              <div className="relative w-12 h-12 rounded-md bg-gray-50 overflow-hidden flex-shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="100vw"
                  className="object-contain p-1"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="text-gray-800 text-sm font-semibold line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-500 text-xs mt-1">₹{product.price.toFixed(2)}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default NavSearch;
