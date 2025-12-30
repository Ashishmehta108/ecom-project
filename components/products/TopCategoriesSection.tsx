// "use client";
// import { useRef, useState, useEffect, useCallback } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { ChevronRight, ChevronLeft } from "lucide-react";
// import { useLanguage } from "@/app/context/languageContext";

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
//   const { locale } = useLanguage(); // ⬅️ NEW

//   const scrollRef = useRef<HTMLDivElement>(null);
//   const [showLeftArrow, setShowLeftArrow] = useState(false);
//   const [showRightArrow, setShowRightArrow] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const [startX, setStartX] = useState(0);
//   const [scrollLeft, setScrollLeft] = useState(0);

//   const checkScrollButtons = useCallback(() => {
//     if (!scrollRef.current) return;
//     const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
//     setShowLeftArrow(scrollLeft > 10);
//     setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
//   }, []);

//   useEffect(() => {
//     checkScrollButtons();
//     window.addEventListener("resize", checkScrollButtons);
//     return () => window.removeEventListener("resize", checkScrollButtons);
//   }, [checkScrollButtons]);

//   const scroll = (direction: "left" | "right") => {
//     if (!scrollRef.current) return;
//     const scrollAmount = 320;
//     scrollRef.current.scrollBy({
//       left: direction === "left" ? -scrollAmount : scrollAmount,
//       behavior: "smooth",
//     });
//   };

//   const handleMouseDown = (e: React.MouseEvent) => {
//     if (!scrollRef.current) return;
//     setIsDragging(true);
//     setStartX(e.pageX - scrollRef.current.offsetLeft);
//     setScrollLeft(scrollRef.current.scrollLeft);
//   };

//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (!isDragging || !scrollRef.current) return;
//     e.preventDefault();
//     const x = e.pageX - scrollRef.current.offsetLeft;
//     const walk = (x - startX) * 1.5;
//     scrollRef.current.scrollLeft = scrollLeft - walk;
//   };

//   const handleMouseUp = () => setIsDragging(false);

//   if (!categories || categories.length === 0) return null;

//   return (
//     <section className="w-full py-12 md:py-16 bg-white dark:bg-neutral-950">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* HEADER */}
//         <div className="flex items-end justify-between mb-8 md:mb-10">
//           <div>
//             <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-neutral-50 tracking-tight">
//               {locale === "pt" ? "Categorias" : "Categories"}
//             </h2>
//           </div>

//           <Link
//             href="/products"
//             className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors flex items-center gap-1 group"
//           >
//             {locale === "pt" ? "Ver tudo" : "See All"}
//             <div className="flex items-center justify-center w-6 h-6 rounded-xl bg-neutral-100">
//               <ChevronRight className="w-4 h-4 bg-neutral-100 transition-transform group-hover:translate-x-0.5" />
//             </div>
//           </Link>
//         </div>

//         {/* SCROLLABLE CAROUSEL */}
//         <div className="relative group/carousel">
//           {/* LEFT ARROW */}
//           {showLeftArrow && (
//             <button
//               onClick={() => scroll("left")}
//               className="
//                 absolute left-0 top-1/2 -translate-y-1/2 z-10
//                 w-9 h-9 rounded-full
//                 bg-white/95 dark:bg-neutral-900/95
//                 backdrop-blur-sm shadow-sm
//                 border border-neutral-200/50 dark:border-neutral-800/50
//                 flex items-center justify-center
//                 opacity-0 md:group-hover/carousel:opacity-100 max-md:opacity-100
//                 transition-opacity duration-200
//                 hover:bg-neutral-50 dark:hover:bg-neutral-800
//                 -ml-4 max-md:ml-0"
//               aria-label="Scroll left"
//             >
//               <ChevronLeft className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
//             </button>
//           )}

//           {/* RIGHT ARROW */}
//           {showRightArrow && (
//             <button
//               onClick={() => scroll("right")}
//               className="
//                 absolute right-0 top-1/2 -translate-y-1/2 z-10
//                 w-9 h-9 rounded-full
//                 bg-white/95 dark:bg-neutral-900/95
//                 backdrop-blur-sm shadow-sm
//                 border border-neutral-200/50 dark:border-neutral-800/50
//                 flex items-center justify-center
//                 opacity-0 md:group-hover/carousel:opacity-100 max-md:opacity-100
//                 transition-opacity duration-200
//                 hover:bg-neutral-50 dark:hover:bg-neutral-800
//                 -mr-4 max-md:mr-0"
//               aria-label="Scroll right"
//             >
//               <ChevronRight className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
//             </button>
//           )}

//           {/* CATEGORY CAROUSEL */}
//           <div
//             ref={scrollRef}
//             onMouseDown={handleMouseDown}
//             onMouseMove={handleMouseMove}
//             onMouseUp={handleMouseUp}
//             onMouseLeave={handleMouseUp}
//             onScroll={checkScrollButtons}
//             className="
//               flex gap-4 md:gap-5 overflow-x-auto
//               scrollbar-hide scroll-smooth
//               cursor-grab active:cursor-grabbing
//               pb-2"
//             style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//           >
//             {categories.map((cat) => (
//               <Link
//                 key={cat.id}
//                 href={`/products?category=${cat.id}`}
//                 draggable={false}
//               >
//                 <div className="w-[160px] h-[280px] mx-1 flex flex-col items-center">
//                   {/* IMAGE */}
//                   <div
//                     className="
//                     relative w-full h-[180px] rounded-lg
//                     overflow-hidden bg-neutral-50 dark:bg-neutral-900
//                     border border-neutral-200 dark:border-neutral-800
//                     shadow-sm p-3
//                     transition-all duration-300
//                     hover:border-neutral-300 dark:hover:border-neutral-700"
//                   >
//                     <div className="relative w-full h-full flex items-center justify-center">
//                       <Image
//                         src={cat.imageUrl}
//                         alt={cat.name}
//                         width={120}
//                         height={120}
//                         draggable={false}
//                         className="object-contain bg-transparent"
//                       />
//                     </div>
//                   </div>

//                   {/* NAME */}
//                   <h3
//                     className="
//                     mt-2 text-xs md:text-sm font-normal
//                     text-neutral-900 dark:text-neutral-50 text-center leading-tight"
//                   >
//                     {cat.name}
//                   </h3>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useLanguage } from "@/app/context/languageContext";

type Category = {
  id: string;
  name: {
    en: string;
    pt: string;
  };
  imageUrl: string;
};

export default function TopCategoriesSection({
  categories,
}: {
  categories: Category[];
}) {
  const { locale } = useLanguage();

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

  const handleMouseUp = () => setIsDragging(false);

  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full py-12 md:py-16 bg-white dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-neutral-50 tracking-tight">
            {locale === "pt" ? "Categorias" : "Categories"}
          </h2>

          <Link
            href="/products"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors flex items-center gap-1 group"
          >
            {locale === "pt" ? "Ver tudo" : "See All"}
            <div className="w-6 h-6 flex items-center justify-center rounded-xl bg-neutral-100">
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        </div>

        {/* MAIN CAROUSEL */}
        <div className="relative group/carousel">
          
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="arrow-btn left-0 -ml-4"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            </button>
          )}

          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="arrow-btn right-0 -mr-4"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            </button>
          )}

          {/* CATEGORY ITEMS */}
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onScroll={checkScrollButtons}
            className="flex gap-4 md:gap-5 overflow-x-auto scrollbar-hide scroll-smooth cursor-grab active:cursor-grabbing pb-2"
          >
            {categories.map((cat) => (
              <Link key={cat.id} href={`/products?category=${cat.id}`} draggable={false}>
                <div className="w-[160px] h-[280px] mx-1 flex flex-col items-center">
                  <div className="relative w-full h-[180px] rounded-lg overflow-hidden bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm p-3 transition-all hover:border-neutral-300 dark:hover:border-neutral-700">
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name[locale]}
                      width={120}
                      height={120}
                      draggable={false}
                      className="object-contain"
                    />
                  </div>

                  <h3 className="mt-2 text-xs md:text-sm font-normal text-neutral-900 dark:text-neutral-50 text-center leading-tight">
                    {cat.name[locale]}
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
