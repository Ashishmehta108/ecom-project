// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import Container from "../giobal/Container";
// import { ChevronRight } from "lucide-react";
// import { Merriweather } from "next/font/google";

// const merriweather = Merriweather({
//   variable: "--font-merriweather",
//   subsets: ["latin"],
//   weight: ["400"],
// });

// type Category = {
//   id: string;
//   name: string;
//   imageUrl: string;
// };

// export default function TopCategoriesSection({
//   categories,
// }: {
//   categories: Category[];
// }) {
//   return (
//     <section className="w-full py-10 bg-white dark:bg-neutral-950">
//       <Container>
//         {/* HEADER */}
//         <div className="flex justify-between items-center gap-6 mb-12 sm:mb-16">
//           <div className="group w-fit">
//             <h2 className="text-[26px] sm:text-5xl  leading-tight tracking-[-0.02em] text-neutral-900 dark:text-neutral-50">
//               <span className={` text-neutral-700 font-semibold dark:text-neutral-200`}>
//                 Categories
//               </span>
//             </h2>

//             {/* UNIFIED UNDERLINE */}
//             <div
//               className="
//                 mt-2 h-[3px] w-full
//                 rounded-full
//                 bg-gradient-to-r
//                 from-lime-400/90 via-lime-500 to-lime-400/90
//                 dark:from-neutral-200/30 dark:via-neutral-300/30 dark:to-neutral-200/30
//                 transition-all duration-500
//                 group-hover:w-[115%]
//               "
//             />
//           </div>

//           <Link
//             href="/products?sort=featured"
//             className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
//           >
//             See All
//             <div className="bg-neutral-100 dark:bg-neutral-800 w-8 h-8 flex items-center justify-center rounded-full">
//               <ChevronRight className="w-4 h-4" strokeWidth={2.6} />
//             </div>
//           </Link>
//         </div>

//         {/* CATEGORY GRID */}
//         <div className="flex flex-wrap justify-center gap-12 sm:gap-16">
//           {categories.map((cat) => (
//             <Link
//               href={`/products?category=${cat.id}`}
//               key={cat.id}
//               className="group flex flex-col items-center cursor-pointer"
//             >
//               <div
//                 className="
//                   relative
//                   w-[120px] h-[120px] sm:w-[140px] sm:h-[140px]
//                   rounded-full
//                   bg-neutral-50 dark:bg-neutral-900
//                   border border-neutral-200/50 dark:border-neutral-800/50
//                   flex items-center justify-center
//                   overflow-hidden
//                   transition-all duration-300 ease-out
//                   group-hover:border-neutral-300 dark:group-hover:border-neutral-700
//                   group-hover:bg-neutral-100 dark:group-hover:bg-neutral-800
//                   group-hover:scale-[1.03]
//                 "
//               >
//                 <Image
//                   src={cat.imageUrl}
//                   width={100}
//                   height={100}
//                   unoptimized
//                   alt={cat.name}
//                   className="
//                     object-contain w-[65%] h-[65%]
//                     transition-all duration-300
//                     opacity-90 group-hover:opacity-100
//                     group-hover:scale-105
//                   "
//                 />
//               </div>

//               <p
//                 className="
//                   mt-4 text-[13px] sm:text-[14px] font-[500]
//                   text-neutral-600 dark:text-neutral-400
//                   group-hover:text-neutral-900 dark:group-hover:text-neutral-200
//                   transition-colors
//                 "
//               >
//                 {cat.name}
//               </p>
//             </Link>
//           ))}
//         </div>
//       </Container>
//     </section>
//   );
// }

"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";

type Category = {
  id: string;
  name: string;
  imageUrl: string;
};

export default function TopCategoriesSection({
  categories,
}: {
  categories: Category[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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
    if (!scrollRef.current) return;
    const scrollAmount = 320;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!scrollRef.current) return;
    e.preventDefault();
    scrollRef.current.scrollLeft += e.deltaY;
    checkScrollButtons();
  };

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-12 md:py-16 bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-neutral-50 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Explore our curated collections
            </p>
          </div>
          
          <Link
            href="/categories"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors flex items-center gap-1 group"
          >
            View All
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* SCROLLABLE CAROUSEL */}
        <div className="relative group/carousel">
          {/* LEFT ARROW */}
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="
                absolute left-0 top-1/2 -translate-y-1/2 z-10
                w-9 h-9 rounded-full
                bg-white/95 dark:bg-neutral-900/95
                backdrop-blur-sm
                shadow-sm
                border border-neutral-200/50 dark:border-neutral-800/50
                flex items-center justify-center
                opacity-0 md:group-hover/carousel:opacity-100 max-md:opacity-100
                transition-opacity duration-200
                hover:bg-neutral-50 dark:hover:bg-neutral-800
                -ml-4 max-md:ml-0
              "
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            </button>
          )}

          {/* RIGHT ARROW */}
          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="
                absolute right-0 top-1/2 -translate-y-1/2 z-10
                w-9 h-9 rounded-full
                bg-white/95 dark:bg-neutral-900/95
                backdrop-blur-sm
                shadow-sm
                border border-neutral-200/50 dark:border-neutral-800/50
                flex items-center justify-center
                opacity-0 md:group-hover/carousel:opacity-100 max-md:opacity-100
                transition-opacity duration-200
                hover:bg-neutral-50 dark:hover:bg-neutral-800
                -mr-4 max-md:mr-0
              "
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            </button>
          )}

          {/* CATEGORY CAROUSEL */}
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onScroll={checkScrollButtons}
            className="
              flex gap-4 md:gap-5
              overflow-x-auto
              scrollbar-hide
              scroll-smooth
              cursor-grab active:cursor-grabbing
              pb-2
            "
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="group/card flex-shrink-0"
                draggable={false}
              >
               <div className="w-[140px] md:w-[160px] flex flex-col items-center">
  {/* IMAGE CONTAINER */}
  <div
    className="
      relative
      w-full
      h-[180px] md:h-[200px]
      rounded-xl
      overflow-hidden
      bg-neutral-100 dark:bg-neutral-900
      border border-neutral-200 dark:border-neutral-800
      mb-2
      p-2                             /* padding added */
      transition-all duration-200
      group-hover/card:border-neutral-300 dark:group-hover/card:border-neutral-700
    "
  >
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <Image
        src={cat.imageUrl}
        alt={cat.name}
        fill
        className="object-contain transition-transform duration-300 group-hover/card:scale-105"
        draggable={false}
      />
    </div>

    {/* Subtle overlay on hover */}
    <div
      className="
        absolute inset-0
        bg-gradient-to-t from-black/5 to-transparent
        opacity-0 group-hover/card:opacity-100
        transition-opacity duration-200 pointer-events-none
      "
    />
  </div>

  {/* CATEGORY NAME */}
  <h3
    className="
      text-xs md:text-sm
      font-normal
      text-neutral-900 dark:text-neutral-50
      text-center
      leading-tight
      transition-colors
      group-hover/card:text-indigo-600 dark:group-hover/card:text-indigo-400
    "
  >
    {cat.name}
  </h3>
</div>

              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}