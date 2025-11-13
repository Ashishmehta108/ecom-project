"use client";

import { ArrowDown2 } from "iconsax-reactjs";
import Container from "../giobal/Container";
import { useState } from "react";

export default function CategoriesBar() {
  const categories = [
    "Groceries",
    "Premium Fruits",
    "Home & Kitchen",
    "Fashion",
    "Electronics",
    "Beauty",
    "Home Improvement",
    "Sports, Toys & Luggage",
  ];

  const [selected, setSelected] = useState("Groceries");

  return (
    <div className="w-full bg-white dark:bg-transparent border-b border-gray-100 dark:border-neutral-800">
      <Container>
        <div
          className="
            flex items-center gap-3
            py-2
            overflow-x-auto hide-scrollbar
            whitespace-nowrap
            justify-start md:justify-center
          "
        >
          {categories.map((cat) => {
            const isSelected = selected === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelected(cat)}
                className={`
                  flex items-center gap-1 
                  px-4 py-1.5
                  rounded-full text-sm font-medium
                  transition-all duration-150
                  whitespace-nowrap
                  ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white text-black hover:bg-blue-200 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
                  }
                `}
                style={{ height: "34px" }} // 👈 ensures perfect alignment
              >
                {cat}
                <ArrowDown2
                  size="14"
                  variant="Bold"
                  className={isSelected ? "text-white" : "text-blue-600 dark:text-blue-400"}
                />
              </button>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
