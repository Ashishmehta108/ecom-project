// "use client";

// import { ArrowDown2 } from "iconsax-reactjs";
// import Container from "../giobal/Container";
// import { useState, useRef, useEffect } from "react";
// import clsx from "clsx";

// export default function CategoriesBar() {
//   const categories = [
//     "Groceries",
//     "Premium Fruits",
//     "Home & Kitchen",
//     "Fashion",
//     "Electronics",
//     "Beauty",
//     "Home Improvement",
//     "Sports, Toys & Luggage",
//   ];

//   const [selected, setSelected] = useState("Groceries");
//   const scrollRef = useRef<HTMLDivElement>(null);

//   // Scroll selected item into view smoothly
//   useEffect(() => {
//     const el = scrollRef.current?.querySelector(`[data-cat="${selected}"]`);
//     el?.scrollIntoView({ inline: "center", behavior: "smooth" });
//   }, [selected]);

//   return (
//     <div className="relative w-full bg-white dark:bg-transparent border-b border-gray-100 dark:border-neutral-800">
//       <Container>
//       <div
//   ref={scrollRef}
//   className="
//     flex items-center gap-3
//     py-2

//     overflow-x-auto
//     overflow-y-hidden
//     whitespace-nowrap
//     scroll-smooth
//     hide-scrollbar
//     pl-3 sm:pl-4 
//     md:justify-start  
//   "
// >
//   {categories.map((cat) => {
//     const isSelected = selected === cat;

//     return (
//       <button
//         key={cat}
//         data-cat={cat}
//         onClick={() => setSelected(cat)}
//         className={clsx(
//           "flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 whitespace-nowrap select-none",

//           isSelected
//             ? "bg-blue-600 text-white shadow-sm"
//             : "bg-neutral-100 text-black hover:bg-neutral-200 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800"
//         )}
//         style={{ height: "34px" }}
//       >
//         {cat}
//         <ArrowDown2
//           size="14"
//           variant="Bold"
//           className={isSelected ? "text-white" : "text-blue-600 dark:text-blue-400"}
//         />
//       </button>
//     );
//   })}
// </div>

//       </Container>
//     </div>
//   );
// }



"use client";

import { ChevronDown } from "lucide-react";
import Container from "../global/Container";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll selected item into view smoothly
  useEffect(() => {
    const el = scrollRef.current?.querySelector(`[data-cat="${selected}"]`);
    el?.scrollIntoView({ inline: "center", behavior: "smooth" });
  }, [selected]);

  return (
    <div className="relative w-full bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
      <Container>
        <div
          ref={scrollRef}
          className="flex items-center gap-2 py-2 overflow-x-auto overflow-y-hidden whitespace-nowrap scroll-smooth hide-scrollbar pl-2 sm:pl-0 md:justify-start"
          role="tablist"
          aria-label="Product categories"
        >
          {categories.map((cat) => {
            const isSelected = selected === cat;

            return (
              <button
                key={cat}
                data-cat={cat}
                onClick={() => setSelected(cat)}
                role="tab"
                aria-selected={isSelected}
                className={clsx(
                  "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap select-none",
                  isSelected
                    ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
                    : "bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                )}
              >
                {cat}
                <ChevronDown
                  size={14}
                  className={clsx(
                    "transition-colors duration-200",
                    isSelected
                      ? "text-white dark:text-neutral-900"
                      : "text-neutral-600 dark:text-neutral-400"
                  )}
                />
              </button>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
