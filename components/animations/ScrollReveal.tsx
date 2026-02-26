"use client";

import { useRef, useEffect, type ReactNode, type CSSProperties, type ElementType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type AnimationVariant =
  | "fadeUp"
  | "fadeDown"
  | "fadeLeft"
  | "fadeRight"
  | "scaleUp"
  | "rotateIn"
  | "clipReveal"
  | "blur";

interface ScrollRevealProps {
  children: ReactNode;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
  threshold?: number;
  once?: boolean;
  as?: ElementType;
}

const variantConfig: Record<AnimationVariant, gsap.TweenVars> = {
  fadeUp: { y: 60, opacity: 0 },
  fadeDown: { y: -60, opacity: 0 },
  fadeLeft: { x: -80, opacity: 0 },
  fadeRight: { x: 80, opacity: 0 },
  scaleUp: { scale: 0.85, opacity: 0 },
  rotateIn: { rotation: 8, y: 40, opacity: 0, transformOrigin: "left bottom" },
  clipReveal: { clipPath: "inset(100% 0 0 0)", opacity: 0 },
  blur: { filter: "blur(20px)", opacity: 0, y: 30 },
};

export default function ScrollReveal({
  children,
  variant = "fadeUp",
  delay = 0,
  duration = 0.9,
  className,
  style,
  threshold = 0.15,
  once = true,
  as: Tag = "div",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const from = variantConfig[variant];
    const to: gsap.TweenVars = {
      ...Object.fromEntries(
        Object.keys(from).map((k) => [
          k,
          k === "opacity" ? 1 : k === "scale" ? 1 : k === "rotation" ? 0 : k === "filter" ? "blur(0px)" : k === "clipPath" ? "inset(0% 0 0 0)" : 0,
        ])
      ),
      duration,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: `top ${100 - threshold * 100}%`,
        toggleActions: once ? "play none none none" : "play reverse play reverse",
      },
    };

    gsap.fromTo(el, from, to);

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [variant, delay, duration, threshold, once]);

  const Component = Tag as any;

  return (
    <Component ref={ref} className={className} style={{ willChange: "transform, opacity", ...style }}>
      {children}
    </Component>
  );
}
