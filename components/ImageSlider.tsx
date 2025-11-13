"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function PromoSlider({ slides }: { slides: any[] }) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const timer = useRef<any>(null);

  const next = useCallback(() => {
    setIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prev = () => {
    setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (!hovered) {
      timer.current = setInterval(next, 4500);
    }
    return () => clearInterval(timer.current);
  }, [hovered, next]);

  return (
    <div
      className="w-full pt-6 pb-6 relative flex flex-col items-center justify-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-[95%] md:w-[92%] lg:w-[88%] rounded-[30px] overflow-hidden">
        <div
          className="
            relative w-full bg-[#1d2242] rounded-[28px] shadow-xl
            min-h-[360px] sm:min-h-[380px] md:min-h-[420px] lg:min-h-[450px]
            flex items-center justify-center
          "
        >
          {slides.map((slide, i) => {
            const active = i === index;

            return (
              <div
                key={i}
                className={`
                  absolute inset-0 flex flex-col md:flex-row items-center 
                  justify-between px-6 sm:px-12 md:px-14 lg:px-20
                  gap-8 md:gap-12 

                  transition-all duration-700 ease-out

                  ${
                    active
                      ? "opacity-100 translate-y-0 z-10"
                      : "opacity-0 translate-y-4 z-0 hidden"
                  }
                `}
              >
                {/* LEFT TEXT SECTION */}
                <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 max-w-[550px] text-center md:text-left">
                  <p className="text-white/70 text-lg sm:text-xl lg:text-2xl font-medium leading-snug">
                    {slide.subtitle}
                  </p>

                  <h1 className="text-white font-extrabold text-3xl sm:text-5xl lg:text-6xl leading-tight">
                    {slide.title}
                  </h1>

                  <p className="text-white text-lg sm:text-xl lg:text-2xl font-semibold">
                    {slide.discount}
                  </p>

                  {slide.buttonText && (
                    <Link
                      href={slide.buttonLink || "#"}
                      className="
                        inline-block mt-3 bg-white text-blue-700 
                        px-7 py-3 sm:px-8 sm:py-4 
                        rounded-xl font-semibold shadow-md
                        text-sm sm:text-base hover:scale-105 transition
                        mx-auto md:mx-0
                      "
                    >
                      {slide.buttonText}
                    </Link>
                  )}
                </div>

                {/* RIGHT IMAGE SECTION */}
                <div className="flex items-center justify-center w-full md:w-auto">
                  <img
                    src={slide.image}
                    alt="Slide"
                    className="
                      object-contain drop-shadow-2xl
                      h-[200px] sm:h-[240px] md:h-[280px] lg:h-[300px]
                      max-w-[90%] md:max-w-none
                    "
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ARROWS */}
      <button
        onClick={prev}
        className="
          hidden sm:flex absolute left-4 md:left-10 top-1/2
          -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 
          rounded-full bg-white border shadow-xl
          items-center justify-center hover:scale-110 transition
          z-20
        "
      >
        <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-gray-700" />
      </button>

      <button
        onClick={next}
        className="
          hidden sm:flex absolute right-4 md:right-10 top-1/2
          -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 
          rounded-full bg-white border shadow-xl
          items-center justify-center hover:scale-110 transition
          z-20
        "
      >
        <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-gray-700" />
      </button>

      {/* DOTS */}
      <div className="flex items-center gap-2 mt-4 sm:mt-6">
        {slides.map((_, dot) => (
          <div
            key={dot}
            onClick={() => setIndex(dot)}
            className={`
              h-2 rounded-full cursor-pointer transition-all
              ${dot === index ? "w-8 bg-blue-600" : "w-2 bg-gray-400"}
            `}
          />
        ))}
      </div>
    </div>
  );
}
