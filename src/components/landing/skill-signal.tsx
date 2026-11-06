"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
export const SIGNAL_SHAPES = Array.from({ length: 5 }, (_, i) => [
  `M20 ${84 + i * 18}C70 ${84 + i * 12} 75 ${25 + i * 3} 100 ${80 + i * 15}S145 ${150 - i * 7} 175 ${82 + i * 14}S225 ${20 + i * 10} 250 ${83 + i * 15}S305 ${165 - i * 4} 330 ${84 + i * 16}S400 ${42 + i * 12} 460 ${84 + i * 16}`,
  `M20 ${50 + i * 29}C110 ${50 + i * 29} 190 ${50 + i * 29} 245 ${50 + i * 29}S370 ${50 + i * 29} ${i % 2 ? 400 : 460} ${50 + i * 29}`,
  `M${40 + i * 14} 125C${40 + i * 14} ${25 + i * 15} ${420 - i * 14} ${25 + i * 15} ${420 - i * 14} 125S${100 + i * 14} ${235 - i * 15} ${90 + i * 14} 155`,
  `M${40 + i * 2} ${48 + i * 30}C120 ${48 + i * 30} 200 ${48 + i * 30} 255 ${48 + i * 30}S340 ${48 + i * 30} ${i === 4 ? 280 : 440 - (i % 2) * 45} ${48 + i * 30}`,
]);
export function SkillSignal({ active }: { active: number }) {
  const root = useRef<SVGSVGElement>(null);
  useGSAP(
    () => {
      if (
        matchMedia(
          "(max-width:899px), (pointer:coarse), (prefers-reduced-motion:reduce)",
        ).matches
      )
        root.current
          ?.querySelectorAll("[data-skill-signal]")
          .forEach((p, i) =>
            gsap.set(p, { attr: { d: SIGNAL_SHAPES[i][active] } }),
          );
    },
    { scope: root, dependencies: [active], revertOnUpdate: true },
  );
  return (
    <svg
      ref={root}
      viewBox="0 0 480 240"
      aria-hidden="true"
      className="connected-skill-signal"
    >
      <path
        d="M14 218C100 225 390 225 466 218"
        stroke="#A69BEA"
        opacity=".25"
        fill="none"
      />
      {SIGNAL_SHAPES.map((s, i) => (
        <path
          key={i}
          data-skill-signal={i}
          d={s[0]}
          stroke={i === 2 ? "#B5A9FF" : "#AAA0F3"}
          strokeWidth={i === 2 ? 2.2 : 1.4}
          opacity={1 - i * 0.1}
          fill="none"
          strokeLinecap="round"
        />
      ))}
      <path
        d="M30 30v-12h28M450 210v12h-28"
        stroke="#A69BEA"
        strokeWidth=".7"
        fill="none"
      />
    </svg>
  );
}
