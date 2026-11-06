import { useId } from "react";
import { A_BODY, A_PLUS, A_RIBBON } from "./aptisplus-symbol";

// Normalized stage coordinates, relative to the viewport center.
// Each CEFR object owns one cubic trajectory and one tapered ribbon.
export const INTRO_ROUTES = [
  { start: [-300, 96], c1: [-360, 90], c2: [-440, -70], end: [-475, -190] },
  { start: [-190, 132], c1: [-300, 180], c2: [-285, 280], end: [-180, 340] },
  { start: [-75, 151], c1: [-135, 210], c2: [-70, 300], end: [30, 355] },
  { start: [65, 142], c1: [180, 210], c2: [290, 280], end: [390, 265] },
  { start: [210, 102], c1: [340, 40], c2: [320, -170], end: [430, -290] },
  { start: [310, 39], c1: [345, -50], c2: [190, -255], end: [70, -345] },
];
export function trajectoryPath(i: number, sx = 1, sy = 1) {
  const r = INTRO_ROUTES[i];
  const point = (p: number[]) => `${p[0] * sx} ${p[1] * sy}`;
  return `M ${point(r.start)} C ${point(r.c1)} ${point(r.c2)} ${point(r.end)}`;
}
export function IntroTrails() {
  return (
    <svg
      viewBox="-500 -380 1000 760"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        data-seed-stroke
        d="M-32 0H32"
        stroke="#514FE4"
        strokeWidth="1.5"
        fill="none"
      />
      {INTRO_ROUTES.map((_, i) => (
        <g key={i} data-trajectory-group={i}>
          <path
            data-intro-trail={i}
            d={trajectoryPath(i)}
            fill="none"
            stroke={i === 3 || i === 4 ? "#8A81F2" : "#D0CDF2"}
            strokeWidth={i === 3 || i === 4 ? 1.15 : 0.65}
          />
          <path
            data-intro-trail-echo={i}
            d={trajectoryPath(i)}
            transform={`translate(${i % 2 ? 7 : -7} 8)`}
            fill="none"
            stroke="#EEEDFF"
            strokeWidth=".75"
          />
        </g>
      ))}
    </svg>
  );
}
export function IntroRibbonFragment({ index }: { index: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 140 50" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={index % 2 ? "#DAD4FF" : "#514FE4"} />
          <stop offset=".5" stopColor={index % 2 ? "#8277FF" : "#8277FF"} />
          <stop offset="1" stopColor={index % 2 ? "#F7F5FF" : "#3831D5"} />
        </linearGradient>
      </defs>
      <g data-fragment-fold>
        <path
          d="M2 39C30 40 45 4 78 6c25 1 39 25 60 9-17 26-40 27-63 13C47 11 35 49 2 39Z"
          fill={`url(#${id})`}
        />
        <path
          d="M2 39C32 38 47 7 78 8c24 1 38 22 60 7"
          stroke="#EEEDFF"
          strokeWidth=".65"
        />
      </g>
    </svg>
  );
}

/** Clipped pieces partition the exact supplied geometry, without redesigning it. */
export function IntroBrandRig() {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 270 252"
      role="img"
      aria-label="AptisPlus A+"
      data-intro-logo-svg
    >
      <defs>
        <linearGradient id={id + "body"} x1=".1" y1=".1" x2=".95" y2="1">
          <stop stopColor="#8277FF" />
          <stop offset=".43" stopColor="#5C51F5" />
          <stop offset="1" stopColor="#3831D5" />
        </linearGradient>
        <linearGradient id={id + "ribbon"} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#DAD4FF" />
          <stop offset=".48" stopColor="#9D96F8" />
          <stop offset="1" stopColor="#F7F5FF" />
        </linearGradient>
        <clipPath id={id + "left"}>
          <path d="M0 0H110V252H0Z" />
        </clipPath>
        <clipPath id={id + "crown"}>
          <path d="M110 0H145V106H110Z" />
        </clipPath>
        <clipPath id={id + "right"}>
          <path d="M145 0H270V252H110V106H145Z" />
        </clipPath>
        <clipPath id={id + "rear"}>
          <path d="M0 0H125V252H0Z" />
        </clipPath>
        <clipPath id={id + "front"}>
          <path d="M125 0H270V252H125Z" />
        </clipPath>
      </defs>
      <path
        data-brand-outline
        d={A_BODY}
        fill="none"
        stroke="#514FE4"
        strokeWidth=".8"
      />
      {["left", "crown", "right"].map((part) => (
        <g key={part} data-brand-part={part}>
          <g clipPath={`url(#${id + part})`}>
            <path d={A_BODY} fill={`url(#${id}body)`} />
          </g>
        </g>
      ))}
      {["rear", "front"].map((part) => (
        <g key={part} data-brand-part={part}>
          <g clipPath={`url(#${id + part})`}>
            <path d={A_RIBBON} fill={`url(#${id}ribbon)`} />
          </g>
        </g>
      ))}
      <g data-brand-part="plus">
        <path d={A_PLUS} fill="#514FE4" />
      </g>
      {/* Seam-free rest geometry replaces the settled clipped pieces at identical coordinates. */}
      <g data-brand-resolved visibility="hidden">
        <path d={A_BODY} fill={`url(#${id}body)`} />
        <path d={A_RIBBON} fill={`url(#${id}ribbon)`} />
        <path d={A_PLUS} fill="#514FE4" />
      </g>
    </svg>
  );
}
