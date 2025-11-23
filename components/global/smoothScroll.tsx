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
    import("locomotive-scroll").then((locomotiveModule) => {
      const LocomotiveScroll = locomotiveModule.default;

      const scroll = new LocomotiveScroll({
        el: document.querySelector("[data-scroll-container]") as HTMLElement,
        smooth: true,
        multiplier: 1.1,
        smartphone: {
          smooth: true,
        },
        tablet: {
          smooth: true,
          breakpoint: 1024,
        },
      });

      return () => scroll.destroy();
    });
  }, []);

  return <div data-scroll-container>{children}</div>;
}
