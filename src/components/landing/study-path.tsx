"use client";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icon";
import { useScrollArtwork } from "@/lib/motion/use-scroll-artwork";
import styles from "./landing-journey.module.css";
const steps = [
  {
    title: "Chọn điều bạn muốn cải thiện.",
    text: "Bắt đầu với kỹ năng bạn cần thực hành hôm nay.",
    href: "/practice",
    action: "Chọn kỹ năng",
  },
  {
    title: "Làm quen trước khi tính giờ.",
    text: "Xem cấu trúc bài và đọc hướng dẫn trước khi bắt đầu.",
    href: "/exam/reading",
    action: "Khám phá bài Reading",
  },
  {
    title: "Dành thời gian để thực hành.",
    text: "Hoàn thành câu hỏi, đánh dấu phần cần xem lại và nộp bài.",
    href: "/exam/listening",
    action: "Mở bài Listening",
  },
  {
    title: "Nhìn lại câu trả lời của mình.",
    text: "Mở lịch sử để đọc lại bài làm và nghe bản ghi Speaking đã lưu.",
    href: "/results",
    action: "Mở lịch sử bài làm",
  },
  {
    title: "Tạo nhịp luyện tập của bạn.",
    text: "Chủ động thêm lịch luyện và quay lại bài còn dang dở trong dashboard.",
    href: "/dashboard",
    action: "Lên lịch luyện tập",
  },
];
export function StudyPath() {
  const [active, setActive] = useState(0);
  const root = useScrollArtwork((tl) => {
    tl.fromTo(
      "[data-study-route]",
      { drawSVG: "0%" },
      { drawSVG: "100%", duration: 4, ease: "none" },
      0,
    )
      .fromTo(
        "[data-study-branch]",
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 1, stagger: 0.5 },
        0.5,
      )
      .from(
        "[data-study-checkpoint]",
        { scale: 0.4, transformOrigin: "center", duration: 0.5, stagger: 0.65 },
        0.1,
      );
    tl.eventCallback("onUpdate", () =>
      setActive(Math.min(4, Math.floor(tl.progress() * 5))),
    );
  });
  const item = steps[active];
  return (
    <section
      ref={root}
      className={`${styles.section} ${styles.study}`}
      id="study-path"
      data-landing-section="study"
    >
      <div className={styles.journeyIntro}>
        <h2 data-editorial-heading>
          Bước tiếp theo,
          <br />
          <em>do bạn chủ động.</em>
        </h2>
        <p>
          Một quy trình luyện tập rõ ràng. Chưa cần một kế hoạch hoàn hảo—chỉ
          cần biết hôm nay bắt đầu từ đâu.
        </p>
      </div>
      <div className={styles.studyCanvas}>
        <svg viewBox="0 0 1000 340" aria-hidden="true">
          <path
            data-study-route
            d="M65 250C170 250 150 150 275 150S390 255 485 215S580 65 700 100S825 170 945 45"
            fill="none"
            stroke="#514FE4"
            strokeWidth="2"
          />
          <path
            data-study-branch
            d="M275 150C275 80 350 50 440 50M485 215c0 55 80 95 170 75M700 100c0-50 35-65 90-65"
            fill="none"
            stroke="#C6BDF0"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
          <path
            d="M550 171c51-68 91-108 145-84 22 10 40 25 66 21-29 12-49-4-68-10-46-16-90 26-143 73Z"
            fill="#EEEDFF"
          />
          {[
            [65, 250],
            [275, 150],
            [485, 215],
            [700, 100],
            [945, 45],
          ].map(([x, y], i) => (
            <g key={i} data-study-checkpoint transform={`translate(${x} ${y})`}>
              <circle
                r={active === i ? 10 : 6}
                fill={active === i ? "#514FE4" : "white"}
                stroke="#514FE4"
                strokeWidth="1.3"
              />
              <text
                x="0"
                y="-23"
                textAnchor="middle"
                fill="#7A719F"
                fontSize="10"
              >
                {i + 1}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className={styles.studyDetails}>
        <div
          className={styles.stepTabs}
          role="group"
          aria-label="Các bước luyện tập"
        >
          {steps.map((s, i) => (
            <button
              key={s.title}
              onClick={() => setActive(i)}
              aria-pressed={active === i}
            >
              {i + 1}
              <span>
                {["Chọn", "Khám phá", "Thực hành", "Xem lại", "Tiếp tục"][i]}
              </span>
            </button>
          ))}
        </div>
        <div>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
          <Link href={item.href} className={styles.textLink}>
            {item.action}
            <Icon name="north_east" />
          </Link>
        </div>
      </div>
    </section>
  );
}
