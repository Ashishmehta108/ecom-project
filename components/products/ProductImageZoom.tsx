"use client";
import { useState, useRef, MouseEvent } from "react";

interface ProductImageZoomProps {
  src: string;
  alt: string;
  zoomScale?: number;
  lensSize?: number;
}

export  function ProductImageZoom({
  src,
  alt,
  zoomScale = 2.5,
  lensSize = 150,
}: ProductImageZoomProps) {
  const [showLens, setShowLens] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const halfLens = lensSize / 2;
    const clampedX = Math.max(halfLens, Math.min(x, rect.width - halfLens));
    const clampedY = Math.max(halfLens, Math.min(y, rect.height - halfLens));

    setLensPosition({ x: clampedX, y: clampedY });
  };

  const handleMouseEnter = () => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      setShowLens(true);
    }
  };

  // Calculate the background position for the zoomed image inside the lens
  const getBackgroundPosition = () => {
    if (!containerRef.current) return "0 0";
    
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate what portion of the image we're hovering over (0 to 1)
    const percentX = lensPosition.x / rect.width;
    const percentY = lensPosition.y / rect.height;
    
    // Calculate the offset needed to center that portion in the lens
    const bgX = lensPosition.x - (percentX * rect.width * zoomScale);
    const bgY = lensPosition.y - (percentY * rect.height * zoomScale);
    
    return `${bgX}px ${bgY}px`;
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div
        ref={containerRef}
        className="relative aspect-square bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden cursor-crosshair"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShowLens(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Base image - always visible and normal size */}
        <img
          ref={imageRef}
          src={src || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop"}
          alt={alt}
          className="w-full h-full object-contain p-4"
        />

        {/* Magnifying lens - only visible on hover */}
        {showLens && (
          <div
            className="absolute pointer-events-none rounded-full border-2 border-neutral-400 dark:border-neutral-600 shadow-2xl"
            style={{
              width: lensSize,
              height: lensSize,
              left: lensPosition.x - lensSize / 2,
              top: lensPosition.y - lensSize / 2,
              backgroundImage: `url(${src || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop"})`,
              backgroundSize: `${zoomScale * 100}%`,
              backgroundPosition: getBackgroundPosition(),
              backgroundRepeat: "no-repeat",
            }}
          />
        )}
      </div>
      
      <p className="text-center mt-4 text-sm text-neutral-600 dark:text-neutral-400">
        Hover over the image to see the zoom lens in action
      </p>
    </div>
  );
}