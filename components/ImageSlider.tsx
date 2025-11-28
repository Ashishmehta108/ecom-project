// "use client";

// import { useState, useEffect, useCallback, useRef } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// // Mock Link component for demo
// const Link = ({ href, children, className, ...props }: any) => (
//   <a href={href} className={className} {...props}>
//     {children}
//   </a>
// );

// const AUTOPLAY_DURATION = 5000; // ms

// // Sample slides data (kept for fallback/demo)
// const DEMO_SLIDES = [

//   {
//     subtitle: "SUMMER COLLECTION",
//     title: "New Arrivals",
//     discount: "Up to 50% Off",
//     shortText: "Fresh designs made for comfort and everyday style.",
//     buttonText: "Shop Now",
//     buttonLink: "/products?category=4cLPvcx8OSJFq2ip0Duix",
//     image:
//       "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
//   },

//   {
//     subtitle: "EXCLUSIVE DEAL",
//     title: "Premium Headphones",
//     discount: "Limited Time Offer",
//     shortText: "Experience rich sound, deep bass, and all-day comfort.",
//     buttonText: "View Details",
//     buttonLink: "/products?category=UJC5MstDEmoMXfzgQsLuG",
//     image:
//       "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
//   },

//   {
//     subtitle: "TECH ESSENTIALS",
//     title: "Smart Watches",
//     discount: "Starting at $199",
//     shortText: "Track your health, stay connected, and move smarter.",
//     buttonText: "Explore",
//     buttonLink: "/products?category=UJC5MstDEmoMXfzgQsLuG",
//     image:
//       "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80",
//   },
// ];

// export default function PromoSlider({
//   slides = DEMO_SLIDES,
// }: {
//   slides?: any[];
// }) {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);

//   const rafRef = useRef<number | null>(null);
//   const startTimeRef = useRef<number | null>(null);
//   const elapsedRef = useRef(0);
//   const progressBarRef = useRef<HTMLDivElement | null>(null);
//   const isInteractingRef = useRef(false);
//   const mountedRef = useRef(true);

//   const totalSlides = slides?.length ?? 0;
//   const hasMultipleSlides = totalSlides > 1;

//   // ---------- NAVIGATION ----------
//   const goToSlide = useCallback(
//     (index: number) => {
//       if (index === activeIndex) {
//         resetProgress(true);
//         return;
//       }
//       setActiveIndex((prev) => {
//         const next = Math.max(0, Math.min(index, totalSlides - 1));
//         return next;
//       });
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

//   function setProgressWidth(percent: number) {
//     const el = progressBarRef.current;
//     if (!el) return;
//     // clamp 0..100
//     const clamped = Math.max(0, Math.min(100, percent * 100));
//     el.style.width = `${clamped}%`;
//   }

//   function resetProgress(restart = false) {
//     // clear RAF and reset elapsed
//     if (rafRef.current) {
//       cancelAnimationFrame(rafRef.current);
//       rafRef.current = null;
//     }
//     startTimeRef.current = null;
//     elapsedRef.current = 0;
//     setProgressWidth(0);
//     if (restart) {
//       startProgress();
//     }
//   }

//   function startProgress() {
//     // don't start if no autoplay conditions
//     if (!hasMultipleSlides || isPaused || isInteractingRef.current) return;

//     // ensure previous RAF cleared
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
//         // move to next slide and continue
//         // Use setTimeout to avoid tight RAF recursion in same frame
//         // but keep it minimal so UX stays snappy
//         setActiveIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
//         // restart timing from now
//         startTimeRef.current = performance.now();
//         elapsedRef.current = 0;
//         setProgressWidth(0);
//         rafRef.current = requestAnimationFrame(step);
//       } else {
//         rafRef.current = requestAnimationFrame(step);
//       }
//     };

//     rafRef.current = requestAnimationFrame(step);
//   }

//   function stopProgress() {
//     if (rafRef.current) {
//       cancelAnimationFrame(rafRef.current);
//       rafRef.current = null;
//     }
//   }

//   // ---------- EFFECT: autoplay start/stop based on state ----------
//   useEffect(() => {
//     // start or stop based on hasMultipleSlides and isPaused / interacting
//     if (hasMultipleSlides && !isPaused && !isInteractingRef.current) {
//       startProgress();
//     } else {
//       stopProgress();
//       // keep visual state consistent
//       if (!hasMultipleSlides) {
//         setProgressWidth(0);
//       }
//     }
//     return () => {
//       stopProgress();
//     };
//     // we intentionally listen to hasMultipleSlides/isPaused/activeIndex to restart progress when slide changes
//   }, [hasMultipleSlides, isPaused, activeIndex]);

//   // ---------- TOUCH / POINTER HANDLERS ----------
//   const handleTouchStart = (e: any) => {
//     isInteractingRef.current = true;
//     setIsPaused(true); // pause autoplay while touching
//     stopProgress();
//     touchStartXRef.current = e.touches[0].clientX;
//     touchEndXRef.current = e.touches[0].clientX;
//   };

//   const handleTouchMove = (e: any) => {
//     touchEndXRef.current = e.touches[0].clientX;
//   };

//   const handleTouchEnd = () => {
//     const swipeDistance = touchStartXRef.current - touchEndXRef.current;
//     const minSwipeDistance = 50;

//     if (Math.abs(swipeDistance) > minSwipeDistance) {
//       swipeDistance > 0 ? goToNext() : goToPrev();
//     } else {
//       // if no significant swipe, still reset progress (user tapped)
//       resetProgress(true);
//     }

//     // resume autoplay after a short delay to avoid immediate slide race
//     setTimeout(() => {
//       isInteractingRef.current = false;
//       setIsPaused(false);
//       resetProgress(true);
//     }, 120); // small delay keeps UX natural
//   };

//   // For desktop pointer hold behavior (optional but helpful)
//   const handlePointerDown = () => {
//     isInteractingRef.current = true;
//     setIsPaused(true);
//     stopProgress();
//   };

//   const handlePointerUp = () => {
//     isInteractingRef.current = false;
//     setIsPaused(false);
//     resetProgress(true);
//   };

//   // ---------- KEYBOARD ----------
//   const handleKeyDown = useCallback(
//     (e: any) => {
//       if (e.key === "ArrowLeft") {
//         goToPrev();
//       }
//       if (e.key === "ArrowRight") {
//         goToNext();
//       }
//       // reset progress when user interacts via keyboard
//       resetProgress(true);
//     },
//     [goToPrev, goToNext]
//   );

//   // ---------- VISIBILITY (tab change) & RESIZE ----------
//   useEffect(() => {
//     const onVisibility = () => {
//       if (document.hidden) {
//         stopProgress();
//       } else {
//         // reset progress when tab becomes visible to avoid stuck animation
//         resetProgress(true);
//       }
//     };

//     const onResize = () => {
//       // on layout changes reset progress to prevent mismatch
//       resetProgress(false);
//       // restart if autoplay allowed
//       if (!isPaused && hasMultipleSlides) startProgress();
//     };

//     document.addEventListener("visibilitychange", onVisibility);
//     window.addEventListener("resize", onResize);
//     return () => {
//       document.removeEventListener("visibilitychange", onVisibility);
//       window.removeEventListener("resize", onResize);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isPaused, hasMultipleSlides]);

//   // ---------- CLEANUP ON UNMOUNT ----------
//   useEffect(() => {
//     mountedRef.current = true;
//     return () => {
//       mountedRef.current = false;
//       stopProgress();
//     };
//   }, []);

//   // ---------- SLIDES LENGTH CHANGE ----------
//   useEffect(() => {
//     // if slides count changed and activeIndex is out of bounds, clamp it
//     if (activeIndex >= totalSlides) {
//       setActiveIndex(0);
//     }
//     // reset progress when slides change (safeguard)
//     resetProgress(true);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [totalSlides]);

//   // ---------- touch refs ----------
//   const touchStartXRef = useRef(0);
//   const touchEndXRef = useRef(0);

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
//       onPointerDown={handlePointerDown}
//       onPointerUp={handlePointerUp}
//       onKeyDown={handleKeyDown}
//       tabIndex={0}
//       role="region"
//       aria-label="Promotional carousel"
//       aria-live="polite"
//     >
//       {/* Main Slider Container */}
//       <div className="relative w-full overflow-hidden">
//         <div
//           className="
//             relative overflow-hidden
//            bg-[#141621]
//             rounded-none
//             shadow-2xl
//             pb-10
//             min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[550px]
//           "
//         >
//           {/* Slides Track */}
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
//                   className="
//                     h-full flex flex-col sm:flex-row
//                     items-center justify-between
//                     px-4 sm:px-6 md:px-12 lg:px-20
//                     py-8 sm:py-10 md:py-16 lg:py-20
//                     gap-6 sm:gap-8 md:gap-12 lg:gap-16
//                   "
//                 >
//                   {/* Image Section */}
//                   <div className="flex-1 flex items-center justify-center">
//                     <img
//                       src={slide.image}
//                       alt={slide.title}
//                       className="
//                         w-full max-w-[200px] sm:max-w-[280px] md:max-w-[400px] lg:max-w-[480px]
//                         h-auto object-contain
//                         drop-shadow-2xl
//                         select-none pointer-events-none
//                         transition-transform duration-700
//                         hover:scale-105
//                       "
//                       loading={index === 0 ? "eager" : "lazy"}
//                     />
//                   </div>

//                   {/* Content Section */}
//                   <div className="flex-1 flex flex-col gap-3 sm:gap-4 md:gap-6 max-w-xl text-center sm:text-left w-full">
//                     <span
//                       className="
//                         inline-block text-xs sm:text-sm font-bold tracking-[0.15em] sm:tracking-[0.2em]
//                         text-indigo-400 uppercase animate-fade-in
//                       "
//                     >
//                       {slide.subtitle}
//                     </span>

//                     <h2
//                       className="
//                         text-3xl sm:text-4xl md:text-5xl lg:text-6xl
//                         font-black leading-[1.1] tracking-tight text-white animate-slide-up
//                       "
//                     >
//                       {slide.title}
//                     </h2>
//                     <p className="text-base  text-neutral-100">
//                       {slide.shortText}
//                     </p>
//                     <p
//                       className="
//                         text-base sm:text-lg md:text-xl
//                         font-semibold text-slate-200 animate-fade-in
//                       "
//                     >
//                       {slide.discount}
//                     </p>

//                     {slide.buttonText && (
//                       <Link
//                         href={slide.buttonLink || "#"}
//                         className="
//                           inline-flex items-center justify-center
//                           mt-1 sm:mt-2 md:mt-4
//                           px-5 sm:px-6 md:px-8 py-2.5 sm:py-3
//                           bg-white text-slate-900
//                           rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold
//                           shadow-lg shadow-black/20 hover:bg-blue-50 hover:scale-101 active:scale-95
//                           transition-all duration-200 max-w-[180px] sm:max-w-[200px]
//                           mx-auto sm:mx-0
//                         "
//                         aria-label={`${slide.buttonText} - ${slide.title}`}
//                         onClick={() => {
//                           resetProgress(true);
//                         }}
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

//       {hasMultipleSlides && (
//         <>
//           <button
//             onClick={() => {
//               goToPrev();
//             }}
//             className="
//               hidden md:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2
//               w-12 h-12 lg:w-14 lg:h-14 rounded-full
//               bg-white/10 hover:bg-white/20 backdrop-blur-md text-white
//               items-center justify-center transition-all duration-200
//               opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95
//               focus:outline-none focus:ring-2 focus:ring-white/50 z-10
//             "
//             aria-label="Previous slide"
//           >
//             <ChevronLeft className="w-6 h-6 lg:w-7 lg:h-7" />
//           </button>

//           <button
//             onClick={() => {
//               goToNext();
//             }}
//             className="
//               hidden md:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2
//               w-12 h-12 lg:w-14 lg:h-14 rounded-full
//               bg-white/10 hover:bg-white/20 backdrop-blur-md text-white
//               items-center justify-center transition-all duration-200
//               opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95
//               focus:outline-none focus:ring-2 focus:ring-white/50 z-10
//             "
//             aria-label="Next slide"
//           >
//             <ChevronRight className="w-6 h-6 lg:w-7 lg:h-7" />
//           </button>
//         </>
//       )}

//       {/* Dot Indicators */}
//       {hasMultipleSlides && (
//         <div
//           className="
//             absolute bottom-6 sm:bottom-8 left-0 right-0
//             flex justify-center items-center gap-2 z-10
//           "
//           role="tablist"
//           aria-label="Slide navigation"
//         >
//           {slides.map((_: any, index: number) => (
//             <button
//               key={index}
//               onClick={() => goToSlide(index)}
//               className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ease-out
//                 ${
//                   index === activeIndex
//                     ? "w-8 sm:w-10 bg-white shadow-lg shadow-white/30"
//                     : "w-2 sm:w-2.5 bg-white/40 hover:bg-white/60"
//                 }
//               `}
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
//           className="
//             absolute top-6 right-6
//             px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full
//             text-white text-xs sm:text-sm font-medium z-10
//           "
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
//             className="h-full bg-gradient-to-r from-indigo-100 to-indigo-600"
//             style={{ width: "0%" }}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

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
//     subtitle: "BLACK FRIDAY",
//     title: "Mega Sale",
//     discount: "Black Friday Sale 20% Off",
//     shortText: "Limited time offer on all premium products.",
//     buttonText: "Shop Now",
//     buttonLink: "/products?category=black-friday",
//     image: "/promo3.png",
//     imageStyles: "max-w-[340px] sm:max-w-[420px] md:max-w-[520px] lg:max-w-[600px] max-h-[360px] sm:max-h-[440px] md:max-h-[500px] lg:max-h-[560px]"
//   },
//   {
//     subtitle: "EXCLUSIVE DEAL",
//     title: "Premium Headphones",
//     discount: "Limited Time Offer",
//     shortText: "Experience rich sound, deep bass, and all-day comfort.",
//     buttonText: "View Details",
//     buttonLink: "/products?category=headphones",
//     image: "/promo2.png",
//     imageStyles: "max-w-[300px] sm:max-w-[380px] md:max-w-[460px] lg:max-w-[540px] max-h-[340px] sm:max-h-[420px] md:max-h-[480px] lg:max-h-[540px]"
//   },
//   {
//     subtitle: "SUMMER COLLECTION",
//     title: "New Arrivals",
//     discount: "Up to 50% Off",
//     shortText: "Fresh designs made for comfort and everyday style.",
//     buttonText: "Explore",
//     buttonLink: "/products?category=summer",
//     image: "/promo1.png",
//     imageStyles: "max-w-[320px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[580px] max-h-[350px] sm:max-h-[430px] md:max-h-[490px] lg:max-h-[550px]"
//   },
// ];

// export default function PromoSlider({ slides = DEMO_SLIDES }: { slides?: any[] }) {
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

//   const goToSlide = useCallback((index: number) => {
//     if (index === activeIndex) {
//       resetProgress(true);
//       return;
//     }
//     setActiveIndex(Math.max(0, Math.min(index, totalSlides - 1)));
//     resetProgress(true);
//   }, [activeIndex, totalSlides]);

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

//   const handleKeyDown = useCallback((e: any) => {
//     if (e.key === "ArrowLeft") goToPrev();
//     if (e.key === "ArrowRight") goToNext();
//     resetProgress(true);
//   }, [goToPrev, goToNext]);

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
//         <div className="relative overflow-hidden bg-gradient-to-br from-[#0f1117] via-[#141621] to-[#1a1d2e] rounded-2xl shadow-2xl min-h-[460px] sm:min-h-[520px] md:min-h-[580px] lg:min-h-[620px]">
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
//                 <div className="h-full flex flex-col sm:flex-row items-end justify-between px-6 sm:px-8 md:px-14 lg:px-24 pt-10 sm:pt-12 md:pt-16 lg:pt-20 pb-0 gap-8 sm:gap-10 md:gap-14 lg:gap-20">

//                   {/* Image Section */}
//                   <div className="flex-1 flex items-end justify-center h-full relative">
//                     <div className="absolute inset-0 bg-gradient-radial from-indigo-500/5 via-transparent to-transparent blur-3xl"></div>
//                     <img
//                       src={slide.image}
//                       alt={slide.title}
//                       className={`
//                         ${slide.imageStyles}
//                         w-full h-auto
//                         object-contain object-bottom
//                         drop-shadow-[0_20px_60px_rgba(99,102,241,0.25)]
//                         select-none pointer-events-none
//                         transition-all duration-700
//                         hover:scale-[1.08] hover:drop-shadow-[0_25px_70px_rgba(99,102,241,0.35)]
//                         relative z-10
//                       `}
//                       loading={index === 0 ? "eager" : "lazy"}
//                     />
//                   </div>

//                   {/* Content Section */}
//                   <div className="flex-1 flex flex-col gap-4 sm:gap-5 md:gap-7 max-w-xl text-center sm:text-left w-full pb-12 sm:pb-14 md:pb-16">
//                     <span className="inline-block text-xs sm:text-sm font-bold tracking-[0.2em] sm:tracking-[0.25em] text-indigo-400 uppercase">
//                       {slide.subtitle}
//                     </span>

//                     <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-white">
//                       {slide.title}
//                     </h2>

//                     <p className="text-base sm:text-lg text-neutral-200 leading-relaxed">
//                       {slide.shortText}
//                     </p>

//                     <p className="text-lg sm:text-xl md:text-2xl font-bold text-white bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
//                       {slide.discount}
//                     </p>

//                     {slide.buttonText && (
//                       <Link
//                         href={slide.buttonLink || "#"}
//                         className="inline-flex items-center justify-center mt-2 sm:mt-4 px-7 sm:px-9 md:px-11 py-3.5 sm:py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl text-base sm:text-lg font-bold shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all duration-300 max-w-[200px] sm:max-w-[220px] mx-auto sm:mx-0"
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
//             className="hidden md:flex absolute left-6 lg:left-8 top-1/2 -translate-y-1/2 w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-xl text-white items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg z-20"
//             aria-label="Previous slide"
//           >
//             <ChevronLeft className="w-7 h-7 lg:w-8 lg:h-8" />
//           </button>

//           <button
//             onClick={goToNext}
//             className="hidden md:flex absolute right-6 lg:right-8 top-1/2 -translate-y-1/2 w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-xl text-white items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg z-20"
//             aria-label="Next slide"
//           >
//             <ChevronRight className="w-7 h-7 lg:w-8 lg:h-8" />
//           </button>
//         </>
//       )}

//       {/* Dot Indicators */}
//       {hasMultipleSlides && (
//         <div className="absolute bottom-8 sm:bottom-10 left-0 right-0 flex justify-center items-center gap-2.5 z-20" role="tablist" aria-label="Slide navigation">
//           {slides.map((_: any, index: number) => (
//             <button
//               key={index}
//               onClick={() => goToSlide(index)}
//               className={`h-2.5 sm:h-3 rounded-full transition-all duration-300 ${
//                 index === activeIndex
//                   ? "w-10 sm:w-12 bg-white shadow-lg shadow-white/40"
//                   : "w-2.5 sm:w-3 bg-white/40 hover:bg-white/70"
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
//         <div className="absolute top-8 right-8 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-sm sm:text-base font-semibold z-20 shadow-lg" aria-live="polite">
//           {activeIndex + 1} / {totalSlides}
//         </div>
//       )}

//       {/* Progress Bar */}
//       {hasMultipleSlides && (
//         <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10 overflow-hidden rounded-b-2xl">
//           <div
//             ref={progressBarRef}
//             className="h-full bg-gradient-to-r from-indigo-400 via-purple-500 to-indigo-600 shadow-lg shadow-indigo-500/50"
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

const Link = ({ href, children, className, ...props }: any) => (
  <a href={href} className={className} {...props}>
    {children}
  </a>
);

const AUTOPLAY_DURATION = 5000;

const DEMO_SLIDES = [
  {
    subtitle: "",
    title: "Black Friday Sale",
    discount: " 20% Off on all products",
    shortText: "Limited time offer on all premium products.",
    buttonText: "Shop Now",
    buttonLink: "/products?category=black-friday",
    image: "/promo3.png",
    imageStyles:
      "max-w-[280px] sm:max-w-[340px] md:max-w-[420px] lg:max-w-[500px] max-h-[320px] sm:max-h-[380px] md:max-h-[440px] lg:max-h-[500px]",
  },
  {
    subtitle: "",
    title: "Premium Headphones",
    discount: "Limited Time Offer",
    shortText: "Experience rich sound, deep bass, and all-day comfort.",
    buttonText: "View Details",
    buttonLink: "/products?category=headphones",
    image: "/promo2.png",
    imageStyles:
      "max-w-[300px] sm:max-w-[380px] md:max-w-[460px] lg:max-w-[540px] max-h-[340px] sm:max-h-[420px] md:max-h-[480px] lg:max-h-[540px]",
  },
  {
    subtitle: "",
    title: "New Arrivals",
    discount: "Up to 50% Off",
    shortText: "Fresh designs made for comfort and everyday style.",
    buttonText: "Explore",
    buttonLink: "/products?category=summer",
    image: "/promo1.png",
    imageStyles:
      "max-w-[320px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[580px] max-h-[350px] sm:max-h-[430px] md:max-h-[490px] lg:max-h-[550px]",
  },
];

export default function PromoSlider({
  slides = DEMO_SLIDES,
}: {
  slides?: any[];
}) {
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
        <div className="relative overflow-hidden bg-[#1a1d2e] rounded-none shadow-2xl min-h-[460px] sm:min-h-[520px] md:min-h-[580px] lg:min-h-[620px]">
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
                  className="h-full flex flex-col sm:flex-row items-center justify-between px-6 sm:px-8 md:px-14 lg:px-24 pt-10 sm:pt-12 md:pt-16 lg:pt-20 pb-0 gap-8 sm:gap-10 md:gap-14 lg:gap-20 flex-col-reverse
"
                >
                  {/* Image Section */}
                  <div className="flex-1 flex items-end justify-center h-full relative">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className={`
                              ${slide.imageStyles}
                              w-full h-auto
                              object-contain object-bottom
                              drop-shadow-2xl
                              select-none pointer-events-none
                              transition-transform duration-700
                              hover:scale-105
                              relative z-10
                          ${index === 0 ? "scale-110 sm:scale-125 md:scale-150" : ""}
                            `}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 flex flex-col gap-3 sm:gap-4 md:gap-6 max-w-xl text-center sm:text-left w-full pb-12 sm:pb-14 md:pb-16">
                    <span className="inline-block text-xs sm:text-sm font-bold tracking-[0.2em] sm:tracking-[0.25em] text-indigo-400 uppercase">
                      {slide.subtitle}
                    </span>

                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-white">
                      {slide.title}
                    </h2>

                    <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
                      {slide.shortText}
                    </p>

                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                      {slide.discount}
                    </p>

                    {slide.buttonText && (
                      <Link
                        href={slide.buttonLink || "#"}
                        className="inline-flex items-center justify-center mt-2 sm:mt-3 px-7 sm:px-8 md:px-10 py-3 sm:py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-base sm:text-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 max-w-[200px] sm:max-w-[220px] mx-auto sm:mx-0"
                        aria-label={`${slide.buttonText} - ${slide.title}`}
                        onClick={() => resetProgress(true)}
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

      {/* Navigation Buttons */}
      {hasMultipleSlides && (
        <>
          <button
            onClick={goToPrev}
            className="hidden md:flex absolute left-6 lg:left-8 top-1/2 -translate-y-1/2 w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-7 h-7 lg:w-8 lg:h-8" />
          </button>

          <button
            onClick={goToNext}
            className="hidden md:flex absolute right-6 lg:right-8 top-1/2 -translate-y-1/2 w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="w-7 h-7 lg:w-8 lg:h-8" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {hasMultipleSlides && (
        <div
          className="absolute bottom-8 sm:bottom-10 left-0 right-0 flex justify-center items-center gap-2.5 z-20"
          role="tablist"
          aria-label="Slide navigation"
        >
          {slides.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2.5 sm:h-3 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-10 sm:w-12 bg-indigo-500"
                  : "w-2.5 sm:w-3 bg-white/40 hover:bg-white/60"
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
          className="absolute top-8 right-8 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full text-white text-sm sm:text-base font-medium z-20"
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
