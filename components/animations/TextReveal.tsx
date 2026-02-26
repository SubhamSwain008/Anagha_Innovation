"use client";

import { useRef, useEffect, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  text: string;
  className?: string;
  style?: CSSProperties;
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  mode?: "words" | "chars" | "lines";
  stagger?: number;
  duration?: number;
  delay?: number;
}

export default function TextReveal({
  text,
  className,
  style,
  tag: Tag = "h2",
  mode = "words",
  stagger = 0.04,
  duration = 0.6,
  delay = 0,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let items: string[];
    if (mode === "chars") {
      items = text.split("");
    } else if (mode === "words") {
      items = text.split(" ");
    } else {
      items = text.split("\n");
    }

    el.innerHTML = items
      .map(
        (item) =>
          `<span style="display:inline-block;overflow:hidden;vertical-align:top;"><span class="tr-inner" style="display:inline-block;transform:translateY(110%);opacity:0;">${item}${mode === "words" ? "&nbsp;" : ""}</span></span>`
      )
      .join("");

    const inners = el.querySelectorAll(".tr-inner");

    gsap.to(inners, {
      y: "0%",
      opacity: 1,
      duration,
      stagger,
      delay,
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
  }, [text, mode, stagger, duration, delay]);

  return <Tag ref={ref as any} className={className} style={style}>{text}</Tag>;
}
