// Clean, single-color, minimal, perfectly aligned version
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Container from "../giobal/Container";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TopCategorySection() {
  const categories = [
    {
      id: 1,
      name: "IPHONE",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
      image: "https://m.media-amazon.com/images/I/71geVdy6-OS._SX679_.jpg",
    },
    {
      id: 2,
      name: "REALME",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/72/Realme_logo.svg",
      image: "https://m.media-amazon.com/images/I/71iNwni9TsL._SX679_.jpg",
    },
    {
      id: 3,
      name: "XIAOMI",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg",
      image: "https://m.media-amazon.com/images/I/61kFL7ywsZS._SX522_.jpg",
    },
    {
      id: 4,
      name: "SAMSUNG",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Samsung_Logo.svg",
      image: "https://m.media-amazon.com/images/I/81vdN55Sr9L._SX679_.jpg",
    },
    {
      id: 5,
      name: "ONEPLUS",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/OnePlus_logo.svg",
      image: "https://m.media-amazon.com/images/I/61sG-uZMoLL._SX679_.jpg",
    },
  ];

  const [index, setIndex] = useState(0);
  const autoRef = useRef(null);
  const startX = useRef(0);
  const endX = useRef(0);
  const dragging = useRef(false);

  const next = () => setIndex((p) => (p + 1) % categories.length);
  const prev = () =>
    setIndex((p) => (p - 1 + categories.length) % categories.length);

  const startAuto = () => {
    stopAuto();
    autoRef.current = setInterval(next, 4000);
  };

  const stopAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
  };

  useEffect(() => {
    startAuto();
    return stopAuto;
  }, []);

  const touchStart = (e) => {
    startX.current = e.touches[0].clientX;
    dragging.current = true;
    stopAuto();
  };

  const touchMove = (e) => {
    if (!dragging.current) return;
    endX.current = e.touches[0].clientX;
  };

  const touchEnd = () => {
    if (!dragging.current) return;
    const diff = startX.current - endX.current;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    dragging.current = false;
    startAuto();
  };

  return (
    <div className="w-full my-16">
      <Container>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 px-2 sm:px-0">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Top Electronics Brands
          </h2>

          <Link
            href="/products?category=smartphones"
            className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors whitespace-nowrap"
          >
            View All
            <div className="bg-neutral-100 dark:bg-neutral-800 w-8 h-8 flex items-center justify-center rounded-full">
              <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
            </div>
          </Link>
        </div>

        <div className="w-24 h-1 bg-lime-600 rounded-full mb-8 mx-2 sm:mx-0"></div>

        <div
          className="relative overflow-hidden"
          onTouchStart={touchStart}
          onTouchMove={touchMove}
          onTouchEnd={touchEnd}
          onMouseEnter={stopAuto}
          onMouseLeave={startAuto}
        >
          {/* --- LEFT BUTTON (Desktop Only) --- */}
          <button
            onClick={prev}
            className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 
            bg-white dark:bg-gray-700 shadow-md rounded-full p-2 hover:scale-110 transition z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* --- RIGHT BUTTON (Desktop Only) --- */}
          <button
            onClick={next}
            className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 
            bg-white dark:bg-gray-700 shadow-md rounded-full p-2 hover:scale-110 transition z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {categories.map((c) => (
              <div key={c.id} className="min-w-full px-2 flex justify-center">
                <div className="w-full max-w-5xl rounded-2xl shadow-md p-6 sm:p-10 flex flex-col sm:flex-row items-center gap-8 bg-gray-100 dark:bg-gray-800">
                  <div className="flex flex-col gap-4 w-full sm:w-1/2 items-start text-gray-900 dark:text-gray-100">
                    <span className="text-xs uppercase px-3 py-1 rounded-md font-semibold bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      {c.name}
                    </span>

                    <div className="bg-white dark:bg-gray-700 p-2 rounded-md shadow w-12 h-12 flex items-center justify-center">
                      <img
                        src={c.logo}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <p className="text-lg font-bold">UP to 80% OFF</p>
                  </div>

                  <div className="w-full sm:w-1/2 flex justify-center relative">
                    <img
                      src={c.image}
                      className="max-h-52 sm:max-h-64 object-contain rounded-xl shadow"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-5 gap-2">
            {categories.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  index === i
                    ? "w-6 bg-blue-600"
                    : "w-2 bg-gray-400 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
