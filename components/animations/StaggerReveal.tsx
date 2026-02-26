"use client";

import { useRef, useEffect, type ReactNode, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface StaggerRevealProps {
  children: ReactNode;
  stagger?: number;
  delay?: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
  childSelector?: string;
  from?: "bottom" | "left" | "right" | "scale";
}

export default function StaggerReveal({
  children,
  stagger = 0.12,
  delay = 0,
  duration = 0.7,
  className,
  style,
  childSelector = ":scope > *",
  from = "bottom",
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = el.querySelectorAll(childSelector);
    if (!items.length) return;

    const fromVars: gsap.TweenVars = {
      bottom: { y: 50, opacity: 0 },
      left: { x: -60, opacity: 0 },
      right: { x: 60, opacity: 0 },
      scale: { scale: 0.8, opacity: 0 },
    }[from];

    const toVars: gsap.TweenVars = {
      bottom: { y: 0, opacity: 1 },
      left: { x: 0, opacity: 1 },
      right: { x: 0, opacity: 1 },
      scale: { scale: 1, opacity: 1 },
    }[from];

    gsap.fromTo(items, fromVars, {
      ...toVars,
      duration,
      delay,
      stagger,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [stagger, delay, duration, childSelector, from]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
