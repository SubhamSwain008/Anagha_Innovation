"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Generic page animation wrapper that adds scroll-triggered reveals
 * to cards, section titles, hero elements, and value cards.
 */
export default function PageAnimations({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Hero section entrance ────────────────────────
      const heroEl = document.querySelector(".page-hero");
      if (heroEl) {
        gsap.fromTo(heroEl,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        );
      }

      // ── Section titles ───────────────────────────────
      gsap.utils.toArray<HTMLElement>(".gsap-reveal").forEach((el) => {
        gsap.fromTo(el,
          { y: 50, opacity: 0 },
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

      // ── Stagger cards ────────────────────────────────
      gsap.utils.toArray<HTMLElement>(".gsap-stagger-parent").forEach((parent) => {
        const children = parent.querySelectorAll(".gsap-stagger-child");
        if (children.length) {
          gsap.fromTo(children,
            { y: 60, opacity: 0, scale: 0.95 },
            {
              y: 0, opacity: 1, scale: 1,
              duration: 0.7,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: parent,
                start: "top 82%",
              },
            }
          );
        }
      });

      // ── Fade in elements ─────────────────────────────
      gsap.utils.toArray<HTMLElement>(".gsap-fade-in").forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
            },
          }
        );
      });

      // ── Slide from left ──────────────────────────────
      gsap.utils.toArray<HTMLElement>(".gsap-slide-left").forEach((el) => {
        gsap.fromTo(el,
          { x: -60, opacity: 0 },
          {
            x: 0, opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            },
          }
        );
      });

      // ── Slide from right ─────────────────────────────
      gsap.utils.toArray<HTMLElement>(".gsap-slide-right").forEach((el) => {
        gsap.fromTo(el,
          { x: 60, opacity: 0 },
          {
            x: 0, opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            },
          }
        );
      });

      // ── Scale up ─────────────────────────────────────
      gsap.utils.toArray<HTMLElement>(".gsap-scale-up").forEach((el) => {
        gsap.fromTo(el,
          { scale: 0.85, opacity: 0 },
          {
            scale: 1, opacity: 1,
            duration: 0.7,
            ease: "back.out(1.5)",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
            },
          }
        );
      });

      // ── Parallax blobs ───────────────────────────────
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

      // ── Card tilt on hover ───────────────────────────
      gsap.utils.toArray<HTMLElement>(".tilt-card").forEach((card) => {
        const handleMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(card, {
            rotateY: x * 6,
            rotateX: -y * 6,
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
