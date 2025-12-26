// "use client";

// import { useState, useEffect, useCallback, useRef } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// const Link = ({ href, children, className, ...props }: any) => (
//   <a href={href} className={className} {...props}>
//     {children}
//   </a>
// );

// const AUTOPLAY_DURATION = 5000;

// const DEMO_SLIDES = [
//   {
//     bgColor: "bg-red-950",
//     subtitle: "",
//     title: "Christmas Sale",
//     discount: "Upto 20% Off on all products",
//     shortText: "Limited time offer on all premium products.",
//     buttonText: "Shop Now",
//     buttonLink: "/products?category=black-friday",
//     image: "/christmas.png",
//     imageStyles:
//       "max-w-[180px] sm:max-w-[240px] md:max-w-[320px] lg:max-w-[400px] max-h-[180px] sm:max-h-[240px] md:max-h-[320px] lg:max-h-[400px]",
//   },
//   {
//     bgColor: "bg-blue-900",
//     subtitle: "",
//     title: "Premium Headphones",
//     discount: "Limited Time Offer",
//     shortText: "Experience rich sound, deep bass, and all-day comfort.",
//     buttonText: "View Details",
//     buttonLink: "/products?category=headphones",
//     image: "/promo2.png",
//     imageStyles:
//       "max-w-[200px] sm:max-w-[280px] md:max-w-[380px] lg:max-w-[480px] max-h-[200px] sm:max-h-[280px] md:max-h-[380px] lg:max-h-[480px]",
//   },
//   {
//     bgColor: "bg-slate-900",
//     subtitle: "",
//     title: "New Arrivals",
//     discount: "Exclusive deal",
//     shortText: "Fresh designs made for comfort and everyday style.",
//     buttonText: "Explore",
//     buttonLink: "/products?category=summer",
//     image: "/promo1.png",
//     imageStyles:
//       "max-w-[220px] sm:max-w-[300px] md:max-w-[420px] lg:max-w-[520px] max-h-[220px] sm:max-h-[300px] md:max-h-[420px] lg:max-h-[520px]",
//   },
// ];

// export default function PromoSlider({
//   slides = DEMO_SLIDES,
// }: {
//   slides?: any[];
// }) {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);
//   const [touchStart, setTouchStart] = useState(0);
//   const [touchEnd, setTouchEnd] = useState(0);

//   const rafRef = useRef<number | null>(null);
//   const startTimeRef = useRef<number | null>(null);
//   const elapsedRef = useRef(0);
//   const progressBarRef = useRef<HTMLDivElement | null>(null);
//   const isInteractingRef = useRef(false);

//   const totalSlides = slides?.length ?? 0;
//   const hasMultipleSlides = totalSlides > 1;

//   const setProgressWidth = (percent: number) => {
//     if (progressBarRef.current) {
//       const clamped = Math.max(0, Math.min(100, percent * 100));
//       progressBarRef.current.style.width = `${clamped}%`;
//     }
//   };

//   const resetProgress = (restart = false) => {
//     if (rafRef.current) {
//       cancelAnimationFrame(rafRef.current);
//       rafRef.current = null;
//     }
//     startTimeRef.current = null;
//     elapsedRef.current = 0;
//     setProgressWidth(0);
//     if (restart) startProgress();
//   };

//   const startProgress = () => {
//     if (!hasMultipleSlides || isPaused || isInteractingRef.current) return;

//     if (rafRef.current) {
//       cancelAnimationFrame(rafRef.current);
//       rafRef.current = null;
//     }

//     startTimeRef.current = performance.now() - elapsedRef.current;

//     const step = (now: number) => {
//       if (!startTimeRef.current) startTimeRef.current = now;
//       elapsedRef.current = now - startTimeRef.current;
//       const progress = Math.min(1, elapsedRef.current / AUTOPLAY_DURATION);
//       setProgressWidth(progress);

//       if (progress >= 1) {
//         setActiveIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
//         startTimeRef.current = performance.now();
//         elapsedRef.current = 0;
//         setProgressWidth(0);
//         rafRef.current = requestAnimationFrame(step);
//       } else {
//         rafRef.current = requestAnimationFrame(step);
//       }
//     };

//     rafRef.current = requestAnimationFrame(step);
//   };

//   const stopProgress = () => {
//     if (rafRef.current) {
//       cancelAnimationFrame(rafRef.current);
//       rafRef.current = null;
//     }
//   };

//   const goToSlide = useCallback(
//     (index: number) => {
//       if (index === activeIndex) {
//         resetProgress(true);
//         return;
//       }
//       setActiveIndex(Math.max(0, Math.min(index, totalSlides - 1)));
//       resetProgress(true);
//     },
//     [activeIndex, totalSlides]
//   );

//   const goToNext = useCallback(() => {
//     setActiveIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
//     resetProgress(true);
//   }, [totalSlides]);

//   const goToPrev = useCallback(() => {
//     setActiveIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
//     resetProgress(true);
//   }, [totalSlides]);

//   const handleTouchStart = (e: any) => {
//     isInteractingRef.current = true;
//     setIsPaused(true);
//     stopProgress();
//     setTouchStart(e.touches[0].clientX);
//     setTouchEnd(e.touches[0].clientX);
//   };

//   const handleTouchMove = (e: any) => {
//     setTouchEnd(e.touches[0].clientX);
//   };

//   const handleTouchEnd = () => {
//     const swipeDistance = touchStart - touchEnd;
//     const minSwipeDistance = 50;

//     if (Math.abs(swipeDistance) > minSwipeDistance) {
//       swipeDistance > 0 ? goToNext() : goToPrev();
//     } else {
//       resetProgress(true);
//     }

//     setTimeout(() => {
//       isInteractingRef.current = false;
//       setIsPaused(false);
//       resetProgress(true);
//     }, 120);
//   };

//   const handleKeyDown = useCallback(
//     (e: any) => {
//       if (e.key === "ArrowLeft") goToPrev();
//       if (e.key === "ArrowRight") goToNext();
//       resetProgress(true);
//     },
//     [goToPrev, goToNext]
//   );

//   useEffect(() => {
//     if (hasMultipleSlides && !isPaused && !isInteractingRef.current) {
//       startProgress();
//     } else {
//       stopProgress();
//       if (!hasMultipleSlides) setProgressWidth(0);
//     }
//     return () => stopProgress();
//   }, [hasMultipleSlides, isPaused, activeIndex]);

//   useEffect(() => {
//     const onVisibility = () => {
//       if (document.hidden) {
//         stopProgress();
//       } else {
//         resetProgress(true);
//       }
//     };

//     const onResize = () => {
//       resetProgress(false);
//       if (!isPaused && hasMultipleSlides) startProgress();
//     };

//     document.addEventListener("visibilitychange", onVisibility);
//     window.addEventListener("resize", onResize);
//     return () => {
//       document.removeEventListener("visibilitychange", onVisibility);
//       window.removeEventListener("resize", onResize);
//     };
//   }, [isPaused, hasMultipleSlides]);

//   useEffect(() => {
//     if (activeIndex >= totalSlides) {
//       setActiveIndex(0);
//     }
//     resetProgress(true);
//   }, [totalSlides]);

//   if (!slides || slides.length === 0) return null;

//   return (
//     <div
//       className="relative w-full group"
//       onMouseEnter={() => {
//         setIsPaused(true);
//         stopProgress();
//       }}
//       onMouseLeave={() => {
//         setIsPaused(false);
//         resetProgress(true);
//       }}
//       onTouchStart={handleTouchStart}
//       onTouchMove={handleTouchMove}
//       onTouchEnd={handleTouchEnd}
//       onKeyDown={handleKeyDown}
//       tabIndex={0}
//       role="region"
//       aria-label="Promotional carousel"
//       aria-live="polite"
//     >
//       <div className="relative w-full overflow-hidden">
//         <div
//           className={`
//     relative overflow-hidden rounded-none shadow-2xl
//     min-h-[380px] sm:min-h-[450px] md:min-h-[520px] lg:min-h-[600px]
//     transition-colors duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
//     ${slides[activeIndex]?.bgColor || "bg-[#1a1d2e]"}
//   `}
//         >
//           <div
//             className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
//             style={{
//               width: `${totalSlides * 100}%`,
//               transform: `translateX(-${activeIndex * (100 / totalSlides)}%)`,
//             }}
//           >
//             {slides.map((slide: any, index: number) => (
//               <div
//                 key={index}
//                 className="w-full flex-shrink-0"
//                 style={{ width: `${100 / totalSlides}%` }}
//                 aria-hidden={index !== activeIndex}
//               >
//                 <div
//                   className="h-full flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 md:px-12 lg:px-20 pt-6 sm:pt-10 md:pt-14 lg:pt-16 pb-0 gap-4 sm:gap-8 md:gap-12 lg:gap-16 flex-col-reverse
// "
//                 >
//                   {/* Image Section */}
//                   <div className="flex-1 flex items-end justify-center h-full relative w-full">
//                     <img
//                       src={slide.image}
//                       alt={slide.title}
//                       className={`
//     ${slide.imageStyles}
//     w-full h-auto
//     object-contain
//     drop-shadow-2xl
//     select-none pointer-events-none
//     transition-transform duration-700 hover:scale-105

//     md:translate-y-4 lg:translate-y-6
//   `}
//                     />
//                   </div>

//                   {/* Content Section */}
//                   <div className="flex-1 flex flex-col gap-2 sm:gap-3 md:gap-5 max-w-xl text-center sm:text-left w-full pb-8 sm:pb-12 md:pb-14">
//                     <span className="inline-block text-xs sm:text-sm font-bold tracking-[0.2em] sm:tracking-[0.25em] text-indigo-400 uppercase">
//                       {slide.subtitle}
//                     </span>

//                     <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight text-white">
//                       {slide.title}
//                     </h2>

//                     <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
//                       {slide.shortText}
//                     </p>

//                     <p className="text-base sm:text-lg md:text-xl font-bold text-white">
//                       {slide.discount}
//                     </p>

//                     {slide.buttonText && (
//                       <Link
//                         href={slide.buttonLink || "#"}
//                         className="inline-flex items-center justify-center mt-1 sm:mt-2 px-6 sm:px-7 md:px-9 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm sm:text-base font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 max-w-[180px] sm:max-w-[200px] mx-auto sm:mx-0"
//                         aria-label={`${slide.buttonText} - ${slide.title}`}
//                         onClick={() => resetProgress(true)}
//                       >
//                         {slide.buttonText}
//                       </Link>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Navigation Buttons */}
//       {hasMultipleSlides && (
//         <>
//           <button
//             onClick={goToPrev}
//             className="hidden md:flex absolute left-6 lg:left-8 top-1/2 -translate-y-1/2 w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 z-20"
//             aria-label="Previous slide"
//           >
//             <ChevronLeft className="w-7 h-7 lg:w-8 lg:h-8" />
//           </button>

//           <button
//             onClick={goToNext}
//             className="hidden md:flex absolute right-6 lg:right-8 top-1/2 -translate-y-1/2 w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 z-20"
//             aria-label="Next slide"
//           >
//             <ChevronRight className="w-7 h-7 lg:w-8 lg:h-8" />
//           </button>
//         </>
//       )}

//       {/* Dot Indicators */}
//       {hasMultipleSlides && (
//         <div
//           className="absolute bottom-6 sm:bottom-8 left-0 right-0 flex justify-center items-center gap-2 z-20"
//           role="tablist"
//           aria-label="Slide navigation"
//         >
//           {slides.map((_: any, index: number) => (
//             <button
//               key={index}
//               onClick={() => goToSlide(index)}
//               className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
//                 index === activeIndex
//                   ? "w-8 sm:w-10 bg-indigo-500"
//                   : "w-2 sm:w-2.5 bg-white/40 hover:bg-white/60"
//               }`}
//               aria-label={`Go to slide ${index + 1}`}
//               aria-current={index === activeIndex}
//               role="tab"
//             />
//           ))}
//         </div>
//       )}

//       {/* Slide Counter */}
//       {hasMultipleSlides && (
//         <div
//           className="absolute top-4 sm:top-6 right-4 sm:right-6 px-3 py-1.5 sm:px-4 sm:py-2 bg-black/40 backdrop-blur-md rounded-full text-white text-xs sm:text-sm font-medium z-20"
//           aria-live="polite"
//         >
//           {activeIndex + 1} / {totalSlides}
//         </div>
//       )}

//       {/* Progress Bar */}
//       {hasMultipleSlides && (
//         <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
//           <div
//             ref={progressBarRef}
//             className="h-full bg-gradient-to-r from-indigo-100  to-indigo-500"
//             style={{ width: "0%" }}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/app/context/languageContext";

const Link = ({ href, children, className, ...props }: any) => (
  <a href={href} className={className} {...props}>
    {children}
  </a>
);

const AUTOPLAY_DURATION = 5000;

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
      if (index === activeIndex) {
        resetProgress(true);
        return;
      }
      setActiveIndex(Math.max(0, Math.min(index, totalSlides - 1)));
      resetProgress(true);
    },
    [activeIndex, totalSlides]
  );

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    resetProgress(true);
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    resetProgress(true);
  }, [totalSlides]);

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
    relative overflow-hidden rounded-none shadow-2xl
    min-h-[280px] sm:min-h-[350px] md:min-h-[420px] lg:min-h-[500px]
    transition-colors duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
    ${slides[activeIndex]?.bgColor || "bg-[#1a1d2e]"}
  `}
        >
          <div
            className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{
              width: `${totalSlides * 100}%`,
              transform: `translateX(-${activeIndex * (100 / totalSlides)}%)`,
            }}
          >
            {slides.map((slide: any, index: number) => (
              <div
                key={index}
                className="w-full py-10 max-w-3xl mx-auto flex-shrink-0"
                style={{ width: `${100 / totalSlides}%` }}
                aria-hidden={index !== activeIndex}
              >
                <div className="h-full flex flex-col max-w-full sm:flex-row items-center justify-between px-4 sm:px-8 md:px-12 lg:px-16 py-4 sm:py-6 md:py-8 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
                  {/* Content Section */}
                  <div className="  flex flex-col gap-2 sm:gap-3 md:gap-4 max-w-[400px] text-center sm:text-left w-full  order-1 sm:order-1">
                    {slide.subtitle && (
                      <span className="inline-block text-xs sm:text-sm font-bold tracking-[0.2em] sm:tracking-[0.25em] text-indigo-400 uppercase">
                        {slide.subtitle}
                      </span>
                    )}

                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white">
                      {slide.title}
                    </h2>

                    <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                      {slide.shortText}
                    </p>

                    <p className="text-base sm:text-lg md:text-xl font-bold text-white">
                      {slide.discount}
                    </p>

                    {slide.buttonText && (
                      <Link
                        href={slide.buttonLink || "#"}
                        className="inline-flex items-center justify-center mt-1 sm:mt-2 px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm sm:text-base font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 max-w-[160px] sm:max-w-[180px] mx-auto sm:mx-0"
                        aria-label={`${slide.buttonText} - ${slide.title}`}
                        onClick={() => resetProgress(true)}
                      >
                        {slide.buttonText}
                      </Link>
                    )}
                  </div>

                  {/* Image Section */}
                  <div className="  flex items-center justify-center relative w-full ">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className={`
    ${slide.imageStyles}
    w-full h-auto
    object-contain
    drop-shadow-2xl
    select-none pointer-events-none
    transition-transform duration-700 hover:scale-105
  `}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      {hasMultipleSlides && (
        <>
          <button
            onClick={goToPrev}
            className="hidden md:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 lg:w-7 lg:h-7" />
          </button>

          <button
            onClick={goToNext}
            className="hidden md:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 lg:w-7 lg:h-7" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
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
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-8 sm:w-10 bg-indigo-500"
                  : "w-2 sm:w-2.5 bg-white/40 hover:bg-white/60"
              }`}
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
          className="absolute top-3 sm:top-4 right-3 sm:right-4 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-black/40 backdrop-blur-md rounded-full text-white text-xs font-medium z-20"
          aria-live="polite"
        >
          {activeIndex + 1} / {totalSlides}
        </div>
      )}

      {/* Progress Bar */}
      {hasMultipleSlides && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
          <div
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-indigo-100  to-indigo-500"
            style={{ width: "0%" }}
          />
        </div>
      )}
    </div>
  );
}
