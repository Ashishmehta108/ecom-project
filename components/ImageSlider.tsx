"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";


export default function PromoSlider({ slides }: { slides: any[] }) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);
  const dragOffset = useRef(0);

  const next = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 400);
  }, [slides.length, isAnimating]);

  const prev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 400);
  }, [slides.length, isAnimating]);

  useEffect(() => {
    if (!hovered && slides.length > 1) {
      timer.current = setTimeout(next, 4000);
    }
    return () => {
      timer.current && clearTimeout(timer.current);
    };
  }, [hovered, next, index, slides.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    currentX.current = startX.current;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    currentX.current = e.touches[0].clientX;
    dragOffset.current = startX.current - currentX.current;
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;

    if (Math.abs(dragOffset.current) > 40) {
      dragOffset.current > 0 ? next() : prev();
    }

    isDragging.current = false;
    dragOffset.current = 0;
  };

  if (!slides || slides.length === 0) return null;


  return (
    <div
      className="w-full  relative flex flex-col items-center justify-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-[100%] md:w-[100%] lg:w-[100%] overflow-hidden">
        <div
          className="sm:rounded-none sm:m-0 rounded-2xl m-4
             shadow-xl overflow-hidden
             md:py-20 py-12 
             
            bg-[#141621] border border-white/10 dark:border-white/5
            min-h-[320px] xs:min-h-[340px] sm:min-h-[360px]
            md:min-h-[390px] lg:min-h-[440px] xl:min-h-[500px]
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

           {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white backdrop-blur-sm items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={next}
            className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 text-white backdrop-blur-sm items-center justify-center"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
           <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-2">
       {slides.map((_, dot) => (
          <button
            key={dot}
            onClick={() => setIndex(dot)}
            className={`h-2.5 rounded-full transition-all duration-400 ${
              dot === index ? "w-8 bg-white" : "w-2.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

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
