"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Client wrapper that adds GSAP scroll-triggered animations
 * to sections/cards on the homepage. Works around Next.js server components.
 */
export default function HomeAnimations({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Stat counters pulse ──────────────────────────
      gsap.utils.toArray<HTMLElement>(".stat-value").forEach((el) => {
        gsap.fromTo(el,
          { scale: 0.6, opacity: 0, y: 20 },
          {
            scale: 1, opacity: 1, y: 0,
            duration: 0.8,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
            },
          }
        );
      });

      // ── Category cards stagger ───────────────────────
      const catCards = gsap.utils.toArray<HTMLElement>(".cat-card");
      if (catCards.length) {
        gsap.fromTo(catCards,
          { y: 60, opacity: 0, scale: 0.92 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.65,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: catCards[0].parentElement,
              start: "top 82%",
            },
          }
        );
      }

      // ── Product cards stagger ────────────────────────
      const prodCards = gsap.utils.toArray<HTMLElement>(".prod-card");
      if (prodCards.length) {
        gsap.fromTo(prodCards,
          { y: 80, opacity: 0, rotation: 2 },
          {
            y: 0, opacity: 1, rotation: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: prodCards[0].parentElement,
              start: "top 80%",
            },
          }
        );
      }

      // ── Why-us cards stagger ─────────────────────────
      const whyCards = gsap.utils.toArray<HTMLElement>(".why-card");
      if (whyCards.length) {
        gsap.fromTo(whyCards,
          { x: -50, opacity: 0 },
          {
            x: 0, opacity: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: whyCards[0].parentElement,
              start: "top 82%",
            },
          }
        );
      }

      // ── Section titles ───────────────────────────────
      gsap.utils.toArray<HTMLElement>(".gsap-section-title").forEach((el) => {
        gsap.fromTo(el,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
            },
          }
        );
      });

      // ── CTA section ──────────────────────────────────
      const ctaSection = document.querySelector(".cta-section");
      if (ctaSection) {
        gsap.fromTo(ctaSection,
          { y: 30, opacity: 0, scale: 0.97 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaSection,
              start: "top 85%",
            },
          }
        );
      }

      // ── Parallax decorative blobs ────────────────────
      gsap.utils.toArray<HTMLElement>(".parallax-blob").forEach((el) => {
        gsap.to(el, {
          y: -80,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      });

      // ── Card hover tilt ──────────────────────────────
      gsap.utils.toArray<HTMLElement>(".tilt-card").forEach((card) => {
        const handleMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(card, {
            rotateY: x * 8,
            rotateX: -y * 8,
            transformPerspective: 800,
            duration: 0.4,
            ease: "power2.out",
          });
        };
        const handleLeave = () => {
          gsap.to(card, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.4)",
          });
        };
        card.addEventListener("mousemove", handleMove);
        card.addEventListener("mouseleave", handleLeave);
      });

    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return <div ref={wrapRef}>{children}</div>;
}
