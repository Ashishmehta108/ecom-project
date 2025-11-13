"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

export interface Slide {
  image: string;
  title?: string;
  subtitle?: string;
  discount?: string;
  buttonText?: string;
  buttonLink?: string;
  badge?: string;
}

interface ImageSliderProps {
  slides: Slide[];
  autoPlayInterval?: number;
  showControls?: boolean;
  showProgress?: boolean;
}

export default function ImageSlider({
  slides,
  autoPlayInterval = 2000,
  showControls = true,
  showProgress = true,
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const minSwipeDistance = 50;

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    if (isPlaying && !isHovered) {
      const progressStep = 100 / (autoPlayInterval / 50);
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + progressStep));
      }, 50);

      intervalRef.current = setInterval(() => {
        goToNext();
      }, autoPlayInterval);
    } else {
      setProgress(0);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying, isHovered, autoPlayInterval, goToNext, slides.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) goToNext();
    if (distance < -minSwipeDistance) goToPrevious();
  };

  if (slides.length === 0) return null;

  return (
    <div
      className="relative w-full sm:max-w-[98%] mx-auto sm:rounded-2xl overflow-hidden shadow-xl transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative w-full aspect-[4/5] sm:aspect-[16/9] md:aspect-[16/7] lg:aspect-[21/7]">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;

          return (
            <div
              key={index}
              className={`absolute lg:inset-0 transition-all duration-1000 ease-in-out ${
                isActive
                  ? "opacity-100 scale-100 z-10"
                  : "opacity-0 scale-105 z-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title || `Slide ${index + 1}`}
                className="w-full h-full object-contain lg:object-cover sm:rounded-2xl"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent z-10 sm:rounded-2xl" />

              {/* Overlay Text with subtle delay */}
              {(slide.title || slide.subtitle || slide.buttonText) && (
                <div
                  className={`absolute inset-0 z-20 flex items-center justify-center sm:justify-start
                    transition-all duration-700 ease-out
                    ${isActive ? "opacity-100 delay-200 translate-y-0" : "opacity-0 translate-y-3"}
                  `}
                >
                  <div className="px-4 sm:px-8 md:px-12 lg:px-16 text-center sm:text-left">
                    {slide.title && (
                      <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2 sm:mb-3 drop-shadow-lg leading-tight">
                        {slide.title}
                      </h2>
                    )}
                    {slide.subtitle && (
                      <p className="text-white/90 text-sm sm:text-base md:text-lg mb-3 sm:mb-4 max-w-md mx-auto sm:mx-0">
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.buttonText && (
                      <Link
                        href={slide.buttonLink || "#"}
                        className="inline-flex items-center gap-2 bg-[#96d1c7] text-gray-900 font-semibold text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        {slide.buttonText}
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {/* {showControls && slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-10 h-10 items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 z-30"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={goToNext}
            className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-10 h-10 items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 z-30"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </>
      )} */}
    </div>
  );
}
