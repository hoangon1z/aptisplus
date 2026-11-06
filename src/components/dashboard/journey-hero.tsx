"use client";
import { useId, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ArrowRight, Clock3, ListChecks, Play } from "lucide-react";
import { skills } from "@/lib/exams";
import styles from "./dashboard-v5.module.css";

gsap.registerPlugin(useGSAP, DrawSVGPlugin);

export function JourneyHero({
  skill,
  question,
  ready,
}: {
  skill: (typeof skills)[number];
  question?: number;
  ready: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  const uid = useId().replace(/:/g, "");
  useGSAP(
    (context) => {
      if (!ready) return;
      let active = true;
      const mm = gsap.matchMedia();
      const start = () =>
        context.add(() => {
          if (!active) return;
          mm.add("(prefers-reduced-motion: no-preference)", () => {
            root.current?.setAttribute("data-motion-state", "running");
            const tl = gsap.timeline({
              defaults: { ease: "power3.out" },
              onComplete: () =>
                root.current?.setAttribute("data-motion-state", "complete"),
            });
            tl.from(
              "[data-ribbon-rear]",
              {
                y: 60,
                rotation: -5,
                transformOrigin: "75% 80%",
                duration: 1.3,
              },
              0,
            )
              .from(
                "[data-ribbon-front]",
                {
                  y: 95,
                  scaleY: 0.6,
                  transformOrigin: "60% 100%",
                  duration: 1.45,
                },
                0.12,
              )
              .fromTo(
                "[data-ribbon-contour]",
                { drawSVG: "0%" },
                { drawSVG: "100%", duration: 1.5, stagger: 0.025 },
                0.25,
              )
              .from(
                "[data-ribbon-fold]",
                {
                  x: 45,
                  y: 28,
                  rotation: 5,
                  transformOrigin: "70% 70%",
                  duration: 1.3,
                },
                0.32,
              )
              .fromTo(
                "[data-ribbon-highlight]",
                { drawSVG: "0%" },
                { drawSVG: "100%", duration: 1.4 },
                0.65,
              )
              .from(
                "[data-hero-title]",
                { y: 16, clipPath: "inset(0 0 100% 0)", duration: 0.8 },
                0.15,
              )
              .from("[data-hero-action]", { x: -16, duration: 0.8 }, 0.4);
          });
        });
      void document.fonts.ready.then(start);
      return () => {
        active = false;
        mm.revert();
      };
    },
    { scope: root, dependencies: [ready], revertOnUpdate: true },
  );
  return (
    <section
      ref={root}
      className={styles.hero}
      aria-labelledby="journey-title"
      data-dashboard-hero
    >
      <div className={styles.heroArtwork} data-hero-artwork>
        <svg
          className={styles.ribbon}
          viewBox="0 0 1600 240"
          preserveAspectRatio="xMaxYMid slice"
          fill="none"
          aria-hidden="true"
          data-ribbon-art
        >
          <defs>
            <linearGradient
              id={`${uid}-rear`}
              x1="1350"
              y1="15"
              x2="1370"
              y2="235"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#ad9cff" />
              <stop offset=".36" stopColor="#5d4ad4" />
              <stop offset="1" stopColor="#282058" />
            </linearGradient>
            <linearGradient
              id={`${uid}-front`}
              x1="1000"
              y1="105"
              x2="1170"
              y2="250"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#d5caff" />
              <stop offset=".3" stopColor="#9a80ff" />
              <stop offset=".58" stopColor="#6450d9" />
              <stop offset="1" stopColor="#292255" />
            </linearGradient>
            <linearGradient
              id={`${uid}-fold`}
              x1="1130"
              y1="135"
              x2="1460"
              y2="240"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#3b3278" />
              <stop offset=".44" stopColor="#6454ca" />
              <stop offset=".7" stopColor="#9d90f4" />
              <stop offset="1" stopColor="#3d327e" />
            </linearGradient>
            <linearGradient id={`${uid}-edge`}>
              <stop stopColor="#9e88fc" stopOpacity="0" />
              <stop offset=".5" stopColor="#eee7ff" />
              <stop offset="1" stopColor="#af99ff" stopOpacity=".2" />
            </linearGradient>
          </defs>
          <g data-ribbon-rear>
            <path
              d="M700 230C930 240 1070 186 1280 68C1425-8 1610 10 1700 60L1700 240L700 240Z"
              fill={`url(#${uid}-rear)`}
            />
            {Array.from({ length: 12 }, (_, i) => (
              <path
                key={i}
                data-ribbon-contour
                d={`M700 230C930 ${240 - i * 0.4} 1070 ${186 + i * 1.8} 1280 ${68 + i * 4.7}C1425 ${-8 + i * 5.3} 1610 ${10 + i * 5.3} 1700 ${60 + i * 5.4}`}
                stroke="#c2b6ff"
                strokeOpacity={0.1 + i * 0.009}
                strokeWidth=".65"
              />
            ))}
          </g>
          <g data-ribbon-front>
            <path
              d="M300 240C720 234 890 172 1050 125C1185 86 1300 217 1410 200C1515 180 1700 122 1750 150L1750 240L300 240Z"
              fill={`url(#${uid}-front)`}
            />
            {Array.from({ length: 15 }, (_, i) => (
              <path
                key={i}
                data-ribbon-contour
                d={`M300 240C720 ${234 + i * 0.05} 890 ${172 + i * 2.1} ${1050 + i * 1.4} ${125 + i * 3}C${1185 + i * 0.35} ${86 + i * 4.5} ${1300 - i * 2} ${217 + i * 1.3} 1410 ${200 + i * 2.1}C1515 ${180 + i * 2.7} 1700 ${122 + i * 4.4} 1750 ${150 + i * 4.4}`}
                stroke="#eee7ff"
                strokeOpacity={0.035 + (14 - i) * 0.003}
                strokeWidth=".65"
              />
            ))}
            <path
              data-ribbon-highlight
              d="M300 240C720 234 890 172 1050 125C1185 86 1300 217 1410 200C1515 180 1700 122 1750 150"
              stroke={`url(#${uid}-edge)`}
              strokeWidth="2"
            />
          </g>
          <g data-ribbon-fold>
            <path
              d="M1050 125C1185 86 1300 217 1410 200C1360 218 1330 232 1300 240L1090 240C1190 208 1150 160 1050 125Z"
              fill={`url(#${uid}-fold)`}
            />
            <path
              data-ribbon-highlight
              d="M1050 125C1185 86 1300 217 1410 200C1515 180 1700 122 1750 150"
              stroke={`url(#${uid}-edge)`}
              strokeWidth="1.7"
            />
          </g>
        </svg>
      </div>
      <div className={styles.heroCopy}>
        <h2 id="journey-title" data-hero-title>
          {question !== undefined
            ? "Tiếp nối buổi luyện của bạn."
            : "Mỗi lần luyện, một bước tiến."}
        </h2>
        <p className={styles.heroTest}>
          {skill.name} Practice 01{" "}
          {question !== undefined && <span>· Câu {question}</span>}
        </p>
        <div className={styles.heroMeta}>
          <span>
            <Clock3 size={16} />
            {skill.time} phút
          </span>
          <span>
            <ListChecks size={16} />
            {skill.questions} câu lớn
          </span>
        </div>
        <div className={styles.heroActions} data-hero-action>
          <Link className={styles.primaryAction} href={`/exam/${skill.id}`}>
            <Play size={15} fill="currentColor" />
            {question !== undefined
              ? "Tiếp tục luyện tập"
              : "Bắt đầu luyện tập"}
          </Link>
          <Link href="/practice">
            Chọn bài khác <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
