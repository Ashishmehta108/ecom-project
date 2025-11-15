"use client";

import { Input } from "../ui/input";
import { useState } from "react";
import { SearchNormal1 } from "iconsax-reactjs";
import Image from "next/image";

export default function NavSearch() {
  const [search, setSearch] = useState("");

  return (
    <div className="w-full px-3 sm:px-6 mt-3 sm:mt-4 flex flex-col items-center z-30 mb-5">
      
      {/* 🔹 Search Wrapper */}
      <div className="w-full sm:max-w-[600px] relative flex items-center">

        {/* 🔥 Search Icon */}
        <SearchNormal1
          size="18"
          className="
            absolute left-4 
            text-gray-500 dark:text-gray-300
          "
        />

        <Input
          type="search"
          placeholder="Search products..."
          className="
            w-full rounded-md  
            border border-gray-300 dark:border-neutral-700
            bg-white dark:bg-neutral-900 
            text-gray-800 dark:text-gray-200

            text-sm sm:text-base 
            px-4 pl-11 lg:py-5

            focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
            focus:outline-none
            transition-all
          "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>


    </div>
  );
}
