// "use client";

// import { Input } from "@/components/ui/input";
// import { useEffect, useState, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Search, X } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { searchProducts } from "@/lib/actions/search";

// export default function NavSearch() {
//   const [search, setSearch] = useState("");
//   const [suggestions, setSuggestions] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const router = useRouter();

//   // Debounced search
//   useEffect(() => {
//     if (!search || search.length < 2) {
//       setSuggestions([]);
//       return;
//     }

//     const timeout = setTimeout(async () => {
//       setLoading(true);
//       const res = await searchProducts(search);
//       setSuggestions(res);
//       setLoading(false);
//     }, 300);

//     return () => clearTimeout(timeout);
//   }, [search]);

//   // Auto-focus input when opened on mobile
//   useEffect(() => {
//     if (isOpen && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [isOpen]);

//   // Handle search submission
//   const handleSubmit = () => {
//     if (!search.trim()) return;
//     router.push(`/products?search=${encodeURIComponent(search)}`);
//     setSuggestions([]);
//     setIsOpen(false);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleSubmit();
//     }
//   };

//   // Close search bar
//   const handleClose = () => {
//     setIsOpen(false);
//     setSearch("");
//     setSuggestions([]);
//   };

//   return (
//     <>
//       {/* Mobile: Search icon button (inline with navbar) */}
//       <div className="sm:hidden">
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
//           aria-label="Toggle search"
//         >
//           <Search
//             size={20}
//             className="text-neutral-800 dark:text-neutral-400"
//           />
//         </button>
//       </div>

//       {/* Mobile: Expandable search overlay (doesn't affect flexbox layout) */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
//             className="sm:hidden fixed top-14 left-0 right-0 z-50 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 shadow-md"
//           >
//             <div className="px-4 py-4">
//               <div className="relative">
//                 <Search
//                   size={18}
//                   className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
//                 />
//                 <Input
//                   ref={inputRef}
//                   type="search"
//                   placeholder="Search products..."
//                   className="w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 focus:border-transparent transition-shadow focus-visible:ring-0 focus-visible:outline-none focus-visible:border-neutral-300"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                 />
//                 <button
//                   type="button"
//                   onClick={handleClose}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
//                 >
//                   <X size={16} />
//                 </button>
//               </div>

//               {/* Mobile suggestions */}
//               <AnimatePresence>
//                 {suggestions.length > 0 && (
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.95 }}
//                     transition={{ duration: 0.15 }}
//                     className="mt-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-md overflow-hidden max-h-[65vh] overflow-y-auto"
//                   >
//                     {suggestions.map((item, index) => (
//                       <Link
//                         key={item.id}
//                         href={`/products/${item.id}`}
//                         onClick={() => setIsOpen(false)}
//                         className={`flex items-center gap-3 px-3 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors ${
//                           index !== suggestions.length - 1
//                             ? "border-b border-neutral-100 dark:border-neutral-800"
//                             : ""
//                         }`}
//                       >
//                         <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
//                           <Image
//                             src={item.image || "/placeholder.png"}
//                             alt={item.name}
//                             fill
//                             className="object-cover"
//                           />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 line-clamp-1">
//                             {item.name}
//                           </div>
//                           <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
//                             {item.brand} · {item.model}
//                           </div>
//                         </div>
//                       </Link>
//                     ))}
//                   </motion.div>
//                 )}
//               </AnimatePresence>

//               {loading && (
//                 <div className="mt-3 px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
//                   Searching...
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Desktop: Always visible search bar */}
//       <div className="hidden sm:flex w-full px-6 py-4">
//         <div className="w-full max-w-2xl mx-auto relative">
//           <div className="relative">
//             <Search
//               size={18}
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
//             />
//             <Input
//               type="search"
//               placeholder="Search products..."
//               className="w-full pl-11 pr-4 py-5 text-sm rounded-lg border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 focus:ring-2  focus:border-transparent shadow-sm transition-shadow focus-visible:outline-none focus-visible:border-neutral-300 focus-visible:ring-0 "
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               onKeyDown={handleKeyDown}
//             />
//           </div>

//           {/* Desktop suggestions dropdown */}
//           <AnimatePresence>
//             {suggestions.length > 0 && (
//               <motion.div
//                 initial={{ opacity: 0, y: -8, scale: 0.95 }}
//                 animate={{ opacity: 1, y: 0, scale: 1 }}
//                 exit={{ opacity: 0, y: -8, scale: 0.95 }}
//                 transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
//                 className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl overflow-hidden max-h-[450px] overflow-y-auto z-50"
//               >
//                 {suggestions.map((item, index) => (
//                   <Link
//                     key={item.id}
//                     href={`/products/${item.id}`}
//                     onClick={() => {
//                       setSearch("");
//                       setSuggestions([]);
//                     }}
//                     className={`flex items-center gap-3 px-4 py-3.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors ${
//                       index !== suggestions.length - 1
//                         ? "border-b border-neutral-100 dark:border-neutral-800"
//                         : ""
//                     }`}
//                   >
//                     <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
//                       <Image
//                         src={item.image || "/placeholder.png"}
//                         alt={item.name}
//                         fill
//                         className="object-cover"
//                       />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 line-clamp-1 mb-1">
//                         {item.name}
//                       </div>
//                       <div className="text-xs text-neutral-500 dark:text-neutral-400">
//                         {item.brand} · {item.model}
//                       </div>
//                     </div>
//                   </Link>
//                 ))}
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {loading && (
//             <div className="absolute top-full mt-2 left-0 right-0 px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-md">
//               Searching...
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// ============================================
"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { searchProducts } from "@/lib/actions/search";

export default function NavSearch() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Debounced search
  useEffect(() => {
    if (!search || search.length < 2) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchProducts(search);
        setSuggestions(res);
      } catch (error) {
        console.error("Search failed:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  // Auto-focus input when opened on mobile
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle search submission
  const handleSubmit = () => {
    if (!search.trim()) return;
    router.push(`/products?search=${encodeURIComponent(search)}`);
    setSuggestions([]);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      setSuggestions([]);
      if (isOpen) handleClose();
    }
  };

  // Close search bar
  const handleClose = () => {
    setIsOpen(false);
    setSearch("");
    setSuggestions([]);
  };

  const handleProductClick = () => {
    setSearch("");
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile: Search icon button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 rounded-full transition-colors duration-200"
          aria-label="Toggle search"
          aria-expanded={isOpen}
        >
          <Search size={20} className="text-neutral-600 dark:text-neutral-400" />
        </button>
      </div>

      {/* Mobile: Expandable search overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden fixed top-14 left-0 right-0 z-50 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800"
            role="dialog"
            aria-label="Search products"
          >
            <div className="px-4 py-4">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                  aria-hidden="true"
                />
                <Input
                  ref={inputRef}
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors focus-visible:ring-0 focus-visible:outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  aria-label="Search for products"
                  aria-autocomplete="list"
                  aria-controls={suggestions.length > 0 ? "mobile-suggestions" : undefined}
                />
                <button
                  type="button"
                  onClick={handleClose}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 rounded-md transition-colors duration-200"
                  aria-label="Close search"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Mobile suggestions */}
              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div
                    id="mobile-suggestions"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="mt-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden max-h-[65vh] overflow-y-auto"
                    role="listbox"
                  >
                    {suggestions.map((item, index) => (
                      <Link
                        key={item.id}
                        href={`/products/${item.id}`}
                        onClick={handleProductClick}
                        className={`flex items-center gap-3 px-3 py-3 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors duration-200 ${
                          index !== suggestions.length - 1
                            ? "border-b border-neutral-100 dark:border-neutral-800"
                            : ""
                        }`}
                        role="option"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.png"}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 line-clamp-1">
                            {item.name}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                            {item.brand} · {item.model}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {loading && (
                <div
                  className="mt-3 px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900 rounded-lg"
                  role="status"
                  aria-live="polite"
                >
                  Searching...
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop: Always visible inline search */}
      <div className="hidden md:block w-full relative">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
            aria-hidden="true"
          />
          <Input
            ref={desktopInputRef}
            type="search"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors focus-visible:outline-none focus-visible:ring-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Search for products"
            aria-autocomplete="list"
            aria-controls={suggestions.length > 0 ? "desktop-suggestions" : undefined}
          />
        </div>

        {/* Desktop suggestions dropdown */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              id="desktop-suggestions"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden max-h-[450px] overflow-y-auto z-50"
              role="listbox"
            >
              {suggestions.map((item, index) => (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  onClick={handleProductClick}
                  className={`flex items-center gap-3 px-4 py-3.5 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors duration-200 ${
                    index !== suggestions.length - 1
                      ? "border-b border-neutral-100 dark:border-neutral-800"
                      : ""
                  }`}
                  role="option"
                >
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.png"}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 line-clamp-1 mb-1">
                      {item.name}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      {item.brand} · {item.model}
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <div
            className="absolute top-full mt-2 left-0 right-0 px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg"
            role="status"
            aria-live="polite"
          >
            Searching...
          </div>
        )}
      </div>
    </>
  );
}