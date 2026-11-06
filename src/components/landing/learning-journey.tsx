"use client";
import { useState } from "react";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import gsap from "gsap";
import { useScrollArtwork } from "@/lib/motion/use-scroll-artwork";
import styles from "./landing-journey.module.css";
gsap.registerPlugin(MotionPathPlugin);
const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
const points = [
  [70, 350],
  [270, 275],
  [470, 320],
  [680, 175],
  [910, 190],
  [1130, 65],
];
const route =
  "M70 350C160 350 180 275 270 275S380 320 470 320S590 175 680 175S820 190 910 190S1040 65 1130 65";
const descriptions = [
  "Bắt đầu bằng những điều quen thuộc.",
  "Kết nối từ ngữ với cuộc sống.",
  "Diễn đạt điều bạn muốn nói.",
  "Làm rõ ý tưởng. Vững vàng hơn.",
  "Linh hoạt trong từng ngữ cảnh.",
  "Tiếp tục mở rộng khả năng ngôn ngữ.",
];
export function LearningJourney() {
  const [active, setActive] = useState(0);
  const root = useScrollArtwork((tl, el) => {
    const path = el.querySelector<SVGPathElement>("[data-learning-route]")!;
    tl.addLabel("journey:begin", 0)
      .fromTo(
        path,
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 5, ease: "none" },
        0,
      )
      .from(
        "[data-level-marker]",
        {
          scale: 0.6,
          transformOrigin: "50% 50%",
          opacity: 0.2,
          stagger: 0.65,
          duration: 0.55,
        },
        0,
      )
      .fromTo(
        "[data-route-echo]",
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 5, stagger: 0.15, ease: "none" },
        0.15,
      )
      .from(
        "[data-level-ribbon]",
        { scaleX: 0.1, transformOrigin: "0% 50%", duration: 1.1, stagger: 0.6 },
        2.5,
      )
      .to(
        "[data-route-traveler]",
        {
          motionPath: { path, align: path, alignOrigin: [0.5, 0.5] },
          duration: 5,
          ease: "none",
        },
        0,
      );
    tl.eventCallback("onUpdate", () =>
      setActive(Math.min(5, Math.floor(tl.progress() * 6))),
    );
  });
  return (
    <section
      ref={root}
      className={styles.journey}
      id="journey"
      data-landing-section="journey"
    >
      <div className={styles.journeyIntro}>
        <h2 data-editorial-heading>
          Mỗi mục tiêu,
          <br />
          <em>một điểm bắt đầu.</em>
        </h2>
        <p>
          Đi từng bước, để tiếng Anh trở thành điều bạn có thể sử dụng. Chọn một
          kỹ năng và bắt đầu từ bài luyện hôm nay.
        </p>
      </div>
      <div className={styles.journeyCanvas}>
        <svg
          viewBox="0 0 1200 450"
          role="img"
          aria-label="Hành trình CEFR tổng quát từ A1 đến C2"
        >
          <defs>
            <linearGradient id="learning-ribbon" x2="1" y2="1">
              <stop stopColor="#514FE4" />
              <stop offset="1" stopColor="#BAB4FF" />
            </linearGradient>
          </defs>
          <path
            data-route-echo
            d={route}
            transform="translate(0 14)"
            stroke="#DCD9F4"
            strokeWidth="1"
            fill="none"
          />
          <path
            data-route-echo
            d={route}
            transform="translate(0 22)"
            stroke="#EEEDFF"
            strokeWidth=".8"
            fill="none"
          />
          <path
            data-learning-route
            d={route}
            stroke="#514FE4"
            strokeWidth="2"
            fill="none"
          />
          <path
            data-level-ribbon
            d="M570 224C620 190 650 138 704 148c30 5 45 30 72 37-47 3-63-13-83-13-46-1-77 53-123 52Z"
            fill="url(#learning-ribbon)"
          />
          <path
            data-level-ribbon
            d="M812 213c56-15 64-60 110-54 34 4 42 22 72 10-27 29-57 20-75 14-41-13-65 32-107 30Z"
            fill="url(#learning-ribbon)"
          />
          {points.map(([x, y], i) => (
            <g
              key={levels[i]}
              data-level-marker
              transform={`translate(${x} ${y})`}
              className={active === i ? styles.activeMarker : ""}
            >
              <path
                d="M0 -8V8M-8 0H8"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <text
                x="0"
                y="-32"
                textAnchor="middle"
                className={
                  i === 3 || i === 4 ? styles.goalLabel : styles.levelLabel
                }
              >
                {levels[i]}
              </text>
              <text
                x="0"
                y="38"
                textAnchor="middle"
                className={styles.levelCaption}
              >
                {i === 3 || i === 4 ? "MỤC TIÊU CỦA BẠN" : "CEFR"}
              </text>
            </g>
          ))}
          <circle
            data-route-traveler
            r="5"
            fill="#161A35"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div className={styles.journeyFoot}>
        <p>
          <strong>{levels[active]}</strong>
          {descriptions[active]}
        </p>
        <small>
          A1–C2 minh họa khung CEFR tổng quát, không phải phạm vi đánh giá của
          mọi phiên bản Aptis ESOL.
        </small>
      </div>
    </section>
  );
}
