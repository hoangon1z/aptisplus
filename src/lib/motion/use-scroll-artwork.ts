"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin);
export function useScrollArtwork(
  build: (tl: gsap.core.Timeline, el: HTMLElement) => void,
  end = "bottom 45%",
) {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "top 78%",
              end,
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          });
          build(tl, el);
          const h = el.querySelector("[data-editorial-heading]");
          let split: SplitText | undefined;
          if (h)
            split = SplitText.create(h, {
              type: "lines",
              mask: "lines",
              autoSplit: true,
              onSplit(self) {
                return gsap.from(self.lines, {
                  yPercent: 105,
                  rotationX: -8,
                  duration: 0.85,
                  stagger: 0.12,
                  ease: "power4.out",
                  scrollTrigger: { trigger: h, start: "top 88%", once: true },
                });
              },
            });
          return () => split?.revert();
        },
        root,
      );
      return () => mm.revert();
    },
    { scope: root },
  );
  return root;
}
