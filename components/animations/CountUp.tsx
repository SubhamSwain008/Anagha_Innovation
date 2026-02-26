"use client";

import { useRef, useEffect, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface CountUpProps {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
  style?: CSSProperties;
}

export default function CountUp({
  end,
  prefix = "",
  suffix = "",
  duration = 2,
  decimals = 0,
  className,
  style,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const countRef = useRef({ value: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const anim = gsap.to(countRef.current, {
      value: end,
      duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none none",
      },
      onUpdate: () => {
        el.textContent = `${prefix}${countRef.current.value.toFixed(decimals)}${suffix}`;
      },
    });

    return () => {
      anim.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [end, prefix, suffix, duration, decimals]);

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}0{suffix}
    </span>
  );
}
