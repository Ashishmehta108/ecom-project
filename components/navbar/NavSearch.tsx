"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { searchProducts } from "@/lib/actions/search";
import { useLanguage } from "@/app/context/languageContext";
import { getTranslatedText } from "@/lib/utils/language";

export default function NavSearch() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { locale } = useLanguage();

  const placeholderTxt =
    locale === "pt" ? "Pesquisar produtos..." : "Search products...";
  const searchingTxt = locale === "pt" ? "Pesquisando..." : "Searching...";

  const resolvedSuggestions = useMemo(() => {
    return suggestions.map((item) => ({
      ...item,
      name:
        typeof item.name === "string"
          ? item.name
          : getTranslatedText(item.name, locale),
    }));
  }, [suggestions, locale]);

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
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  // Mobile auto-focus
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!search.trim()) return;
    router.push(`/products?search=${encodeURIComponent(search)}`);
    setSearch("");
    setSuggestions([]);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
    else if (e.key === "Escape") handleClose();
  };

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
      {/* Mobile Search Button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 rounded-full transition-colors"
          aria-label="Toggle search"
        >
          <Search
            size={20}
            className="text-neutral-600 dark:text-neutral-400"
          />
        </button>
      </div>

      {/* Mobile Overlay Search */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-14 left-0 right-0 z-50 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800"
          >
            <div className="px-4 py-4">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                />
                <Input
                  ref={inputRef}
                  type="search"
                  placeholder={placeholderTxt}
                  className="w-full pl-10 pr-10 text-sm bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={handleClose}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Suggestion List Mobile */}
              <AnimatePresence>
                {resolvedSuggestions.length > 0 && (
                  <motion.div className="mt-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg max-h-[65vh] overflow-y-auto">
                    {resolvedSuggestions.map((item) => (
                      <Link
                        key={item.id}
                        href={`/products/${item.id}`}
                        onClick={handleProductClick}
                        className="flex items-center gap-3 px-3 py-3 border-b dark:border-neutral-800 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50"
                      >
                        <Image
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="rounded-lg object-cover"
                        />
                        <span className="text-sm">{item.name}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {loading && (
                <p className="mt-3 text-sm text-neutral-500">{searchingTxt}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Search */}
      <div className="hidden md:block w-full relative">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <Input
            ref={desktopInputRef}
            type="search"
            placeholder={placeholderTxt}
            className="w-full pl-11 pr-4 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Desktop Suggestions */}
        <AnimatePresence>
          {resolvedSuggestions.length > 0 && (
            <motion.div className="absolute top-full mt-2 w-full rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 z-50 max-h-[450px] overflow-y-auto">
              {resolvedSuggestions.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  onClick={handleProductClick}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 border-b dark:border-neutral-800"
                >
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    width={56}
                    height={56}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                      {item.brand} · {item.model}
                    </p>
                  </div>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <p className="absolute top-full mt-2 px-4 py-2 text-sm text-neutral-500">
            {searchingTxt}
          </p>
        )}
      </div>
    </>
  );
}
