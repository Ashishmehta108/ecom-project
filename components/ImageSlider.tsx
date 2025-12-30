

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/app/context/languageContext";
const AUTOPLAY_DURATION = 3000;

export default function PromoSlider({ slides = [] }: { slides?: any[] }) {
  const { locale } = useLanguage();
  slides =
    locale === "pt"
      ? [
          {
            bgColor: "bg-red-950",
            subtitle: "",
            title: "Promoção de Natal",
            discount: "Até 20% de desconto em todos os acessórios",
            shortText:
              "Oferta por tempo limitado em todos os produtos premium.",
            buttonText: "Compre Agora",
            buttonLink: "/products?category=black-friday",
            image: "/christmas.png",
            imageStyles:
              "max-w-[140px] sm:max-w-[200px] md:max-w-[280px] lg:max-w-[340px]",
          },
          {
            bgColor: "bg-blue-900",
            subtitle: "",
            title: "Auscultadores Premium",
            discount: "Oferta por tempo limitado",
            shortText: "Som rico, graves profundos e conforto o dia todo.",
            buttonText: "Ver Detalhes",
            buttonLink: "/products?category=headphones",
            image: "/promo2.png",
            imageStyles:
              "max-w-[160px] sm:max-w-[220px] md:max-w-[320px] lg:max-w-[400px]",
          },
          {
            bgColor: "bg-slate-900",
            subtitle: "",
            title: "Novidades",
            discount: "Oferta exclusiva",
            shortText:
              "Novos designs criados para conforto e estilo no dia a dia.",
            buttonText: "Explorar",
            buttonLink: "/products?category=summer",
            image: "/promo1.png",
            imageStyles:
              "max-w-[160px] sm:max-w-[240px] md:max-w-[340px] lg:max-w-[420px]",
          },
        ]
      : [
          {
            bgColor: "bg-red-950",
            subtitle: "",
            title: "Christmas Sale",
            discount: "Up to 20% Off on all accessories",
            shortText: "Limited time offer on all premium products.",
            buttonText: "Shop Now",
            buttonLink: "/products?category=black-friday",
            image: "/christmas.png",
            imageStyles:
              "max-w-[140px] sm:max-w-[200px] md:max-w-[280px] lg:max-w-[340px]",
          },
          {
            bgColor: "bg-blue-900",
            subtitle: "",
            title: "Premium Headphones",
            discount: "Limited Time Offer",
            shortText: "Experience rich sound, deep bass, and all-day comfort.",
            buttonText: "View Details",
            buttonLink: "/products?category=headphones",
            image: "/promo2.png",
            imageStyles:
              "max-w-[160px] sm:max-w-[220px] md:max-w-[320px] lg:max-w-[400px]",
          },
          {
            bgColor: "bg-slate-900",
            subtitle: "",
            title: "New Arrivals",
            discount: "Exclusive deal",
            shortText: "Fresh designs made for comfort and everyday style.",
            buttonText: "Explore",
            buttonLink: "/products?category=summer",
            image: "/promo1.png",
            imageStyles:
              "max-w-[160px] sm:max-w-[240px] md:max-w-[340px] lg:max-w-[420px]",
          },
        ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const isInteractingRef = useRef(false);

  const totalSlides = slides?.length ?? 0;
  const hasMultipleSlides = totalSlides > 1;

  const setProgressWidth = (percent: number) => {
    if (progressBarRef.current) {
      const clamped = Math.max(0, Math.min(100, percent * 100));
      progressBarRef.current.style.width = `${clamped}%`;
    }
  };

  const resetProgress = (restart = false) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    startTimeRef.current = null;
    elapsedRef.current = 0;
    setProgressWidth(0);
    if (restart) startProgress();
  };

  const startProgress = () => {
    if (!hasMultipleSlides || isPaused || isInteractingRef.current) return;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    startTimeRef.current = performance.now() - elapsedRef.current;

    const step = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      elapsedRef.current = now - startTimeRef.current;
      const progress = Math.min(1, elapsedRef.current / AUTOPLAY_DURATION);
      setProgressWidth(progress);

      if (progress >= 1) {
        setActiveIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
        startTimeRef.current = performance.now();
        elapsedRef.current = 0;
        setProgressWidth(0);
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
  };

  const stopProgress = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const goToSlide = useCallback(
    (index: number) => {
      if (index === activeIndex || isTransitioning) return;
      setIsTransitioning(true);
      setActiveIndex(Math.max(0, Math.min(index, totalSlides - 1)));
      resetProgress(true);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [activeIndex, totalSlides, isTransitioning]
  );

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    resetProgress(true);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [totalSlides, isTransitioning]);

  const goToPrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    resetProgress(true);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [totalSlides, isTransitioning]);

  const handleTouchStart = (e: any) => {
    isInteractingRef.current = true;
    setIsPaused(true);
    stopProgress();
    setTouchStart(e.touches[0].clientX);
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchMove = (e: any) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      swipeDistance > 0 ? goToNext() : goToPrev();
    } else {
      resetProgress(true);
    }

    setTimeout(() => {
      isInteractingRef.current = false;
      setIsPaused(false);
      resetProgress(true);
    }, 120);
  };

  const handleKeyDown = useCallback(
    (e: any) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
      resetProgress(true);
    },
    [goToPrev, goToNext]
  );

  useEffect(() => {
    if (hasMultipleSlides && !isPaused && !isInteractingRef.current) {
      startProgress();
    } else {
      stopProgress();
      if (!hasMultipleSlides) setProgressWidth(0);
    }
    return () => stopProgress();
  }, [hasMultipleSlides, isPaused, activeIndex]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        stopProgress();
      } else {
        resetProgress(true);
      }
    };

    const onResize = () => {
      resetProgress(false);
      if (!isPaused && hasMultipleSlides) startProgress();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, [isPaused, hasMultipleSlides]);

  useEffect(() => {
    if (activeIndex >= totalSlides) {
      setActiveIndex(0);
    }
    resetProgress(true);
  }, [totalSlides]);

  if (!slides || slides.length === 0) return null;

  return (
    <div
      className="relative w-full group"
      onMouseEnter={() => {
        setIsPaused(true);
        stopProgress();
      }}
      onMouseLeave={() => {
        setIsPaused(false);
        resetProgress(true);
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Promotional carousel"
      aria-live="polite"
    >
      <div className="relative w-full overflow-hidden">
        <div
          className={`
            relative overflow-hidden rounded-lg shadow-2xl
            min-h-[280px] sm:min-h-[350px] md:min-h-[420px] lg:min-h-[500px]
            transition-colors duration-700 ease-out
            ${slides[activeIndex]?.bgColor || "bg-[#1a1d2e]"}
          `}
        >
          <div
            className="flex h-full transition-transform duration-700 ease-out "
            style={{
              width: `${totalSlides * 100}%`,
              transform: `translateX(-${activeIndex * (100 / totalSlides)}%)`,
            }}
          >
            {slides.map((slide: any, index: number) => {
              const isActive = index === activeIndex;
              
              return (
                <div
                  key={index}
                  className="w-full  py-10 sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto flex-shrink-0"
                  style={{ width: `${100 / totalSlides}%` }}
                  aria-hidden={!isActive}
                >
                  <div className="h-full flex  sm:flex-row items-center justify-between px-4 sm:px-8 md:px-12 lg:px-16 py-4 sm:py-6 md:py-8 gap-4 sm:gap-6 md:gap-8  w-full g:gap-12">
                    {/* Content Section with Fade-in Animation */}
                    <div
                      className={`
                        flex flex-col gap-2 sm:gap-3 md:gap-4 max-w-[400px] 
                        text-center sm:text-left w-full order-1 sm:order-1
                        transition-all duration-700 ease-out sm:max-w-[500px] md:max-w-[580px] lg:max-w-[650px] xl:max-w-[700px]   
                        ${isActive 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-4'
                        }
                      `}
                      style={{
                        transitionDelay: isActive ? '200ms' : '0ms'
                      }}
                    >
                      {/* Optional dark overlay for text readability */}
                      <div className="relative z-10">
                        {slide.subtitle && (
                          <span className="inline-block text-xs sm:text-sm font-bold tracking-[0.2em] sm:tracking-[0.25em] text-indigo-300 uppercase mb-1 animate-fade-in">
                            {slide.subtitle}
                          </span>
                        )}

                        <h2 className="text-lg sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white drop-shadow-lg">
                          {slide.title}
                        </h2>

                        <p className="text-xs hidden sm:block sm:text-xl text-neutral-200 leading-relaxed mt-2">
                          {slide.shortText}
                        </p>

                        <p className="text-lg sm:text-xl md:text-2xl lg:text-xl font-bold text-neutral-300 mt-2">
                          {slide.discount}
                        </p>

                        {slide.buttonText && (
                          <Link
                            href={slide.buttonLink || "#"}
                            aria-label={`${slide.buttonText} - ${slide.title}`}
                            onClick={() => resetProgress(true)}
                            className="
                              inline-flex items-center justify-center
                              px-5 py-2.5
                              mt-4
                              text-sm sm:text-base md:text-lg lg:text-xl font-semibold
                              bg-indigo-600 text-white
                              rounded-lg shadow-lg
                              transition-all duration-300 ease-out
                              hover:bg-indigo-500 hover:shadow-xl  hover:-translate-y-0.5
                              active:shadow-md
                              focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-transparent
                              max-w-[180px] sm:max-w-[200px] md:max-w-[220px] lg:max-w-[240px] xl:max-w-[260px]
                              mx-auto sm:mx-0
                            "
                          >
                            {slide.buttonText}
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Image Section with Parallax Effect */}
                    <div className="flex items-center justify-center relative w-full order-2 sm:order-2">
                      <div
                        className={`
                          transition-all duration-700 ease-out
                          ${isActive 
                            ? 'opacity-100 translate-x-0 scale-100' 
                            : 'opacity-0 translate-x-8 scale-95'
                          }
                        `}
                        style={{
                          transitionDelay: isActive ? '350ms' : '0ms'
                        }}
                      >
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className={`
                            ${slide.imageStyles}
                            w-full h-auto
                            object-contain
                            drop-shadow-2xl
                            select-none pointer-events-none
                            transition-transform duration-500 ease-out
                            hover:scale-110 hover:rotate-2
                          `}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Buttons with Enhanced Focus Styles */}
      {hasMultipleSlides && (
        <>
          <button
            onClick={goToPrev}
            disabled={isTransitioning}
            className="
              hidden md:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 
              w-12 h-12 lg:w-14 lg:h-14 rounded-full 
              bg-white/10 hover:bg-white/20 backdrop-blur-md text-white 
              items-center justify-center 
              transition-all duration-300 ease-out
              opacity-0 group-hover:opacity-100 
              hover:scale-110 active:scale-95 
              focus:outline-none focus:ring-2 focus:ring-white/70 focus:opacity-100
              disabled:opacity-50 disabled:cursor-not-allowed
              z-20
            "
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 lg:w-7 lg:h-7" />
          </button>

          <button
            onClick={goToNext}
            disabled={isTransitioning}
            className="
              hidden md:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 
              w-12 h-12 lg:w-14 lg:h-14 rounded-full 
              bg-white/10 hover:bg-white/20 backdrop-blur-md text-white 
              items-center justify-center 
              transition-all duration-300 ease-out
              opacity-0 group-hover:opacity-100 
              hover:scale-110 active:scale-95 
              focus:outline-none focus:ring-2 focus:ring-white/70 focus:opacity-100
              disabled:opacity-50 disabled:cursor-not-allowed
              z-20
            "
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 lg:w-7 lg:h-7" />
          </button>
        </>
      )}

      {/* Dot Indicators with Smooth Animation */}
      {hasMultipleSlides && (
        <div
          className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex justify-center items-center gap-2 z-20"
          role="tablist"
          aria-label="Slide navigation"
        >
          {slides.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`
                h-2 sm:h-2.5 rounded-full 
                transition-all duration-300 ease-out
                focus:outline-none focus:ring-2 focus:ring-white/50
                disabled:cursor-not-allowed
                ${
                  index === activeIndex
                    ? "w-8 sm:w-10 bg-indigo-400 shadow-lg"
                    : "w-2 sm:w-2.5 bg-white/40 hover:bg-white/70 hover:scale-125"
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeIndex}
              role="tab"
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      {hasMultipleSlides && (
        <div
          className="
            absolute top-3 sm:top-4 right-3 sm:right-4 
            px-2.5 py-1 sm:px-3 sm:py-1.5 
            bg-black/50 backdrop-blur-md rounded-full 
            text-white text-xs font-medium 
            shadow-lg
            z-20
          "
          aria-live="polite"
          aria-atomic="true"
        >
          {activeIndex + 1} / {totalSlides}
        </div>
      )}

      {/* Enhanced Progress Bar */}
      {hasMultipleSlides && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
          <div
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-600 shadow-lg transition-all ease-linear"
            style={{ width: "0%" }}
          />
        </div>
      )}

    
    </div>
  );
}