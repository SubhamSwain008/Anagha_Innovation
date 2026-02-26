"use client";

import { useRef, useEffect, type ReactNode, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * A section that scrolls its `children` horizontally as user scrolls vertically (pin-style).
 */
export default function HorizontalScroll({ children, className, style }: HorizontalScrollProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const totalWidth = track.scrollWidth - section.offsetWidth;

    gsap.to(track, {
      x: -totalWidth,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${totalWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section) t.kill();
      });
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={className}
      style={{ overflow: "hidden", ...style }}
    >
      <div
        ref={trackRef}
        style={{
          display: "flex",
          gap: "2rem",
          width: "max-content",
          padding: "0 2rem",
        }}
      >
        {children}
      </div>
    </div>
  );
}
