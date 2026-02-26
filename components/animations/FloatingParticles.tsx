"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

interface FloatingParticlesProps {
  count?: number;
  color?: string;
}

export default function FloatingParticles({ count = 20, color = "var(--primary)" }: FloatingParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      const size = gsap.utils.random(3, 8);
      const isCircle = Math.random() > 0.3;

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: ${isCircle ? "50%" : "2px"};
        opacity: 0;
        pointer-events: none;
        will-change: transform, opacity;
      `;

      container.appendChild(particle);
      particles.push(particle);

      const startX = gsap.utils.random(0, 100);
      const startY = gsap.utils.random(0, 100);

      gsap.set(particle, {
        left: `${startX}%`,
        top: `${startY}%`,
      });

      gsap.to(particle, {
        opacity: gsap.utils.random(0.15, 0.45),
        duration: gsap.utils.random(1, 2),
        delay: gsap.utils.random(0, 3),
      });

      gsap.to(particle, {
        x: `+=${gsap.utils.random(-120, 120)}`,
        y: `+=${gsap.utils.random(-120, 120)}`,
        rotation: gsap.utils.random(-180, 180),
        duration: gsap.utils.random(8, 18),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: gsap.utils.random(0, 5),
      });
    }

    return () => {
      particles.forEach((p) => {
        gsap.killTweensOf(p);
        p.remove();
      });
    };
  }, [count, color]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
