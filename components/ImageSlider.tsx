// "use client";

// import { useState, useEffect, useCallback, useRef } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import Link from "next/link";


// export default function PromoSlider({ slides }: { slides: any[] }) {
//   const [index, setIndex] = useState(0);
//   const [hovered, setHovered] = useState(false);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const timer = useRef<NodeJS.Timeout | null>(null);

//   const startX = useRef(0);
//   const currentX = useRef(0);
//   const isDragging = useRef(false);
//   const dragOffset = useRef(0);

//   const next = useCallback(() => {
//     if (isAnimating) return;
//     setIsAnimating(true);
//     setIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
//     setTimeout(() => setIsAnimating(false), 400);
//   }, [slides.length, isAnimating]);

//   const prev = useCallback(() => {
//     if (isAnimating) return;
//     setIsAnimating(true);
//     setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
//     setTimeout(() => setIsAnimating(false), 400);
//   }, [slides.length, isAnimating]);

//   useEffect(() => {
//     if (!hovered && slides.length > 1) {
//       timer.current = setTimeout(next, 4000);
//     }
//     return () => {
//       timer.current && clearTimeout(timer.current);
//     };
//   }, [hovered, next, index, slides.length]);

//   const handleTouchStart = (e: React.TouchEvent) => {
//     startX.current = e.touches[0].clientX;
//     currentX.current = startX.current;
//     isDragging.current = true;
//   };

//   const handleTouchMove = (e: React.TouchEvent) => {
//     if (!isDragging.current) return;
//     currentX.current = e.touches[0].clientX;
//     dragOffset.current = startX.current - currentX.current;
//   };

//   const handleTouchEnd = () => {
//     if (!isDragging.current) return;

//     if (Math.abs(dragOffset.current) > 40) {
//       dragOffset.current > 0 ? next() : prev();
//     }

//     isDragging.current = false;
//     dragOffset.current = 0;
//   };

//   if (!slides || slides.length === 0) return null;


//   return (
//     <div
//       className="w-full  relative flex flex-col items-center justify-center"
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       onTouchStart={handleTouchStart}
//       onTouchMove={handleTouchMove}
//       onTouchEnd={handleTouchEnd}
//     >
//       <div className="relative w-[100%] md:w-[100%] lg:w-[100%] overflow-hidden">
//         <div
//           className="sm:rounded-none sm:m-0 rounded-2xl m-4
//              shadow-xl overflow-hidden
//              md:py-20 py-12 
             
//             bg-[#141621] border border-white/10 dark:border-white/5
//             min-h-[320px] xs:min-h-[340px] sm:min-h-[360px]
//             md:min-h-[390px] lg:min-h-[440px] xl:min-h-[500px]
//             relative
//           "
//         >
//           <div
//             className="flex h-full transition-transform duration-[650ms] ease-[cubic-bezier(.4,0,.2,1)]"
//             style={{
//               width: `${slides.length * 100}%`,
//               transform: `translateX(-${index * (100 / slides.length)}%)`,
//             }}
//           >
//             {slides.map((slide, i) => (
//               <div
//                 key={i}
//                 className="
//                   w-full flex-shrink-0 flex
//                   flex-col-reverse md:flex-row
//                   items-center justify-between
//                   px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20
//                   pt-4 sm:pt-6 md:pt-10
//                   pb-4 sm:pb-8
//                   gap-4 sm:gap-6 md:gap-10
//                   text-center md:text-left
//                 "
//                 style={{ width: `${100 / slides.length}%` }}
//               >
//                 {/* LEFT */}
//                 <div className="flex flex-col gap-2 sm:gap-4 md:gap-6 max-w-[540px] w-full text-white">
//                   <p className="text-white/90 text-sm sm:text-base md:text-lg font-medium">
//                     {slide.subtitle}
//                   </p>

//                   <h1 className="text-white font-extrabold leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
//                     {slide.title}
//                   </h1>

//                   <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
//                     {slide.discount}
//                   </p>

//                   {slide.buttonText && (
//                     <Link
//                       href={slide.buttonLink || "#"}
//                       className="
//                         mt-3 sm:mt-4
//                         block max-w-[200px]
//                         bg-white text-neutral-800
//                         px-5 py-2 sm:px-7 sm:py-3 md:px-8 md:py-4
//                         rounded-xl text-sm sm:text-base font-semibold
//                         shadow-md transition
//                         mx-auto md:mx-0
//                       "
//                     >
//                       {slide.buttonText}
//                     </Link>
//                   )}
//                 </div>

//                 {/* RIGHT IMAGE */}
//                 <div className="flex items-center justify-center w-full md:w-auto">
//                   <img
//                     src={slide.image}
//                     alt=""
//                     className="
//                       object-contain select-none drop-shadow-2xl
//                       h-[180px] xs:h-[200px] sm:h-[220px]
//                       md:h-[260px] lg:h-[300px] xl:h-[320px]
//                       max-w-[95%] md:max-w-none
//                       transition-all duration-500
//                     "
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//            {slides.length > 1 && (
//         <>
//           <button
//             onClick={prev}
//             className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white backdrop-blur-sm items-center justify-center"
//           >
//             <ChevronLeft className="w-6 h-6" />
//           </button>

//           <button
//             onClick={next}
//             className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white backdrop-blur-sm items-center justify-center"
//           >
//             <ChevronRight className="w-6 h-6" />
//           </button>
//         </>
//       )}
//            <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2">
//        {slides.map((_, dot) => (
//           <button
//             key={dot}
//             onClick={() => setIndex(dot)}
//             className={`h-2.5 rounded-full transition-all duration-400 ${
//               dot === index ? "w-8 bg-white" : "w-2.5 bg-white/40"
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useCallback, useRef } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import Link from "next/link";

// export default function PromoSlider({ slides }: { slides: any[] }) {

//   return (
//     <div
//       className="relative w-full h-[600px]  overflow-hidden bg-[#0f1117]"
//       onTouchStart={handleTouchStart}
//       onTouchMove={handleTouchMove}
//       onTouchEnd={handleTouchEnd}
//     >
//       {/* Slide Track */}
//       <div
//         className="flex h-full transition-transform duration-500 ease-out"
//         style={{
//           width: `${slides.length * 100}%`,
//           transform: `translateX(-${index * (100 / slides.length)}%)`,
//         }}
//       >
//         {slides.map((slide, i) => (
//           <div
//             key={i}
//             className="w-full h-full flex-shrink-0 flex items-center justify-center px-6 md:px-20"
//             style={{ width: `${100 / slides.length}%` }}
//           >
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full items-center">
//               {/* Text */}
//               <div className="flex flex-col gap-4 text-center md:text-left">
//                 <p className="text-white/70 text-sm md:text-base tracking-wide uppercase">
//                   {slide.subtitle}
//                 </p>

//                 <h1 className="text-white font-extrabold leading-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
//                   {slide.title}
//                 </h1>

//                 <p className="text-white text-xl md:text-2xl font-semibold">
//                   {slide.discount}
//                 </p>

//                 {slide.buttonText && (
//                   <Link
//                     href={slide.buttonLink || "#"}
//                     className="mt-4 inline-flex items-center justify-center bg-white text-black px-6 py-3 rounded-xl font-semibold text-base"
//                   >
//                     {slide.buttonText}
//                   </Link>
//                 )}
//               </div>

//               {/* Image */}
//               <div className="flex items-center justify-center">
//                 <img
//                   src={slide.image}
//                   alt={slide.title}
//                   className="w-full max-h-[400px] object-contain select-none pointer-events-none"
//                 />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Minimal Arrows */}
//       {slides.length > 1 && (
//         <>
//           <button
//             onClick={prev}
//             className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white backdrop-blur-sm items-center justify-center"
//           >
//             <ChevronLeft className="w-6 h-6" />
//           </button>

//           <button
//             onClick={next}
//             className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white backdrop-blur-sm items-center justify-center"
//           >
//             <ChevronRight className="w-6 h-6" />
//           </button>
//         </>
//       )}

//       {/* Minimal Dots */}
//       <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
//         {slides.map((_, dot) => (
//           <button
//             key={dot}
//             onClick={() => setIndex(dot)}
//             className={`h-2.5 rounded-full transition-all ${
//               dot === index ? "w-8 bg-white" : "w-2.5 bg-white/40"
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Mock Link component for demo
const Link = ({ href, children, className, ...props }: any) => (
  <a href={href} className={className} {...props}>
    {children}
  </a>
);



const AUTOPLAY_DURATION = 5000; // ms

// Sample slides data (kept for fallback/demo)
const DEMO_SLIDES = [
  {
    subtitle: "SUMMER COLLECTION",
    title: "New Arrivals",
    discount: "Up to 50% Off",
    buttonText: "Shop Now",
    buttonLink: "/shop",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
  },
  {
    subtitle: "EXCLUSIVE DEAL",
    title: "Premium Headphones",
    discount: "Limited Time Offer",
    buttonText: "View Details",
    buttonLink: "/products",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
  },
  {
    subtitle: "TECH ESSENTIALS",
    title: "Smart Watches",
    discount: "Starting at $199",
    buttonText: "Explore",
    buttonLink: "/watches",
    image:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
  },
];



export default function PromoSlider({ slides = DEMO_SLIDES }: { slides?: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // refs for autoplay/progress
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const isInteractingRef = useRef(false);
  const mountedRef = useRef(true);

  const totalSlides = slides?.length ?? 0;
  const hasMultipleSlides = totalSlides > 1;

  // ---------- NAVIGATION ----------
  const goToSlide = useCallback(
    (index: number) => {
      if (index === activeIndex) {
        // still reset progress when user taps current dot
        resetProgress(true);
        return;
      }
      setActiveIndex((prev) => {
        const next = Math.max(0, Math.min(index, totalSlides - 1));
        return next;
      });
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

  // ---------- PROGRESS / RAF CONTROL ----------
  function setProgressWidth(percent: number) {
    const el = progressBarRef.current;
    if (!el) return;
    // clamp 0..100
    const clamped = Math.max(0, Math.min(100, percent * 100));
    el.style.width = `${clamped}%`;
  }

  function resetProgress(restart = false) {
    // clear RAF and reset elapsed
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    startTimeRef.current = null;
    elapsedRef.current = 0;
    setProgressWidth(0);
    if (restart) {
      startProgress();
    }
  }

  function startProgress() {
    // don't start if no autoplay conditions
    if (!hasMultipleSlides || isPaused || isInteractingRef.current) return;

    // ensure previous RAF cleared
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
        // move to next slide and continue
        // Use setTimeout to avoid tight RAF recursion in same frame
        // but keep it minimal so UX stays snappy
        setActiveIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
        // restart timing from now
        startTimeRef.current = performance.now();
        elapsedRef.current = 0;
        setProgressWidth(0);
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }

  function stopProgress() {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }

  // ---------- EFFECT: autoplay start/stop based on state ----------
  useEffect(() => {
    // start or stop based on hasMultipleSlides and isPaused / interacting
    if (hasMultipleSlides && !isPaused && !isInteractingRef.current) {
      startProgress();
    } else {
      stopProgress();
      // keep visual state consistent
      if (!hasMultipleSlides) {
        setProgressWidth(0);
      }
    }
    return () => {
      stopProgress();
    };
    // we intentionally listen to hasMultipleSlides/isPaused/activeIndex to restart progress when slide changes
  }, [hasMultipleSlides, isPaused, activeIndex]);

  // ---------- TOUCH / POINTER HANDLERS ----------
  const handleTouchStart = (e: any) => {
    isInteractingRef.current = true;
    setIsPaused(true); // pause autoplay while touching
    stopProgress();
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: any) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartXRef.current - touchEndXRef.current;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      swipeDistance > 0 ? goToNext() : goToPrev();
    } else {
      // if no significant swipe, still reset progress (user tapped)
      resetProgress(true);
    }

    // resume autoplay after a short delay to avoid immediate slide race
    setTimeout(() => {
      isInteractingRef.current = false;
      setIsPaused(false);
      resetProgress(true);
    }, 120); // small delay keeps UX natural
  };

  // For desktop pointer hold behavior (optional but helpful)
  const handlePointerDown = () => {
    isInteractingRef.current = true;
    setIsPaused(true);
    stopProgress();
  };

  const handlePointerUp = () => {
    isInteractingRef.current = false;
    setIsPaused(false);
    resetProgress(true);
  };

  // ---------- KEYBOARD ----------
  const handleKeyDown = useCallback(
    (e: any) => {
      if (e.key === "ArrowLeft") {
        goToPrev();
      }
      if (e.key === "ArrowRight") {
        goToNext();
      }
      // reset progress when user interacts via keyboard
      resetProgress(true);
    },
    [goToPrev, goToNext]
  );

  // ---------- VISIBILITY (tab change) & RESIZE ----------
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        stopProgress();
      } else {
        // reset progress when tab becomes visible to avoid stuck animation
        resetProgress(true);
      }
    };

    const onResize = () => {
      // on layout changes reset progress to prevent mismatch
      resetProgress(false);
      // restart if autoplay allowed
      if (!isPaused && hasMultipleSlides) startProgress();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, hasMultipleSlides]);

  // ---------- CLEANUP ON UNMOUNT ----------
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopProgress();
    };
  }, []);

  // ---------- SLIDES LENGTH CHANGE ----------
  useEffect(() => {
    // if slides count changed and activeIndex is out of bounds, clamp it
    if (activeIndex >= totalSlides) {
      setActiveIndex(0);
    }
    // reset progress when slides change (safeguard)
    resetProgress(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSlides]);

  // ---------- touch refs ----------
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

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
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Promotional carousel"
      aria-live="polite"
    >
      {/* Main Slider Container */}
      <div className="relative w-full overflow-hidden">
        <div
          className="
            relative overflow-hidden
           bg-[#141621]
            rounded-none sm:rounded-2xl
            shadow-2xl
            min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[550px]
          "
        >
          {/* Slides Track */}
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
                className="w-full flex-shrink-0"
                style={{ width: `${100 / totalSlides}%` }}
                aria-hidden={index !== activeIndex}
              >
                <div
                  className="
                    h-full flex flex-col sm:flex-row
                    items-center justify-between
                    px-4 sm:px-6 md:px-12 lg:px-20
                    py-8 sm:py-10 md:py-16 lg:py-20
                    gap-6 sm:gap-8 md:gap-12 lg:gap-16
                  "
                >
                  {/* Image Section */}
                  <div className="flex-1 flex items-center justify-center">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="
                        w-full max-w-[200px] sm:max-w-[280px] md:max-w-[400px] lg:max-w-[480px]
                        h-auto object-contain
                        drop-shadow-2xl
                        select-none pointer-events-none
                        transition-transform duration-700
                        hover:scale-105
                      "
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 flex flex-col gap-3 sm:gap-4 md:gap-6 max-w-xl text-center sm:text-left w-full">
                    <span
                      className="
                        inline-block text-xs sm:text-sm font-bold tracking-[0.15em] sm:tracking-[0.2em]
                        text-indigo-400 uppercase animate-fade-in
                      "
                    >
                      {slide.subtitle}
                    </span>

                    <h2
                      className="
                        text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl
                        font-black leading-[1.1] tracking-tight text-white animate-slide-up
                      "
                    >
                      {slide.title}
                    </h2>

                    <p
                      className="
                        text-base sm:text-lg md:text-xl lg:text-2xl
                        font-semibold text-slate-200 animate-fade-in
                      "
                    >
                      {slide.discount}
                    </p>

                    {slide.buttonText && (
                      <Link
                        href={slide.buttonLink || "#"}
                        className="
                          inline-flex items-center justify-center
                          mt-1 sm:mt-2 md:mt-4
                          px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4
                          bg-white text-slate-900
                          rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold
                          shadow-lg shadow-black/20 hover:bg-blue-50 hover:scale-105 active:scale-95
                          transition-all duration-200 max-w-[180px] sm:max-w-[200px]
                          mx-auto sm:mx-0
                        "
                        aria-label={`${slide.buttonText} - ${slide.title}`}
                        onClick={() => {
                          // reset progress on CTA click
                          resetProgress(true);
                        }}
                      >
                        {slide.buttonText}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {hasMultipleSlides && (
        <>
          <button
            onClick={() => {
              goToPrev();
            }}
            className="
              hidden md:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2
              w-12 h-12 lg:w-14 lg:h-14 rounded-full
              bg-white/10 hover:bg-white/20 backdrop-blur-md text-white
              items-center justify-center transition-all duration-200
              opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-white/50 z-10
            "
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 lg:w-7 lg:h-7" />
          </button>

          <button
            onClick={() => {
              goToNext();
            }}
            className="
              hidden md:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2
              w-12 h-12 lg:w-14 lg:h-14 rounded-full
              bg-white/10 hover:bg-white/20 backdrop-blur-md text-white
              items-center justify-center transition-all duration-200
              opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-white/50 z-10
            "
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 lg:w-7 lg:h-7" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {hasMultipleSlides && (
        <div
          className="
            absolute bottom-6 sm:bottom-8 left-0 right-0
            flex justify-center items-center gap-2 z-10
          "
          role="tablist"
          aria-label="Slide navigation"
        >
          {slides.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ease-out
                ${
                  index === activeIndex
                    ? "w-8 sm:w-10 bg-white shadow-lg shadow-white/30"
                    : "w-2 sm:w-2.5 bg-white/40 hover:bg-white/60"
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
            absolute top-6 right-6
            px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full
            text-white text-xs sm:text-sm font-medium z-10
          "
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
            className="h-full bg-gradient-to-r from-indigo-100 to-indigo-600"
            style={{ width: "0%" }}
          />
        </div>
      )}
    </div>
  );
}
