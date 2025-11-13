"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Container from "../giobal/Container";

export default function TopCategorySection() {
  const categories = [
    {
      id: 1,
      name: "IPHONE",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
      image: "https://m.media-amazon.com/images/I/71geVdy6-OS._SX679_.jpg",
      bgColor: "bg-neutral-800 dark:bg-neutral-700",
      textColor: "text-white",
      discountText: "UP to 80% OFF",
    },
    {
      id: 2,
      name: "REALME",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/72/Realme_logo.svg",
      image: "https://m.media-amazon.com/images/I/71iNwni9TsL._SX679_.jpg",
      bgColor: "bg-neutral-100 dark:bg-neutral-800",
      textColor: "text-neutral-900 dark:text-white",
      discountText: "UP to 80% OFF",
    },
    {
      id: 3,
      name: "XIAOMI",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg",
      image: "https://m.media-amazon.com/images/I/61kFL7ywsZS._SX522_.jpg",
      bgColor: "bg-neutral-100 dark:bg-neutral-800",
      textColor: "text-neutral-900 dark:text-white",
      discountText: "UP to 80% OFF",
    },
    {
      id: 4,
      name: "SAMSUNG",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
      image: "https://m.media-amazon.com/images/I/81vdN55Sr9L._SX679_.jpg",
      bgColor: "bg-neutral-100 dark:bg-neutral-800",
      textColor: "text-neutral-900 dark:text-white",
      discountText: "UP to 80% OFF",
    },
    {
      id: 5,
      name: "ONEPLUS",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/OnePlus_logo.svg",
      image: "https://m.media-amazon.com/images/I/61sG-uZMoLL._SX679_.jpg",
      bgColor: "bg-neutral-100 dark:bg-neutral-800",
      textColor: "text-neutral-900 dark:text-white",
      discountText: "UP to 80% OFF",
    },
  ];

  const [index, setIndex] = useState(0);
  const autoSlideRef = useRef(null);

  const nextSlide = () => {
    setIndex((prev) => (prev === categories.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? categories.length - 1 : prev - 1));
  };

  useEffect(() => {
    autoSlideRef.current = setInterval(nextSlide, 3000);
    return () => clearInterval(autoSlideRef.current);
  }, []);

  const stopAuto = () => clearInterval(autoSlideRef.current);
  const startAuto = () => {
    autoSlideRef.current = setInterval(nextSlide, 3000);
  };

  return (
    <div className="w-full mt-25 mb-25">
      <Container>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 className="text-[22px] sm:text-[26px] font-semibold text-neutral-800 dark:text-neutral-100">
            Top{" "}
            <span className="text-blue-600 dark:text-blue-400">
              Electronic Brands
            </span>
          </h2>

          <Link
            href="/products?category=smartphones"
            className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:bg-blue-700 dark:hover:bg-blue-600 transition"
          >
            View All →
          </Link>
        </div>

        <div className="w-[150px] h-[3px] bg-blue-600 rounded-full mb-8"></div>

        {/* Slider */}
        <div
          className="relative overflow-hidden"
          onMouseEnter={stopAuto}
          onMouseLeave={startAuto}
        >
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {categories.map((c) => (
              <div
                key={c.id}
                className="min-w-full flex justify-center px-2
                h-[320px] sm:h-[380px] lg:h-[420px]" 
              >
                <div
                  className={`${c.bgColor} rounded-3xl
                  p-6 sm:p-8 lg:p-10
                  w-full sm:w-[90%] lg:w-[70%] xl:w-[65%]
                  flex flex-col sm:flex-row
                  items-center justify-between
                  gap-6 shadow-xl`}
                >
                  {/* Left text section */}
                  <div className="flex flex-col gap-4 sm:gap-6 text-center sm:text-left">
                    <span
                      className={`uppercase text-sm sm:text-base font-semibold tracking-widest px-4 py-2 rounded-md max-w-max mx-auto sm:mx-0 ${
                        c.bgColor.includes("bg-neutral-800")
                          ? "bg-neutral-700 dark:bg-neutral-600 text-white"
                          : "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                      }`}
                    >
                      {c.name}
                    </span>

                    <img
                      src={c.logo}
                      alt={c.name}
                      className="h-8 sm:h-10 lg:h-12 w-auto object-contain mx-auto sm:mx-0"
                    />

                    <p
                      className={`${c.textColor} font-semibold text-base sm:text-lg lg:text-xl`}
                    >
                      {c.discountText}
                    </p>
                  </div>

                  {/* Right phone image */}
                  <img
                    src={c.image}
                    alt={c.name}
                    className="h-[150px] sm:h-[200px] lg:h-[240px] object-contain rounded-xl shadow-lg"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Prev Button */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 
            text-3xl bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white 
            shadow-md p-3 rounded-full hover:scale-110 transition"
          >
            ‹
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 
            text-3xl bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white 
            shadow-md p-3 rounded-full hover:scale-110 transition"
          >
            ›
          </button>

          {/* Dots */}
          <div className="flex justify-center mt-5 gap-2">
            {categories.map((_, i) => (
              <div
                key={i}
                onClick={() => setIndex(i)}
                className={`h-3 rounded-full cursor-pointer transition-all ${
                  index === i
                    ? "w-8 bg-blue-600 dark:bg-blue-400"
                    : "w-3 bg-neutral-300 dark:bg-neutral-600"
                }`}
              ></div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
