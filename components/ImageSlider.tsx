"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function PromoSlider({ slides }: { slides: any[] }) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  // Touch refs
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);

  const next = useCallback(() => {
    setIndex(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prev = useCallback(() => {
    setIndex(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  // Auto slide
  useEffect(() => {
    if (!hovered) timer.current = setTimeout(next, 1800);
    return () => timer.current && clearTimeout(timer.current);
  }, [hovered, next, index]);

  // Touch handlers
  const handleTouchStart = (e: any) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: any) => {
    if (!isDragging.current) return;
    currentX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;

    const diff = startX.current - currentX.current;

    if (Math.abs(diff) > 50) {
      if (diff > 0) next(); // swipe left
      else prev(); // swipe right
    }

    isDragging.current = false;
  };

  return (
    <div
      className="w-full py-6 relative flex flex-col items-center justify-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-[95%] md:w-[90%] lg:w-[85%] rounded-2xl overflow-hidden">
        <div
          className="
            rounded-[28px] shadow-xl overflow-hidden
            bg-[#141621] border border-white/10 dark:border-white/5
            min-h-[320px] xs:min-h-[340px] sm:min-h-[360px] 
            md:min-h-[390px] lg:min-h-[440px] xl:min-h-[480px]
            relative
          "
        >
          <div
            className="flex h-full transition-transform duration-[650ms] ease-[cubic-bezier(.4,0,.2,1)]"
            style={{
              width: `${slides.length * 100}%`,
              transform: `translateX(-${index * (100 / slides.length)}%)`,
            }}
          >
            {slides.map((slide, i) => (
              <div
                key={i}
                className="
                  w-full flex-shrink-0 flex 
                  flex-col-reverse md:flex-row 
                  items-center justify-between
                  px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20
                  pt-4 sm:pt-6 md:pt-10 
                  pb-4 sm:pb-8
                  gap-4 sm:gap-6 md:gap-10
                  text-center md:text-left
                "
                style={{ width: `${100 / slides.length}%` }}
              >
                {/* LEFT */}
                <div className="flex flex-col gap-2 sm:gap-4 md:gap-6 max-w-[540px] w-full text-white">
                  <p className="text-white/90 text-sm sm:text-base md:text-lg font-medium">
                    {slide.subtitle}
                  </p>

                  <h1 className="text-white font-extrabold leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                    {slide.title}
                  </h1>

                  <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                    {slide.discount}
                  </p>

                  {slide.buttonText && (
                    <Link
                      href={slide.buttonLink || "#"}
                      className="
                        mt-3 sm:mt-4
                        block max-w-[200px]
                        bg-white text-neutral-800 
                        px-5 py-2 sm:px-7 sm:py-3 md:px-8 md:py-4
                        rounded-xl text-sm sm:text-base font-semibold
                        shadow-md transition 
                        mx-auto md:mx-0
                      "
                    >
                      {slide.buttonText}
                    </Link>
                  )}
                </div>

                {/* RIGHT IMAGE */}
                <div className="flex items-center justify-center w-full md:w-auto">
                  <img
                    src={slide.image}
                    alt=""
                    className="
                      object-contain select-none drop-shadow-2xl
                      h-[180px] xs:h-[200px] sm:h-[220px] 
                      md:h-[260px] lg:h-[300px] xl:h-[320px]
                      max-w-[95%] md:max-w-none
                      transition-all duration-500
                    "
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ARROWS */}
      <button
        onClick={prev}
        className="
          hidden sm:flex absolute left-4 md:left-10 top-1/2 -translate-y-1/2
          w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 
          rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md 
          border border-black/5 dark:border-white/10 shadow-lg
          items-center justify-center hover:scale-110 transition z-20
        "
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-200" />
      </button>

      <button
        onClick={next}
        className="
          hidden sm:flex absolute right-4 md:right-10 top-1/2 -translate-y-1/2
          w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 
          rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md 
          border border-black/5 dark:border-white/10 shadow-lg
          items-center justify-center hover:scale-110 transition z-20
        "
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-200" />
      </button>

      {/* DOTS */}
      <div className="flex items-center gap-2 mt-4 sm:mt-6">
        {slides.map((_, dot) => (
          <div
            key={dot}
            onClick={() => setIndex(dot)}
            className={`
              h-2 rounded-full cursor-pointer transition-all
              ${dot === index 
                ? "w-7 bg-blue-600 dark:bg-blue-400" 
                : "w-2 bg-gray-400 dark:bg-gray-600"}
            `}
          />
        ))}
      </div>
    </div>
  );
}
