"use client";

import { useEffect } from "react";
//@ts-ignore
import "locomotive-scroll/dist/locomotive-scroll.css";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // IMPORTANT → dynamically import, avoids SSR execution
    import("locomotive-scroll").then((locomotiveModule) => {
      const LocomotiveScroll = locomotiveModule.default;

      const scroll = new LocomotiveScroll({
        el: document.querySelector("[data-scroll-container]") as HTMLElement,
        smooth: true,
        multiplier: 0.6,
      });

      return () => scroll.destroy();
    });
  }, []);

  return <div data-scroll-container>{children}</div>;
}
